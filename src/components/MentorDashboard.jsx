// client/src/components/MentorDashboard.jsx
import React from 'react';

const MentorDashboard = ({ currentUser }) => {
  return (
    <main className="container mx-auto px-6 py-8 text-center">
      <h2 className="text-4xl font-extrabold text-white mb-4">
        Mentor Dashboard
      </h2>
      <p className="text-lg text-gray-300">
        Welcome, {currentUser.name}. Thank you for helping our students!
      </p>
      <div className="mt-8 bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Your Next Steps</h3>
        <p className="text-gray-400">Check your <a href="/conversations" className="text-indigo-400 hover:underline">Conversations</a> to see if any students have reached out.</p>
      </div>
    </main>
  );
};

export default MentorDashboard;