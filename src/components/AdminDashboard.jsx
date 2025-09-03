import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingMentors, setPendingMentors] = useState([]);

  const fetchPendingMentors = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/pending-mentors');
      setPendingMentors(res.data);
    } catch (error) {
      console.error("Failed to fetch pending mentors", error);
    }
  };

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  const handleApprove = async (mentorId) => {
    try {
      await axios.put(`http://localhost:3001/api/admin/verify-mentor/${mentorId}`);
      alert('Mentor approved!');
      // Refresh the list after approval
      fetchPendingMentors();
    } catch (error) {
      console.error("Failed to approve mentor", error);
      alert('Failed to approve mentor.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-8">Admin Dashboard</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Pending Mentor Verifications</h2>
        {pendingMentors.length > 0 ? (
          <ul className="space-y-4">
            {pendingMentors.map((mentor) => (
              <li key={mentor._id} className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">{mentor.name} ({mentor.email})</p>
                  <a href={mentor.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline">
                    View LinkedIn Profile
                  </a>
                </div>
                <button onClick={() => handleApprove(mentor._id)} className="px-4 py-2 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700">
                  Approve
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No mentors are currently pending verification.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;