import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/questions');
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-white">All Questions</h1>
        <Link to="/ask" className="px-5 py-2 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Ask Question
        </Link>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        {loading ? <p className="text-white p-6">Loading...</p> : (
          <ul className="divide-y divide-gray-700">
            {questions.map(q => (
              <li key={q._id} className="p-6 hover:bg-gray-700">
                <Link to={`/questions/${q._id}`} className="block">
                  <p className="text-sm text-gray-400">{q.answers.length} answers</p>
                  <h3 className="text-xl font-semibold text-indigo-400 mt-1">{q.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">asked by {q.author.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;