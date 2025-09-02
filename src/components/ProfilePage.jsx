// client/src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const { userId } = useParams();
  const myToken = localStorage.getItem('token');
  const currentUserId = myToken ? JSON.parse(atob(myToken.split('.')[1])).user.id : null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/users/${userId}`);
        setProfile(res.data);
        setFormData({
          bio: res.data.bio || '',
          company: res.data.company || '',
          jobTitle: res.data.jobTitle || '',
          major: res.data.major || '',
          graduationYear: res.data.graduationYear || '',
          skills: res.data.skills.join(', ') || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, [userId]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3001/api/users/me', formData);
      setProfile(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  if (!profile) {
    return <div className="text-center text-white p-10">Loading profile...</div>;
  }
  
  const isOwnProfile = currentUserId === profile._id;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-8">
      <main className="container mx-auto px-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          
          {isEditing ? (
            <form onSubmit={handleSave}>
              {/* --- The Edit Form remains the same --- */}
            </form>
          ) : (
            // ## DISPLAY VIEW ##
            <div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full mb-6 md:mb-0 md:mr-8 flex-shrink-0"></div>
                  <div>
                    <h1 className="text-4xl font-extrabold text-white">{profile.name}</h1>
                    <p className={`text-lg font-semibold ${profile.role === 'senior' ? 'text-green-400' : 'text-indigo-400'}`}>{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</p>
                    
                    {/* ## THIS IS THE CORRECTED PART ## */}
                    {/* This logic now shows information even if only one field is filled out */}
                    {profile.role === 'senior' && (
                      <div className="text-gray-300 mt-1">
                        {profile.jobTitle && <p>{profile.jobTitle}</p>}
                        {profile.company && <p>at {profile.company}</p>}
                      </div>
                    )}
                    {profile.role === 'junior' && (
                      <div className="text-gray-300 mt-1">
                        {profile.major && <p>{profile.major}</p>}
                        {profile.graduationYear && <p>Class of {profile.graduationYear}</p>}
                      </div>
                    )}
                  </div>
                </div>
                {isOwnProfile && (
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">Edit Profile</button>
                )}
              </div>

              <div className="mt-8 border-t border-gray-700 pt-6">
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-gray-300">{profile.bio || 'No bio provided yet.'}</p>
              </div>

              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">{profile.skills.map((skill, index) => (<span key={index} className="px-4 py-2 bg-gray-700 text-white rounded-full text-sm font-semibold">{skill}</span>))}</div>
                </div>
              )}
              
              {!isOwnProfile && (
                <div className="mt-8 text-center">
                  <Link to={`/chat/${profile._id}`} className="px-8 py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300">Chat with {profile.name}</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;