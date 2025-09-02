// client/src/components/ConversationsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/messages/conversations/all');
        setConversations(res.data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) {
    return <div className="text-center text-white p-10">Loading conversations...</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-8">
      <main className="container mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-white mb-8">My Conversations</h2>
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          {conversations.length > 0 ? (
            <ul className="space-y-4">
              {conversations.map((convo) => (
                <Link to={`/chat/${convo.partner._id}`} key={convo.partner._id}>
                  <li className="p-4 bg-gray-700 rounded-lg flex justify-between items-center transition duration-300 hover:bg-gray-600 cursor-pointer">
                    <div>
                      <p className="font-semibold text-white text-lg">{convo.partner.name}</p>
                      <p className="text-sm text-gray-400 truncate max-w-md">{convo.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(convo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">You have no active conversations.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConversationsPage;