import React, { useState } from 'react';
import htm from 'htm';
import { updateUserProfile } from '../services/mockBackend.js';
import { ArrowLeft, Mail, Building2, User as UserIcon, Award, Star, Edit2, Save, X, Camera } from 'lucide-react';

const html = htm.bind(React.createElement);

const Profile = ({ user, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [organization, setOrganization] = useState(user.organization || '');
  const [role, setRole] = useState(user.role || 'Student');
  const [avatarSeed, setAvatarSeed] = useState(user.username);

  const handleSave = async () => {
    setLoading(true);
    try {
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
      const updatedUser = await updateUserProfile(user._id, { username, organization, role, avatarUrl });
      onUpdate(updatedUser);
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
         <button onClick=${onBack} className="p-2 bg-slate-100 rounded-full"><${ArrowLeft} /></button>
         <h2 className="text-2xl font-bold dark:text-white">Profile</h2>
         <button onClick=${() => isEditing ? setIsEditing(false) : setIsEditing(true)} className="text-indigo-600">${isEditing ? 'Cancel' : 'Edit'}</button>
      </div>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow">
         <div className="flex flex-col items-center mb-6">
            <img src=${isEditing ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}` : user.avatarUrl} className="w-32 h-32 rounded-full border-4 border-slate-200" alt="avatar" />
            ${isEditing && html`<input className="mt-2 p-1 border rounded text-center" value=${avatarSeed} onChange=${e => setAvatarSeed(e.target.value)} placeholder="Avatar Seed" />`}
         </div>
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-slate-400 uppercase">Username</label>
               ${isEditing ? html`<input className="w-full p-2 border rounded" value=${username} onChange=${e => setUsername(e.target.value)} />` : html`<div className="dark:text-white font-bold text-xl">${user.username}</div>`}
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-400 uppercase">Organization</label>
               ${isEditing ? html`<input className="w-full p-2 border rounded" value=${organization} onChange=${e => setOrganization(e.target.value)} />` : html`<div className="dark:text-white">${user.organization}</div>`}
            </div>
            ${isEditing && html`<button onClick=${handleSave} disabled=${loading} className="w-full p-3 bg-indigo-600 text-white rounded font-bold">Save Changes</button>`}
         </div>
      </div>
    </div>
  `;
};

export default Profile;