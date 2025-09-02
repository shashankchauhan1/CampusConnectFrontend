// client/src/components/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  const { userId: recipientId } = useParams();
  const myToken = localStorage.getItem('token');
  const senderId = myToken ? JSON.parse(atob(myToken.split('.')[1])).user.id : null;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.defaults.headers.common['x-auth-token'] = token;
    
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/messages/${recipientId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      }
    };
    fetchHistory();

    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    newSocket.emit('add-user', senderId);
    return () => newSocket.close();
  }, [recipientId, senderId]);

  useEffect(() => {
    if (socket) {
      socket.on('private-message', (data) => {
        // This listener now handles all incoming messages, including your own.
        // A check to prevent rare duplicate messages.
        setMessages((prev) => (prev.some(msg => msg._id === data._id) ? prev : [...prev, data]));
      });
      socket.on('message-deleted', ({ messageId }) => {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      });
      socket.on('message-edited', ({ messageId, newContent }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, content: newContent, isEdited: true } : msg
          )
        );
      });
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ## THIS IS THE CORRECTED FUNCTION ##
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      // 1. Only emit the message to the server.
      socket.emit('private-message', { recipientId, message: newMessage });
      
      // 2. Clear the input. We will NOT add the message to the state here.
      // We wait for the server to send it back to us via the 'private-message' listener.
      setNewMessage('');
    }
  };
  
  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      socket.emit('delete-message', { messageId });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    }
  };

  const handleSaveEdit = () => {
    if (editingMessage.content.trim()) {
      socket.emit('edit-message', {
        messageId: editingMessage.id,
        newContent: editingMessage.content,
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === editingMessage.id
            ? { ...msg, content: editingMessage.content, isEdited: true }
            : msg
        )
      );
      setEditingMessage(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] container mx-auto px-6 py-8">
      <div className="flex-grow overflow-y-auto p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-end my-2 ${msg.sender === senderId ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setHoveredMessageId(msg._id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md relative group ${
                msg.sender === senderId ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-white'
            }`}>
              {editingMessage?.id === msg._id ? (
                // Editing View
                <div>
                  <input
                    type="text"
                    value={editingMessage.content}
                    onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
                    className="bg-gray-700 border-b border-white text-white w-full focus:outline-none"
                    autoFocus
                  />
                  <div className="text-xs mt-2">
                    <button onClick={handleSaveEdit} className="text-green-400 hover:underline mr-2">Save</button>
                    <button onClick={() => setEditingMessage(null)} className="text-red-400 hover:underline">Cancel</button>
                  </div>
                </div>
              ) : (
                // Normal View with Timestamp
                <div>
                  <p className="break-words">{msg.content}</p>
                  {msg.isEdited && <span className="text-xs text-gray-400 font-light">(edited)</span>}
                  
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </div>

            {/* Edit/Delete Icons */}
            {msg.sender === senderId && hoveredMessageId === msg._id && !editingMessage && (
              <div className="flex space-x-2 ml-2 text-gray-400">
                <button onClick={() => setEditingMessage({ id: msg._id, content: msg.content })} title="Edit">✏️</button>
                <button onClick={() => handleDeleteMessage(msg._id)} title="Delete">🗑️</button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <button
          type="submit"
          className="px-6 py-2 text-white font-semibold bg-indigo-600 rounded-r-lg hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;