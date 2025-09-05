// client/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ setSearchTerm }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // State to hold the user's ID

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // 1. Decode the token to get the user's ID when the component loads
      const userId = JSON.parse(atob(token.split('.')[1])).user.id;
      setCurrentUserId(userId);
    }
    
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).user.id;
        setCurrentUserId(userId);
      } else {
        setCurrentUserId(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    if (setSearchTerm) setSearchTerm('');
    window.location.href = '/login';
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-2xl font-bold text-white tracking-wide">
          Campus Connect
        </Link>

        {isAuthenticated && (
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search for a user..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-hald px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
        )}

        <nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-10">
              {/* 2. ADD THE "MY PROFILE" LINK HERE */}
              <Link to={`/profile/${currentUserId}`} className="text-gray-300 hover:text-white transition duration-300 font-semibold">
                My Profile
              </Link>
              <Link to="/wallet" className="text-gray-300 hover:text-white transition duration-300">
                Wallet
              </Link>
              <Link to="/insights" className="text-gray-300 hover:text-white transition duration-300">
                Company Insights
              </Link>
              <Link to="/conversations" className="text-gray-300 hover:text-white transition duration-300">
                Conversations
              </Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition duration-300">
                Dashboard
              </Link>

<Link to="/questions" className="text-gray-300 hover:text-white transition">
  Q&A Forum
</Link>

              <button
                onClick={handleLogout}
                className="px-5 py-2 text-white bg-red-700 rounded-lg hover:bg-red-800 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="px-5 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;