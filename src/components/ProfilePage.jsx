// client/src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });

  const { userId } = useParams();
  const myToken = localStorage.getItem('token');
  const currentUserId = myToken ? JSON.parse(atob(myToken.split('.')[1])).user.id : null;
  const [userRating, setUserRating] = useState(5); // New state for rating input
  const [userFeedback, setUserFeedback] = useState(''); // New state for feedback input


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
      }
      try {
        const res = await axios.get(`http://localhost:3001/api/users/${userId}`);
        setProfile(res.data);
        
        setFormData({
          bio: res.data.bio || '',
          company: res.data.company || '',
          jobTitle: res.data.jobTitle || '',
          yearsOfExperience: res.data.yearsOfExperience || 0,
          techStack: res.data.techStack.join(', ') || '',
          pricing: res.data.pricing || 0,
          branch: res.data.branch || '',
          year: res.data.year || '',
          interests: res.data.interests.join(', ') || '',
          skills: res.data.skills.join(', ') || '',
        });
        
        setLinkedInUrl(res.data.linkedInUrl || '');
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
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        interests: formData.interests ? formData.interests.split(',').map(s => s.trim()) : [],
        techStack: formData.techStack ? formData.techStack.split(',').map(s => s.trim()) : [],
      };
      const res = await axios.put('http://localhost:3001/api/users/me', payload);
      setProfile(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/users/me/submit-verification', { linkedInUrl });
      setProfile(res.data);
      alert('Your verification has been submitted for review!');
    } catch (error) {
      console.error('Failed to submit verification', error);
      alert('Failed to submit verification. Please try again.');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/ratings/${userId}`, {
        rating: userRating,
        feedback: userFeedback,
      });
      alert('Thank you for your feedback!');
      // Optionally, refetch the profile to show the new average rating
    } catch (error) {
      console.error('Failed to submit rating', error);
      alert('Failed to submit rating.');
    }
  };

  const handleAddSlot = async () => {
    if (!newSlot.date || !newSlot.time) return alert('Please select a date and time.');
    const updatedSlots = [...profile.availableTimeSlots, newSlot];
    try {
      const res = await axios.put('http://localhost:3001/api/users/me/availability', { slots: updatedSlots });
      setProfile({ ...profile, availableTimeSlots: res.data });
      setNewSlot({ date: '', time: '' });
    } catch (error) {
      console.error('Failed to add slot', error);
    }
  };

  // NEW function to handle booking a specific slot
  const handleBookSession = async (slotId) => {
    if (window.confirm(`Book this session with ${profile.name} for ${profile.pricing} credits?`)) {
      try {
        const res = await axios.post(`http://localhost:3001/api/sessions/book/${profile._id}`, { slotId });
        alert(res.data.msg);
        // Refresh the profile data to show the slot is now booked
        const updatedProfile = await axios.get(`http://localhost:3001/api/users/${userId}`);
        setProfile(updatedProfile.data);
      } catch (error) {
        alert(error.response?.data?.msg || 'Failed to book session.');
      }
    }
  };

  // Helper function to determine the badge based on the rules in your guide
  const getMentorBadge = (profile) => {
    if (!profile || profile.role !== 'senior') return null;
    if (profile.averageRating >= 4.7 && profile.ratingCount >= 50) {
      return <span className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">Gold Mentor</span>;
    }
    if (profile.averageRating >= 4.4 && profile.ratingCount >= 20) {
      return <span className="ml-2 px-2 py-1 bg-gray-300 text-gray-800 text-xs font-bold rounded-full">Silver Mentor</span>;
    }
    if (profile.averageRating >= 4.5 && profile.ratingCount >= 10) {
      return <span className="ml-2 px-2 py-1 bg-orange-400 text-orange-900 text-xs font-bold rounded-full">Rising Mentor</span>;
    }
    return null;
  };

  if (!profile) {
    return <div className="text-center text-white p-10">Loading profile...</div>;
  }
  
  const isOwnProfile = currentUserId === profile._id;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-12">
      <main className="container mx-auto px-6">
        {isEditing ? (
          // --- EDIT FORM VIEW ---
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <form onSubmit={handleSave}>
              <h2 className="text-3xl font-bold text-white mb-6">Edit Your Profile</h2>
              <div className="mb-4">
                <label className="block text-gray-300">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Skills (comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
              </div>

              {profile.role === 'senior' ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="mb-4"><label className="block text-gray-300">Company</label><input type="text" name="company" value={formData.company} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                    <div className="mb-4"><label className="block text-gray-300">Job Title</label><input type="text" name="jobTitle" value={formData.jobTitle} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                    <div className="mb-4"><label className="block text-gray-300">Years of Experience</label><input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                    <div className="mb-4"><label className="block text-gray-300">Price per Session (Credits)</label><input type="number" name="pricing" value={formData.pricing} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                  </div>
                  <div className="mb-4"><label className="block text-gray-300">Tech Stack (comma separated)</label><input type="text" name="techStack" value={formData.techStack} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                </>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="mb-4"><label className="block text-gray-300">Branch</label><input type="text" name="branch" value={formData.branch} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                    <div className="mb-4"><label className="block text-gray-300">Year</label><input type="number" name="year" value={formData.year} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                  </div>
                  <div className="mb-4"><label className="block text-gray-300">Interests (comma separated)</label><input type="text" name="interests" value={formData.interests} onChange={onChange} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
                </>
              )}
              
              {/* ## ADD THIS NEW SECTION ## */}
              {profile.role === 'senior' && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Manage Your Availability</h3>
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <input type="date" value={newSlot.date} onChange={(e) => setNewSlot({...newSlot, date: e.target.value})} className="p-2 bg-gray-700 rounded"/>
                    <input type="time" value={newSlot.time} onChange={(e) => setNewSlot({...newSlot, time: e.target.value})} className="p-2 bg-gray-700 rounded"/>
                    <button type="button" onClick={handleAddSlot} className="px-4 py-2 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700">Add Slot</button>
                  </div>
                  <div className="text-gray-300">
                    <p>Your Current Slots:</p>
                    <ul className="list-disc list-inside mt-2">
                      {profile.availableTimeSlots.map(slot => (
                        <li key={`${slot.date}-${slot.time}`}>{new Date(slot.date).toLocaleDateString()} at {slot.time}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 mt-6">
                <button type="submit" className="px-6 py-2 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          // --- DISPLAY VIEW ---
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center border border-gray-700">
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold text-white flex items-center justify-center">
                  {profile.name}
                  {getMentorBadge(profile)}
                </h1>
                <p className={`text-lg font-semibold mt-1 ${profile.role === 'senior' ? 'text-green-400' : 'text-indigo-400'}`}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </p>
                {profile.role === 'senior' && (
                  <div className={`mt-4 px-3 py-1 inline-block rounded-full text-sm font-semibold ${
                    profile.verificationStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-yellow-100'
                  }`}>
                    {profile.verificationStatus === 'approved' ? 'Verified Mentor ✅' : 'Not Verified'}
                  </div>
                )}
                  {/* Display average rating for seniors */}
                  {profile.role === 'senior' && profile.ratingCount > 0 && (
                    <div className="mt-4">
                      <span className="text-2xl font-bold text-yellow-400">★ {profile.averageRating}</span>
                      <span className="text-gray-400"> ({profile.ratingCount} ratings)</span>
                    </div>
                  )}
                {/* This is the container for the buttons */}
                <div className="mt-6 w-full space-y-3">
                  {/* Conditionally render Edit or the other buttons */}
                  {isOwnProfile ? (
                    <button onClick={() => setIsEditing(true)} className="w-full px-4 py-3 text-white font-semibold bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-300">
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <Link to={`/chat/${profile._id}`} className="w-full block px-4 py-3 text-white font-semibold bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-300">
                        Message {profile.name}
                      </Link>
                      {profile.role === 'senior' && (
                        <button onClick={handleBookSession} className="w-full block px-4 py-3 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300">
                          Book Session ({profile.pricing} Credits)
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-8">
              {isOwnProfile && profile.role === 'senior' && profile.verificationStatus !== 'approved' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Become a Verified Mentor</h2>
                  <p className="text-gray-400 mb-4">Submit your LinkedIn profile for review. Verified mentors rank higher and gain more trust.</p>
                  <form onSubmit={handleVerificationSubmit} className="flex gap-2">
                    <input type="url" placeholder="https://linkedin.com/in/your-profile" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
                    <button type="submit" className="px-5 py-2 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700">Submit</button>
                  </form>
                  {profile.verificationStatus === 'pending' && <p className="text-yellow-400 mt-3">Your profile is pending review.</p>}
                  {profile.verificationStatus === 'rejected' && <p className="text-red-400 mt-3">Your last submission was rejected. Please update and resubmit.</p>}
                </div>
              )}
                {/* Rating form for juniors viewing senior profiles */}
                {!isOwnProfile && currentUserId && profile.role === 'senior' && profile._id !== currentUserId && (
                  <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Rate This Mentor</h2>
                    <form onSubmit={handleRatingSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Your Rating (1-5)</label>
                        <input type="number" min="1" max="5" value={userRating} onChange={(e) => setUserRating(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Feedback (Optional)</label>
                        <textarea value={userFeedback} onChange={(e) => setUserFeedback(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"></textarea>
                      </div>
                      <button type="submit" className="px-5 py-2 text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700">Submit Feedback</button>
                    </form>
                  </div>
                )}
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed">{profile.bio || 'No bio provided yet.'}</p>
              </div>
              {profile.role === 'senior' ? (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Professional Details</h2>
                  <ul className="text-gray-300 space-y-2">
                    {profile.jobTitle && <li><strong>Title:</strong> {profile.jobTitle} at {profile.company}</li>}
                    {profile.yearsOfExperience > 0 && <li><strong>Experience:</strong> {profile.yearsOfExperience} years</li>}
                    {profile.pricing > 0 && <li><strong>Session Price:</strong> {profile.pricing} Credits</li>}
                  </ul>
                </div>
              ) : (
                 <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Academic Details</h2>
                  <ul className="text-gray-300 space-y-2">
                    {profile.branch && <li><strong>Branch:</strong> {profile.branch}</li>}
                    {profile.year && <li><strong>Year:</strong> {profile.year}</li>}
                  </ul>
                </div>
              )}
              {(profile.skills && profile.skills.length > 0) && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">{profile.skills.map((skill, index) => (<span key={index} className="px-4 py-2 bg-gray-700 text-white rounded-full text-sm font-semibold">{skill}</span>))}</div>
                </div>
              )}
              
              {/* ## NEW: AVAILABLE SESSIONS CARD ## */}
              {profile.role === 'senior' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Available Sessions</h2>
                  {profile.availableTimeSlots && profile.availableTimeSlots.filter(slot => !slot.isBooked).length > 0 ? (
                    <ul className="space-y-3">
                      {profile.availableTimeSlots.filter(slot => !slot.isBooked).map(slot => (
                        <li key={slot._id} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white">{new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm text-gray-300">{slot.time}</p>
                          </div>
                          {!isOwnProfile && (
                            <button onClick={() => handleBookSession(slot._id)} className="px-4 py-2 text-sm text-white font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700">
                              Book ({profile.pricing} Cr)
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">This mentor has no available sessions right now.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;