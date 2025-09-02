// client/src/components/InterviewPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const InterviewPage = () => {
  const [topic, setTopic] = useState('Data Structures');
  const [company, setCompany] = useState('Google');
  const [hasStarted, setHasStarted] = useState(false);
  const [history, setHistory] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Markdown styling components remain the same
  const markdownComponents = { /* ... */ };

  // ## ADD THIS ENTIRE useEffect HOOK ##
  // This hook runs once to set the authentication token for all API calls from this page.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }
  }, []); // The empty array ensures this runs only once when the page loads

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/ai/interview', { topic, company, history: [] });
      setHistory(res.data.updatedHistory);
      setHasStarted(true);
    } catch (error) {
      console.error("Failed to start interview", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/ai/interview', { history, userAnswer, topic, company });
      setHistory(res.data.updatedHistory);
      setUserAnswer('');
    } catch (error) {
      console.error("Failed to submit answer", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {!hasStarted ? (
        // TOPIC SELECTION VIEW
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">AI Interview Practice</h1>
          <p className="text-lg text-gray-300 mb-8">Prepare for your technical interviews with Roop, your personal AI interviewer.</p>
          <form onSubmit={handleStartInterview} className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            
            {/* 2. Add the company input field */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-semibold">Target Company (e.g., Google, Adobe)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-semibold">Interview Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full mt-4 py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400">
              {isLoading ? 'Preparing...' : 'Start Interview'}
            </button>
          </form>
        </div>
      ) : (
        // INTERVIEW CHAT VIEW (This part remains the same)
        <div className="flex flex-col h-[calc(100vh-140px)]">
          <div className="flex-grow overflow-y-auto p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            {history.map((turn, index) => (
              <div key={index} className={`my-4 ${turn.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`p-4 rounded-lg inline-block max-w-2xl ${
                  turn.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-white'
                }`}>
                  <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{turn.parts[0].text}</ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSubmitAnswer} className="mt-4 flex">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="px-6 py-2 text-white font-semibold bg-indigo-600 rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-400">
              {isLoading ? 'Thinking...' : 'Submit'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;