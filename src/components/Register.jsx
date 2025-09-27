import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Briefcase, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'junior',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, email, password, confirmPassword, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onRoleChange = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const res = await axios.post(`${apiBase}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });
      
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard';
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      const message = err?.response?.data?.msg || err?.message || 'Network error';
      setError(message);
      console.error('Register failed:', err?.response?.data || err);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'junior',
      name: 'Student',
      description: 'Looking for mentorship and opportunities',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'senior',
      name: 'Mentor',
      description: 'Ready to guide and help others',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Join Campus Connect</h1>
            <p className="text-gray-300">Create your account to get started</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Role Selection */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((roleOption) => (
                <button
                  key={roleOption.id}
                  type="button"
                  onClick={() => onRoleChange(roleOption.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    role === roleOption.id
                      ? `border-transparent bg-gradient-to-r ${roleOption.color} text-white shadow-lg`
                      : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {roleOption.icon}
                    <span className="font-semibold text-sm">{roleOption.name}</span>
                    <span className="text-xs opacity-80 text-center">
                      {roleOption.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Your full name"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="you@university.edu"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
            <Link 
              to="/" 
              className="inline-block mt-4 text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;