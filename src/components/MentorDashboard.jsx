import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SubmitInsightForm from './SubmitInsightForm'; // Import the new form

const MentorDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-extrabold text-white mb-8">Mentor Dashboard</h2>
      
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-6">
          <button onClick={() => setActiveTab('overview')} className={`py-2 px-1 font-semibold transition ${activeTab === 'overview' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Overview</button>
          <button onClick={() => setActiveTab('insights')} className={`py-2 px-1 font-semibold transition ${activeTab === 'insights' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Share Insights</button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Welcome, {currentUser.name}!</h3>
          <p className="text-gray-400">Your contributions help students succeed. You can share your interview experience in the 'Share Insights' tab.</p>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Share Your Interview Experience</h3>
            <p className="text-gray-400 mb-4">Your submission will be reviewed by an admin before being published.</p>
            <SubmitInsightForm />
        </div>
      )}
    </main>
  );
};

export default MentorDashboard;