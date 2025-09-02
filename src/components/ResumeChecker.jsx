// client/src/components/ResumeChecker.jsx
import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ResumeChecker = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(''); // Clear previous feedback
    try {
      const res = await axios.post('http://localhost:3001/api/ai/check-resume', {
        resumeText,
        jobDescription,
      });
      setFeedback(res.data.feedback);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      setFeedback('Sorry, an error occurred while analyzing your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ## 1. DEFINE CUSTOM COMPONENTS FOR MARKDOWN STYLING ##
  const markdownComponents = {
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-indigo-400 mt-6 mb-3 border-b border-gray-700 pb-2" {...props} />,
    p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4" {...props} />,
    li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Paste Your Resume Content</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here..."
              className="w-full h-64 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Paste the Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here for the best feedback..."
              className="w-full h-64 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
        </button>
      </form>

      {/* Feedback Display Area */}
      {feedback && (
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h3 className="text-2xl font-bold text-white mb-4">Your AI-Powered Feedback</h3>
          
          <div className="p-6 bg-gray-900 rounded-lg">
            {/* ## 2. PASS THE CUSTOM COMPONENTS TO REACTMARKDOWN ## */}
            {/* Note: The 'prose' classes have been removed as they are no longer needed. */}
            <ReactMarkdown
              components={markdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {feedback}
            </ReactMarkdown>
          </div>

        </div>
      )}
    </div>
  );
};

export default ResumeChecker;