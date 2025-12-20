
import React, { useState } from 'react';
import { login, register, loginAsGuest } from '../services/mockBackend';
import { User } from '../types';
import { BrainCircuit, Mail, Lock, User as UserIcon, Building2, GraduationCap, ArrowRight, Loader2, Globe, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onSuccess: (user: User) => void;
  onCancel?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'Student' | 'Teacher'>('Student');
  const [organization, setOrganization] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
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

  const inputStyles = "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl overflow-hidden animate-slide-up relative border border-white/20">
        
        {onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-4 left-4 z-20 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <BrainCircuit className="text-indigo-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI QuizGen</h1>
            <p className="text-indigo-100 mt-2 text-sm font-medium">
              {isLogin ? 'Welcome back! Ready to learn?' : 'Join the competition today.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 text-sm rounded-xl border border-rose-100 dark:border-rose-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-4 animate-fade-in">
                 <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Student')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${role === 'Student' ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400'}`}
                  >
                    <GraduationCap size={18} />
                    <span className="text-sm font-semibold">Student</span>
                  </button>
                   <button
                    type="button"
                    onClick={() => setRole('Teacher')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${role === 'Teacher' ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400'}`}
                  >
                    <UserIcon size={18} />
                    <span className="text-sm font-semibold">Teacher</span>
                  </button>
                </div>

                <div className="relative">
                  <Building2 className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="School / Organization Name"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    className={inputStyles}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputStyles}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputStyles}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 text-center border-t border-slate-100 dark:border-white/5">
             <button
               type="button"
               onClick={handleGuestLogin}
               disabled={loading}
               className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
             >
               <Globe size={16} />
               Continue as Guest
             </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isLogin ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
          
          {isLogin && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-center">
               <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Demo Accounts</p>
               <div className="flex justify-center gap-2">
                 <button onClick={() => {setEmail('qm@test.com'); setPassword('password');}} className="px-4 py-2 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/5">Teacher</button>
                 <button onClick={() => {setEmail('rn@test.com'); setPassword('password');}} className="px-4 py-2 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/5">Student</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
