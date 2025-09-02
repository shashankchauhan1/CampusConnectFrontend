// client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the new Footer
import ChatPage from './components/ChatPage'; // Import the new ChatPage
import ProfilePage from './components/ProfilePage';
import ConversationsPage from './components/ConversationsPage';
import InterviewPage from './components/InterviewPage';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900"> {/* Flex container for sticky footer */}
        <Navbar setSearchTerm={setSearchTerm} />
        <main className="flex-grow"> {/* Main content grows to fill available space */}
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard searchTerm={searchTerm} />
                </PrivateRoute>
              } 
            />

            <Route path="/" element={<Login />} /> 

            <Route 
              path="/chat/:userId" 
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/profile/:userId" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/conversations" 
              element={
                <PrivateRoute>
                  <ConversationsPage />
                </PrivateRoute>
              } 
            />

             <Route 
              path="/interview" 
              element={
                <PrivateRoute>
                  <InterviewPage />
                </PrivateRoute>
              } 
            />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;