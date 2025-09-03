// client/src/components/MentorDashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SubmitInsightForm = () => {
  const [formData, setFormData] = useState({ companyName: '', role: '', year: new Date().getFullYear(), topicsAsked: '' });
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, topicsAsked: formData.topicsAsked.split(',').map(s => s.trim()) };
      await axios.post('http://localhost:3001/api/insights', payload);
      alert('Insight submitted for review!');
      setFormData({ companyName: '', role: '', year: new Date().getFullYear(), topicsAsked: '' });
    } catch (error) {
      console.error("Failed to submit insight", error);
      alert('Failed to submit insight.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="companyName" value={formData.companyName} onChange={onChange} placeholder="Company Name" className="w-full p-2 bg-gray-700 rounded" required />
      <input type="text" name="role" value={formData.role} onChange={onChange} placeholder="Your Role (e.g., SDE Intern)" className="w-full p-2 bg-gray-700 rounded" required />
      <input type="number" name="year" value={formData.year} onChange={onChange} placeholder="Year of Interview" className="w-full p-2 bg-gray-700 rounded" required />
      <textarea name="topicsAsked" value={formData.topicsAsked} onChange={onChange} placeholder="Key topics asked, comma separated (e.g., DSA, System Design)" className="w-full p-2 bg-gray-700 rounded h-24" required></textarea>
      <button type="submit" className="w-full py-2 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700">Submit Insight</button>
    </form>
  );
};

const MentorDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-extrabold text-white mb-8">Mentor Dashboard</h2>
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-6">
          <button onClick={() => setActiveTab('overview')} className={`py-2 px-1 font-semibold ${activeTab === 'overview' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Overview</button>
          <button onClick={() => setActiveTab('insights')} className={`py-2 px-1 font-semibold ${activeTab === 'insights' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Share Insights</button>
        </nav>
      </div>
      {activeTab === 'overview' && (
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Welcome, {currentUser.name}!</h3>
          <p className="text-gray-400">Check your <a href="/conversations" className="text-indigo-400 hover:underline">Conversations</a> to connect with students.</p>
        </div>
      )}
      {activeTab === 'insights' && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Share Your Interview Experience</h3>
          <SubmitInsightForm />
        </div>
      )}
    </main>
  );
};

export default MentorDashboard;