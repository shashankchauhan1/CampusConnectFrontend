import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AskQuestionPage = () => {
  const [formData, setFormData] = useState({ title: '', body: '', tags: '' });
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) };
      const res = await axios.post('http://localhost:3001/api/questions', payload);
      alert('Question posted successfully!');
      navigate(`/questions/${res.data._id}`); // Redirect to the new question's page
    } catch (error) {
      console.error("Failed to post question", error);
      alert("Failed to post question.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-6">Ask a Public Question</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Title</label>
          <input type="text" name="title" value={formData.title} onChange={onChange} placeholder="e.g., How to implement a binary search tree in Java?" className="w-full p-2 bg-gray-700 rounded text-white" required />
        </div>
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Body</label>
          <textarea name="body" value={formData.body} onChange={onChange} placeholder="Include all the information someone would need to answer your question..." className="w-full p-2 bg-gray-700 rounded h-40 text-white" required></textarea>
        </div>
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Tags (comma separated)</label>
          <input type="text" name="tags" value={formData.tags} onChange={onChange} placeholder="e.g., java, dsa, binary-tree" className="w-full p-2 bg-gray-700 rounded text-white" />
        </div>
        <button type="submit" className="w-full py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700">Post Your Question</button>
      </form>
    </div>
  );
};

export default AskQuestionPage;