// client/src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import ResumeChecker from './ResumeChecker'; // 1. Import the new component

const StudentDashboard = ({ currentUser, searchTerm }) => {
  const [mentors, setMentors] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('mentors'); // 2. State to manage tabs

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/users');
        setMentors(res.data.filter(user => user.role === 'senior'));
      } catch (error) {
        console.error("Failed to fetch mentors", error);
      }
    };
    fetchMentors();

    const socket = io('http://localhost:3001');
    if(currentUser) socket.emit('add-user', currentUser._id);
    socket.on('update-online-users', (usersArray) => {
      setOnlineUsers(usersArray);
    });
    return () => socket.close();
  }, [currentUser]);
  
  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-extrabold text-white mb-8">
        Student Dashboard
      </h2>
      
      {/* 3. Tab Navigation */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`py-2 px-1 font-semibold transition duration-300 ${
              activeTab === 'mentors' 
              ? 'border-b-2 border-indigo-500 text-white' 
              : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Find a Mentor
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`py-2 px-1 font-semibold transition duration-300 ${
              activeTab === 'resume' 
              ? 'border-b-2 border-indigo-500 text-white' 
              : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Resume Checker
          </button>
        </nav>
      </div>

       <div className="mb-8 p-6 bg-indigo-600 text-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-2">AI Interview Practice</h3>
        <p className="mb-4">Hone your skills with Roop, your personal AI interviewer. Practice for real-world technical interviews.</p>
        <Link to="/interview" className="inline-block px-5 py-2 font-semibold bg-white text-indigo-600 rounded-lg hover:bg-gray-200 transition">
          Start a Session
        </Link>
      </div>

      {/* 4. Conditionally render content based on active tab */}
      {activeTab === 'mentors' && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          {filteredMentors.length > 0 ? (
            <ul className="space-y-4">
              {filteredMentors.map((mentor) => (
                <Link to={`/profile/${mentor._id}`} key={mentor._id}>
                  <li className="p-4 bg-gray-700 rounded-lg flex justify-between items-center transition duration-300 hover:bg-gray-600 cursor-pointer mb-4">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-4 ${onlineUsers.includes(mentor._id) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <div>
                        <p className="font-semibold text-white text-lg">{mentor.name}</p>
                        <p className="text-sm text-gray-300">{mentor.jobTitle || 'Mentor'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-4 py-1 text-sm font-bold rounded-full bg-green-600 text-white">
                        {mentor.role}
                      </span>
                      {/* Display Badge Score */}
                      {mentor.badgeScore > 0 && (
                        <p className="text-xs text-gray-300 mt-1">Score: {mentor.badgeScore}</p>
                      )}
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No mentors found matching your search.</p>
          )}
        </div>
      )}

      {activeTab === 'resume' && (
        <ResumeChecker />
      )}
    </main>
  );
};

export default StudentDashboard;