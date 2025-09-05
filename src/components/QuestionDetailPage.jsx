import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QuestionDetailPage = () => {
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for editing
  const [editingQuestion, setEditingQuestion] = useState(null); // To hold the question being edited
  const [editingAnswer, setEditingAnswer] = useState(null); // To hold the answer being edited {id, body}

  const { questionId } = useParams();
  const navigate = useNavigate();
  
  const myToken = localStorage.getItem('token');
  const currentUserId = myToken ? JSON.parse(atob(myToken.split('.')[1])).user.id : null;

  // Custom components to style the markdown output
  const markdownComponents = {
    p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4" {...props} />,
    li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
    code: ({node, ...props}) => <code className="bg-gray-900 text-indigo-300 px-2 py-1 rounded" {...props} />,
  };

  const fetchQuestion = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/questions/${questionId}`);
      setQuestion(res.data);
    } catch (error) {
      console.error("Failed to fetch question", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);
  
  const handleAnswerSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post(`http://localhost:3001/api/questions/${questionId}/answers`, { body: newAnswer });
          setNewAnswer('');
          fetchQuestion(); // Refresh question to show new answer
      } catch (error) {
          console.error("Failed to post answer", error);
      }
  };

  const handleDeleteQuestion = async () => {
    if (window.confirm('Are you sure you want to delete this question and all its answers?')) {
      try {
        await axios.delete(`http://localhost:3001/api/questions/${questionId}`);
        alert('Question deleted.');
        navigate('/questions');
      } catch (error) {
        console.error("Failed to delete question", error);
      }
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/questions/${questionId}`, { 
        title: editingQuestion.title, 
        body: editingQuestion.body,
        tags: editingQuestion.tags 
      });
      setEditingQuestion(null);
      fetchQuestion();
    } catch (error) {
      console.error("Failed to update question", error);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm('Are you sure you want to delete this answer?')) {
      try {
        await axios.delete(`http://localhost:3001/api/questions/answers/${answerId}`);
        fetchQuestion();
      } catch (error) {
        console.error("Failed to delete answer", error);
      }
    }
  };

  const handleUpdateAnswer = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`http://localhost:3001/api/questions/answers/${editingAnswer.id}`, { body: editingAnswer.body });
        setEditingAnswer(null);
        fetchQuestion();
    } catch (error) {
        console.error("Failed to update answer", error);
    }
  };

 
  if (loading) return <p className="text-white text-center p-10">Loading question...</p>;
  if (!question) return <p className="text-red-500 text-center p-10">Question not found.</p>;

  return (
    <div className="container mx-auto px-6 py-8 text-white">
      {/* --- QUESTION SECTION --- */}
      {editingQuestion ? (
        <form onSubmit={handleUpdateQuestion} className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <input type="text" value={editingQuestion.title} onChange={(e) => setEditingQuestion({...editingQuestion, title: e.target.value})} className="w-full p-2 bg-gray-700 rounded text-2xl font-bold mb-4" />
          <textarea value={editingQuestion.body} onChange={(e) => setEditingQuestion({...editingQuestion, body: e.target.value})} className="w-full p-2 bg-gray-700 rounded h-40"></textarea>
          <div className="mt-4">
            <button type="submit" className="px-4 py-2 bg-green-600 rounded mr-2">Save</button>
            <button type="button" onClick={() => setEditingQuestion(null)} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <h1 className="text-3xl font-extrabold mb-4">{question.title}</h1>
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{question.body}</ReactMarkdown>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-400">Asked by {question.author.name}</p>
              {currentUserId === question.author._id && (
                <div className="space-x-4">
                  <button onClick={() => setEditingQuestion({ title: question.title, body: question.body, tags: question.tags })} className="text-sm text-indigo-400 hover:underline">Edit</button>
                  <button onClick={handleDeleteQuestion} className="text-sm text-red-400 hover:underline">Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ANSWERS SECTION --- */}
      <h2 className="text-2xl font-bold mt-8 mb-4">{question.answers.length} Answers</h2>
      <div className="space-y-6">
        {question.answers.map(answer => (
          <div key={answer._id} className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            {editingAnswer?.id === answer._id ? (
                <form onSubmit={handleUpdateAnswer}>
                    <textarea value={editingAnswer.body} onChange={(e) => setEditingAnswer({...editingAnswer, body: e.target.value})} className="w-full p-2 bg-gray-700 rounded h-24"></textarea>
                    <div className="mt-4">
                        <button type="submit" className="px-4 py-2 bg-green-600 rounded mr-2">Save</button>
                        <button type="button" onClick={() => setEditingAnswer(null)} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
                    </div>
                </form>
            ) : (
                <>
                    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{answer.body}</ReactMarkdown>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-400">Answered by {answer.author.name}</p>
                        {currentUserId === answer.author._id && (
                            <div className="space-x-4">
                                <button onClick={() => setEditingAnswer({ id: answer._id, body: answer.body })} className="text-sm text-indigo-400 hover:underline">Edit</button>
                                <button onClick={() => handleDeleteAnswer(answer._id)} className="text-sm text-red-400 hover:underline">Delete</button>
                            </div>
                        )}
                    </div>
                </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAnswerSubmit} className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-2xl font-bold mb-4">Your Answer</h3>
        <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="w-full p-2 bg-gray-700 rounded h-32 text-white" required></textarea>
        <button type="submit" className="mt-4 px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-700">Post Answer</button>
      </form>
    </div>
  );
};

export default QuestionDetailPage;