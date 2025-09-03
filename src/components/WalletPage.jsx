// client/src/components/WalletPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WalletPage = () => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAddCredits = async () => {
    try {
        const res = await axios.put('http://localhost:3001/api/sessions/wallet/add');
        setUser(res.data);
        alert('100 credits added successfully!');
    } catch (error) {
        console.error("Failed to add credits", error);
        alert('Error adding credits.');
    }
  };

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-8">My Wallet</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 max-w-md mx-auto">
        <p className="text-gray-400 text-lg">Current Balance</p>
        <p className="text-5xl font-bold text-white mb-6">{user.walletBalance} Credits</p>
        
        {user.role === 'junior' && (
          <button onClick={handleAddCredits} className="w-full py-3 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 transition">
            Add 100 Credits (Test)
          </button>
        )}
         {user.role === 'senior' && (
          <p className="text-center text-gray-300">You can withdraw your earnings once the payout system is implemented.</p>
        )}
      </div>
    </div>
  );
};

export default WalletPage;