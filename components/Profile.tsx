import React, { useState } from 'react';
import { User } from '../types';
import { updateUserProfile } from '../services/mockBackend';
import { ArrowLeft, Mail, Building2, User as UserIcon, Award, Star, Edit2, Save, X, Camera } from 'lucide-react';

interface ProfileProps {
  user: User;
  onBack: () => void;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Edit State
  const [username, setUsername] = useState(user.username);
  const [organization, setOrganization] = useState(user.organization || '');
  const [role, setRole] = useState(user.role || 'Student');
  const [avatarSeed, setAvatarSeed] = useState(user.username); // Use seed for dicebear

  const handleSave = async () => {
    setLoading(true);
    try {
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
      const updatedUser = await updateUserProfile(user._id, {
        username,
        organization,
        role,
        avatarUrl
      });
      onUpdate(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-slide-up">
      {/* Header / Back */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h2>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-medium shadow-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium shadow-lg hover:bg-emerald-500 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center sticky top-6">
             <div className="relative group mb-6">
               <div className="w-32 h-32 rounded-full bg-indigo-50 dark:bg-indigo-900/30 p-1 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden">
                  <img 
                    src={isEditing ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}` : (user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
               </div>
               {isEditing && (
                 <div className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-indigo-600 transition-colors">
                   <Camera size={16} />
                 </div>
               )}
             </div>

             {isEditing ? (
               <div className="w-full space-y-3">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Avatar Seed</label>
                   <input 
                     value={avatarSeed}
                     onChange={(e) => setAvatarSeed(e.target.value)}
                     className="w-full text-center px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-sm"
                     placeholder="Type anything to change avatar"
                   />
                 </div>
               </div>
             ) : (
               <>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user.username}</h3>
                 <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">{user.role}</p>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-100 dark:border-amber-800">
                    <Star size={12} fill="currentColor" />
                    Level 5 Scholar
                 </div>
               </>
             )}
          </div>
        </div>

        {/* Right Column: Info & Stats */}
        <div className="md:col-span-2 space-y-6">
           
           {/* Details Card */}
           <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
                <UserIcon className="text-indigo-500" size={20} />
                Personal Information
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Full Name</label>
                    {isEditing ? (
                      <input 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    ) : (
                      <div className="font-semibold text-slate-700 dark:text-slate-200 text-lg">{user.username}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Email Address</label>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-transparent dark:border-slate-700">
                      <Mail size={16} className="text-slate-400" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Organization</label>
                     {isEditing ? (
                      <input 
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="School or Company Name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                        <Building2 size={18} className="text-slate-400" />
                        {user.organization || 'Not set'}
                      </div>
                    )}
                   </div>
                   <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Role</label>
                    {isEditing ? (
                       <select 
                         value={role}
                         onChange={e => setRole(e.target.value as any)}
                         className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                         <option value="Student">Student</option>
                         <option value="Teacher">Teacher</option>
                         <option value="Admin">Admin</option>
                       </select>
                    ) : (
                      <div className="font-semibold text-slate-700 dark:text-slate-200">{user.role}</div>
                    )}
                   </div>
                </div>
              </div>
           </div>

           {/* Stats Row */}
           <div className="grid grid-cols-2 gap-6">
             <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 bg-white opacity-10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Score</div>
                  <div className="text-3xl font-bold">{user.totalScore.toLocaleString()}</div>
                  <div className="mt-4 text-xs font-medium bg-white/20 inline-block px-2 py-1 rounded-lg text-indigo-100">
                    Top 5% Global
                  </div>
                </div>
             </div>
             
             <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Badges Earned</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{user.badgesArray.length}</div>
                <div className="flex -space-x-2">
                   {user.badgesArray.length > 0 ? user.badgesArray.map((badge, i) => (
                     <div key={i} className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 border-2 border-white dark:border-slate-700 flex items-center justify-center" title={badge}>
                       <Award size={14} className="text-amber-600 dark:text-amber-400" />
                     </div>
                   )) : <span className="text-xs text-slate-400">No badges yet</span>}
                </div>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;