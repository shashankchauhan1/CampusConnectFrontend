import React, { useState } from 'react';
import axios from 'axios';

const SubmitInsightForm = () => {
  const [formData, setFormData] = useState({ companyName: '', role: '', year: new Date().getFullYear(), topicsAsked: '', tips: '' });
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, topicsAsked: formData.topicsAsked.split(',').map(s => s.trim()) };
      await axios.post('http://localhost:3001/api/insights', payload);
      alert('Insight submitted for admin review!');
      setFormData({ companyName: '', role: '', year: new Date().getFullYear(), topicsAsked: '', tips: '' });
    } catch (error) {
      console.error("Failed to submit insight", error);
      alert('Failed to submit insight.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="companyName" value={formData.companyName} onChange={onChange} placeholder="Company Name" className="w-full p-2 bg-gray-700 rounded text-white" required />
      <input type="text" name="role" value={formData.role} onChange={onChange} placeholder="Your Role (e.g., SDE Intern)" className="w-full p-2 bg-gray-700 rounded text-white" required />
      <input type="number" name="year" value={formData.year} onChange={onChange} placeholder="Year of Interview" className="w-full p-2 bg-gray-700 rounded text-white" required />
      <textarea name="topicsAsked" value={formData.topicsAsked} onChange={onChange} placeholder="Key topics asked, comma separated (e.g., DSA, System Design)" className="w-full p-2 bg-gray-700 rounded h-24 text-white" required></textarea>
      <textarea name="tips" value={formData.tips} onChange={onChange} placeholder="Any other tips or advice?" className="w-full p-2 bg-gray-700 rounded h-24 text-white"></textarea>
      <button type="submit" className="w-full py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700">Submit for Review</button>
    </form>
  );
};

export default SubmitInsightForm;