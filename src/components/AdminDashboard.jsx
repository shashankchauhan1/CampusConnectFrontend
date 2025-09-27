import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLinkedin } from 'react-icons/fa';

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
      fetchPendingMentors();
    } catch (error) {
      console.error("Failed to approve mentor", error);
      alert('Failed to approve mentor.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Admin Dashboard</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-white mb-6">Pending Mentor Verifications</h2>
        {pendingMentors.length > 0 ? (
          <ul className="space-y-6">
            {pendingMentors.map((mentor) => (
              <li key={mentor._id} className="p-6 bg-gray-700 rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <p className="font-semibold text-white text-lg">{mentor.name}</p>
                  <p className="text-sm text-gray-400">{mentor.email}</p>
                  <a
                    href={mentor.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-indigo-400 hover:underline mt-2"
                  >
                    <FaLinkedin className="mr-2" /> View LinkedIn Profile
                  </a>
                </div>
                <button
                  onClick={() => handleApprove(mentor._id)}
                  className="px-5 py-3 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">No mentors are currently pending verification.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;