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
        // Pre-fill form data for editing, including new fields
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
              <h2 className="text-2xl font-bold text-white mb-4">Edit Your Profile</h2>
              <div className="mb-4">
                <label className="block text-gray-300">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"></textarea>
              </div>
              
              {/* ## ROLE-SPECIFIC EDIT FIELDS ## */}
              {profile.role === 'senior' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-300">Company</label>
                    <input type="text" name="company" value={formData.company} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300">Job Title</label>
                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-300">Major</label>
                    <input type="text" name="major" value={formData.major} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300">Graduation Year</label>
                    <input type="number" name="graduationYear" value={formData.graduationYear} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-300">Skills (comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="px-6 py-2 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full mb-6 md:mb-0 md:mr-8 flex-shrink-0"></div>
                  <div>
                    <h1 className="text-4xl font-extrabold text-white">{profile.name}</h1>
                    <p className={`text-lg font-semibold ${profile.role === 'senior' ? 'text-green-400' : 'text-indigo-400'}`}>{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</p>
                    
                    {/* ## ROLE-SPECIFIC DISPLAY INFO ## */}
                    {profile.role === 'senior' && profile.jobTitle && profile.company && (
                      <p className="text-gray-300 mt-1">{profile.jobTitle} at {profile.company}</p>
                    )}
                    {profile.role === 'junior' && profile.major && (
                      <p className="text-gray-300 mt-1">{profile.major} - Class of {profile.graduationYear}</p>
                    )}
                  </div>
                </div>
                {isOwnProfile && (
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">Edit Profile</button>
                )}
              </div>
              {/* ... (Rest of the display view remains the same) ... */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;