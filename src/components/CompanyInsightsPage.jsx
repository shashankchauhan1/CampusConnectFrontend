// client/src/components/CompanyInsightsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/insights');
        setInsights(res.data);
      } catch (error) {
        console.error("Failed to fetch insights", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const filteredInsights = insights.filter(insight =>
    insight.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-2">Company Insights</h1>
      <p className="text-gray-400 mb-6">Crowd-sourced interview experiences from your senior mentors.</p>
      
      <input
        type="text"
        placeholder="Search for a company (e.g., Adobe, Google)..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-8 bg-gray-700 border border-gray-600 rounded-lg text-white"
      />

      {loading ? <p className="text-white">Loading insights...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsights.map(insight => (
            <div key={insight._id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-white">{insight.companyName}</h2>
              <p className="text-indigo-400 font-semibold">{insight.role}</p>
              <p className="text-sm text-gray-400 mt-2">Shared by: {insight.author.name}</p>
              <div className="mt-4 border-t border-gray-700 pt-4">
                <h4 className="font-semibold text-white mb-2">Key Topics Asked:</h4>
                <div className="flex flex-wrap gap-2">
                  {insight.topicsAsked.slice(0, 3).map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">{topic}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyInsightsPage;