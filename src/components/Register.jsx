// client/src/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for the login redirect

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'junior', // Default role
  });

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Special handler for the role buttons
  const onRoleChange = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        email,
        password,
        role, // Send the selected role to the backend
      });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err.response.data);
      alert('Error: ' + err.response.data.msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="p-8 bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Join Campus Connect</h2>
        <p className="text-center text-gray-400 mb-6">Create an account to get started.</p>
        
        {/* ## NEW ROLE SELECTOR ## */}
        <div className="mb-6">
            <label className="block text-gray-300 mb-2">I am a...</label>
            <div className="flex gap-4">
                <button 
                    type="button" 
                    onClick={() => onRoleChange('junior')}
                    className={`flex-1 py-3 rounded-lg transition duration-300 font-semibold ${
                        role === 'junior' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Student
                </button>
                <button 
                    type="button" 
                    onClick={() => onRoleChange('senior')}
                    className={`flex-1 py-3 rounded-lg transition duration-300 font-semibold ${
                        role === 'senior' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Mentor
                </button>
            </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300">Name</label>
            <input
              type="text" placeholder="Your Name" name="name" value={name} onChange={onChange}
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Email Address</label>
            <input
              type="email" placeholder="you@example.com" name="email" value={email} onChange={onChange}
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300">Password</label>
            <input
              type="password" placeholder="••••••••" name="password" value={password} onChange={onChange}
              className="w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" minLength="6" required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;