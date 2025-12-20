
import React, { useState } from 'react';
import htm from 'htm';
import { login, register, loginAsGuest } from '../services/mockBackend.js';
import { BrainCircuit, Mail, Lock, User as UserIcon, Building2, GraduationCap, ArrowRight, Loader2, Globe, ArrowLeft } from 'lucide-react';

const html = htm.bind(React.createElement);

const Auth = ({ onSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Student');
  const [organization, setOrganization] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await login(email, password);
        onSuccess(user);
      } else {
        if (!username || !email || !password || !organization) {
          throw new Error("All fields are required");
        }
        const user = await register(username, email, password, role, organization);
        onSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
        const user = await loginAsGuest();
        onSuccess(user);
    } catch (e) {
        setError("Could not login as guest");
        setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner";

  return html`
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl overflow-hidden relative animate-slide-up border border-white/20">
        ${onCancel && html`
          <button onClick=${onCancel} className="absolute top-4 left-4 z-20 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors">
            <${ArrowLeft} size=${20} />
          </button>
        `}
        
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <${BrainCircuit} className="text-indigo-600" size=${32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI QuizGen</h1>
            <p className="text-indigo-100 mt-2 text-sm font-medium">
              ${isLogin ? 'Welcome back! Ready to learn?' : 'Join the competition today.'}
            </p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit=${handleSubmit} className="space-y-4">
            ${error && html`
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 text-sm rounded-xl border border-rose-100 dark:border-rose-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                ${error}
              </div>
            `}
            
            ${!isLogin && html`
              <${React.Fragment}>
                <div className="relative">
                  <${UserIcon} className="absolute left-4 top-3.5 text-slate-400" size=${18} />
                  <input className=${inputClass} placeholder="Username" value=${username} onChange=${e => setUsername(e.target.value)} />
                </div>
                <div className="relative">
                  <${Building2} className="absolute left-4 top-3.5 text-slate-400" size=${18} />
                  <input className=${inputClass} placeholder="Organization" value=${organization} onChange=${e => setOrganization(e.target.value)} />
                </div>
                <div className="flex gap-2">
                   <button type="button" onClick=${() => setRole('Student')} className=${`flex-1 py-3 border rounded-xl transition-all ${role === 'Student' ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-white/5 text-slate-500'}`}>
                    <${GraduationCap} size=${18} className="inline mr-2" />
                    Student
                   </button>
                   <button type="button" onClick=${() => setRole('Teacher')} className=${`flex-1 py-3 border rounded-xl transition-all ${role === 'Teacher' ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-white/5 text-slate-500'}`}>
                    <${UserIcon} size=${18} className="inline mr-2" />
                    Teacher
                   </button>
                </div>
              </${React.Fragment}>
            `}
            
            <div className="relative">
              <${Mail} className="absolute left-4 top-3.5 text-slate-400" size=${18} />
              <input className=${inputClass} type="email" placeholder="Email" value=${email} onChange=${e => setEmail(e.target.value)} />
            </div>
            
            <div className="relative">
              <${Lock} className="absolute left-4 top-3.5 text-slate-400" size=${18} />
              <input className=${inputClass} type="password" placeholder="Password" value=${password} onChange=${e => setPassword(e.target.value)} />
            </div>
            
            <button disabled=${loading} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
              ${loading ? html`<${Loader2} className="animate-spin" />` : (isLogin ? 'Sign In' : 'Register')}
            </button>
          </form>
          
          <button onClick=${handleGuestLogin} className="w-full mt-4 py-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
            <${Globe} size=${16} /> Continue as Guest
          </button>
          
          <div className="mt-4 text-center">
            <button onClick=${() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline">
              ${isLogin ? "Don't have an account? Register" : "Have an account? Sign In"}
            </button>
          </div>
          
          ${isLogin && html`
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-center">
               <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Demo Accounts</p>
               <div className="flex justify-center gap-2">
                 <button onClick=${() => {setEmail('qm@test.com'); setPassword('password');}} className="px-3 py-1 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs rounded-md hover:bg-slate-200">Teacher</button>
                 <button onClick=${() => {setEmail('rn@test.com'); setPassword('password');}} className="px-3 py-1 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs rounded-md hover:bg-slate-200">Student</button>
               </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

export default Auth;
