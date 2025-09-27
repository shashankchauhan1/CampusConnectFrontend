import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatPage from './components/ChatPage';
import ProfilePage from './components/ProfilePage';
import ConversationsPage from './components/ConversationsPage';
import InterviewPage from './components/InterviewPage';
import AdminDashboard from './components/AdminDashboard';
import WalletPage from './components/WalletPage';
import CompanyInsightsPage from './components/CompanyInsightsPage';
import AskQuestionPage from './components/AskQuestionPage';
import QuestionsPage from './components/QuestionsPage';
import QuestionDetailPage from './components/QuestionDetailPage';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <Dashboard searchTerm={searchTerm} />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/chat/:userId" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <ChatPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/profile/:userId" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <ProfilePage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/conversations" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <ConversationsPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <AdminDashboard />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/interview" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <InterviewPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/wallet" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <WalletPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/insights" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <CompanyInsightsPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/ask" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <AskQuestionPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/questions" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <QuestionsPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/questions/:questionId" 
            element={
              <PrivateRoute>
                <div className="flex flex-col min-h-screen bg-gray-900">
                  <Navbar setSearchTerm={setSearchTerm} />
                  <main className="flex-grow">
                    <QuestionDetailPage />
                  </main>
                  <Footer />
                </div>
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;