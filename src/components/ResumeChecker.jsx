// client/src/components/ResumeChecker.jsx
import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ResumeChecker = () => {
  const [resumeFile, setResumeFile] = useState(null); // State for the file
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      return alert('Please upload a resume file.');
    }
    setIsLoading(true);
    setFeedback('');
    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription);
    try {
      const res = await axios.post('http://localhost:3001/api/ai/check-resume-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFeedback(res.data.feedback);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      setFeedback('Sorry, an error occurred while analyzing your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <label className="block text-gray-300 mb-2 font-semibold">Upload Your Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              required
            />
            {resumeFile && <p className="text-xs text-gray-400 mt-2">Selected: {resumeFile.name}</p>}
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Paste the Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full h-48 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
        </button>
      </form>

      {/* Feedback Display Area */}
      {feedback && (
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h3 className="text-2xl font-bold text-white mb-4">Your AI-Powered Feedback</h3>
          <div className="p-6 bg-gray-900 rounded-lg">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {feedback}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeChecker;