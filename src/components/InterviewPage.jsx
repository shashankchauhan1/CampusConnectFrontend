// client/src/components/InterviewPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const InterviewPage = () => {
  const [topic, setTopic] = useState('Data Structures');
  const [company, setCompany] = useState('Google');
  const [hasStarted, setHasStarted] = useState(false);
  const [history, setHistory] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { speak, isSpeaking } = useSpeechSynthesis();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  // This useEffect syncs the speech transcript to our answer state
  useEffect(() => {
    if (transcript) {
      setUserAnswer(transcript);
    }
  }, [transcript]);

  // This useEffect now ONLY handles scrolling to the bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) axios.defaults.headers.common['x-auth-token'] = token;
      
      const res = await axios.post('http://localhost:3001/api/ai/interview', { topic, company, history: [] });
      const newHistory = res.data.updatedHistory;
      setHistory(newHistory);
      setHasStarted(true);

      // We find the new message and speak it directly, only once.
      const roopsReply = newHistory.find(turn => turn.role === 'model');
      if (roopsReply) {
        speak(roopsReply.parts[0].text);
      }
    } catch (error) {
      console.error("Failed to start interview", error);
      alert("Error starting interview. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (isListening) stopListening();
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    const newHistoryWithUserAnswer = [...history, { role: 'user', parts: [{ text: userAnswer }] }];
    setHistory(newHistoryWithUserAnswer);
    setUserAnswer('');
    resetTranscript();

    try {
      const res = await axios.post('http://localhost:3001/api/ai/interview', { 
        history: newHistoryWithUserAnswer,
        userAnswer, 
        topic, 
        company 
      });
      const newHistoryFromServer = res.data.updatedHistory;
      
      // We find the newest message from the server and speak it directly, only once.
      const roopsReply = newHistoryFromServer[newHistoryFromServer.length - 1];
      if (roopsReply && roopsReply.role === 'model') {
        speak(roopsReply.parts[0].text);
      }
      setHistory(newHistoryFromServer);
    } catch (error) {
      console.error("Failed to submit answer", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">AI Interview Practice</h1>
          <p className="text-lg text-gray-300 mb-8">Prepare for your technical interviews with Roop, your personal AI interviewer.</p>
          <form onSubmit={handleStartInterview} className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-semibold">Target Company</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"/>
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-semibold">Interview Topic</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"/>
            </div>
            <button type="submit" disabled={isLoading} className="w-full mt-4 py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400">
              {isLoading ? 'Preparing...' : 'Start Interview'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col h-[calc(100vh-200px)] bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        {/* Chat Transcript */}
        <div className="flex-grow overflow-y-auto p-6">
          {history.map((turn, index) => (
            <div key={index} className={`my-4 flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-lg inline-block max-w-2xl ${
                turn.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-white'
              }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{turn.parts[0].text}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-700">
          <div className="p-4 bg-gray-900 rounded-lg min-h-[80px] mb-4">
            <p className="text-white">{userAnswer || <span className="text-gray-400">Your transcribed answer will appear here...</span>}</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || isLoading}
              className={`p-4 rounded-full transition duration-300 disabled:opacity-50 ${isListening ? 'bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              <span className="text-white text-3xl">🎙️</span>
            </button>
            <form onSubmit={handleSubmitAnswer} className="w-full">
              <button type="submit" disabled={isLoading || isSpeaking || isListening || !userAnswer} className="w-full py-4 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-500">
                {isLoading ? 'Roop is Thinking...' : 'Submit Answer'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;