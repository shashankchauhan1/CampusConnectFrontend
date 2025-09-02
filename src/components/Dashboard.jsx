// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import MentorDashboard from './MentorDashboard';

const Dashboard = ({ searchTerm }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await axios.get('http://localhost:3001/api/auth/me');
          setCurrentUser(res.data);
        } catch (error) {
          console.error("Could not fetch user data", error);
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  if (loading) {
    return <div className="text-center text-white p-10">Loading Dashboard...</div>;
  }

  if (!currentUser) {
    return <div className="text-center text-red-500 p-10">Could not load user data. Please try logging in again.</div>;
  }

  // Conditionally render the correct dashboard based on the user's role
  if (currentUser.role === 'senior') {
    return <MentorDashboard currentUser={currentUser} />;
  } else {
    return <StudentDashboard currentUser={currentUser} searchTerm={searchTerm} />;
  }
};

export default Dashboard;