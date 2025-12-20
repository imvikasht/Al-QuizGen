import React, { useState, useEffect } from 'react';
import { Quiz, ViewState, User } from '../types';
import { getQuizzes, checkSession, saveQuiz, logout, updateUserProfile, loginAsGuest } from '../services/mockBackend';
import { generateQuizWithAI } from '../services/geminiService';
import QuizPlayer from '../components/QuizPlayer';
import Leaderboard from '../components/Leaderboard';
import ManualQuizCreator from '../components/ManualQuizCreator';
import Auth from '../components/Auth';
import Profile from '../components/Profile';
import { Play, Plus, Trophy, Share2, Sparkles, BrainCircuit, Github, LogOut, LogIn, LayoutGrid, Clock, ChevronRight, X, User as UserIcon, PenTool, Moon, Sun, Edit3, Building2, Medal } from 'lucide-react';

// --- ResultView Component ---
const ResultView: React.FC<{ score: number, total: number, title: string, onHome: () => void }> = ({ score, total, title, onHome }) => {
  const percentage = Math.round((score / total) * 100);
  let message = "Good effort!";
  let icon = <Trophy size={48} className="text-slate-400" />;
  
  if (percentage >= 90) {
    message = "Outstanding!";
    icon = <Trophy size={48} className="text-amber-500" />;
  } else if (percentage >= 70) {
    message = "Great Job!";
    icon = <Medal size={48} className="text-slate-400" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-100 dark:border-slate-700">
        <div className="flex justify-center mb-6">
           <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full shadow-inner">
             {icon}
           </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{message}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">You completed <strong>{title}</strong></p>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-700">
           <div className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Your Score</div>
           <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{score}</div>
           <div className="text-slate-400 font-medium">out of {total} points</div>
        </div>

        <button 
          onClick={onHome}
          className="w-full py-3 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

// --- CreateQuizModal Component ---
const CreateQuizModal: React.FC<{ onCancel: () => void, onSuccess: (quiz: Quiz) => void }> = ({ onCancel, onSuccess }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [duration, setDuration] = useState(5);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      const quiz = await generateQuizWithAI(topic, difficulty, numQuestions, duration, description);
      onSuccess(quiz);
    } catch (err) {
      console.error(err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
       <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 p-16 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
             <h2 className="text-2xl font-bold text-white relative z-10 flex items-center gap-2">
               <Sparkles size={24} />
               AI Quiz Generator
             </h2>
             <p className="text-indigo-100 text-sm mt-1 relative z-10">Powered by Google Gemini</p>
             <button onClick={onCancel} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
               <X size={18} />
             </button>
          </div>
          
          <div className="p-8 space-y-6">
             {error && (
               <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 rounded-xl text-sm font-medium border border-rose-100 dark:border-rose-800">
                 {error}
               </div>
             )}

             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Quiz Topic</label>
               <input 
                 autoFocus
                 value={topic}
                 onChange={e => setTopic(e.target.value)}
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                 placeholder="e.g. Ancient Rome, Quantum Physics, Taylor Swift..."
               />
             </div>
             
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Instructions / Context (Optional)</label>
               <textarea 
                 value={description}
                 onChange={e => setDescription(e.target.value)}
                 className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white resize-none h-24 text-sm"
                 placeholder="e.g. Focus on specific historical dates, or make it funny..."
               />
             </div>
             
             <div className="grid grid-cols-3 gap-4">
               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                 <select 
                   value={difficulty}
                   onChange={e => setDifficulty(e.target.value)}
                   className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
                 >
                   <option value="Easy">Easy</option>
                   <option value="Medium">Medium</option>
                   <option value="Hard">Hard</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Questions</label>
                 <select 
                   value={numQuestions}
                   onChange={e => setNumQuestions(Number(e.target.value))}
                   className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
                 >
                   <option value={5}>5 Qs</option>
                   <option value={10}>10 Qs</option>
                   <option value={15}>15 Qs</option>
                   <option value={20}>20 Qs</option>
                   <option value={30}>30 Qs</option>
                   <option value={40}>40 Qs</option>
                   <option value={50}>50 Qs</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                 <select 
                   value={duration}
                   onChange={e => setDuration(Number(e.target.value))}
                   className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
                 >
                   <option value={5}>5 min</option>
                   <option value={10}>10 min</option>
                   <option value={15}>15 min</option>
                   <option value={20}>20 min</option>
                   <option value={30}>30 min</option>
                   <option value={45}>45 min</option>
                   <option value={60}>1 hour</option>
                 </select>
               </div>
             </div>

             <button 
               onClick={handleGenerate}
               disabled={loading || !topic}
               className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${loading || !topic ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500 dark:text-slate-400 shadow-none' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5'}`}
             >
               {loading ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Generating Magic...</span>
                 </>
               ) : (
                 <>
                   <Sparkles size={20} />
                   <span>Generate Quiz</span>
                 </>
               )}
             </button>
          </div>
       </div>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard: React.FC<{
  onSelectQuiz: (quiz: Quiz) => void;
  onEditQuiz: (quiz: Quiz) => void;
  onShareQuiz: (quiz: Quiz) => void;
  onViewLeaderboard: () => void;
  onCreateQuizAI: () => void;
  onCreateQuizManual: () => void;
  onViewProfile: () => void;
  onAuthAction: () => void;
  currentUser: User;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  lastUpdate: number; // Added to trigger refresh
}> = ({ onSelectQuiz, onEditQuiz, onShareQuiz, onViewLeaderboard, onCreateQuizAI, onCreateQuizManual, onViewProfile, onAuthAction, currentUser, isDarkMode, toggleDarkMode, lastUpdate }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const isGuest = currentUser.role === 'Guest';

  useEffect(() => {
    // Refresh quizzes when component mounts or lastUpdate changes
    setLoading(true);
    getQuizzes().then(data => {
      setQuizzes(data);
      setLoading(false);
    });
  }, [lastUpdate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <header className="py-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
           <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
             <BrainCircuit className="text-white" size={28} />
           </div>
           <div>
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI QuizGen</h1>
             <p className="text-slate-500 dark:text-indigo-200 text-xs font-medium uppercase tracking-wider">Professional Edition</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Profile Button - Clickable User Info */}
           <button 
            onClick={onViewProfile}
            className="hidden md:flex flex-col items-end mr-2 text-right hover:opacity-80 transition-opacity"
            title="View Profile"
           >
             <span className="text-slate-900 dark:text-white font-medium text-sm">{currentUser.username}</span>
             <div className="flex items-center gap-1.5 text-slate-500 dark:text-indigo-200 text-xs justify-end">
               <span className="bg-indigo-500/10 dark:bg-indigo-500/30 px-1.5 py-0.5 rounded border border-indigo-400/30">{currentUser.role || 'Guest'}</span>
               {currentUser.organization && <span className="max-w-[100px] truncate">@ {currentUser.organization}</span>}
             </div>
           </button>
           
           <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm bg-white/70 dark:bg-slate-800/60 border border-white dark:border-white/10">
             <div>
               <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Score</div>
               <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 leading-tight">{currentUser.totalScore.toLocaleString()}</div>
             </div>
             <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
             <button 
              onClick={onViewLeaderboard}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors group relative"
              title="Leaderboard"
             >
               <Trophy size={20} className="group-hover:text-amber-500 transition-colors" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
             </button>
           </div>

           <button 
             onClick={toggleDarkMode}
             className="p-3 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl backdrop-blur-md transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
             title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           
           {/* Mobile Profile Icon */}
           <button
             onClick={onViewProfile}
             className="md:hidden p-3 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl backdrop-blur-md transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
             title="View Profile"
           >
             <UserIcon size={20} />
           </button>
           
           <button
             onClick={onAuthAction}
             className={`p-3 rounded-xl backdrop-blur-md transition-colors border shadow-sm ${isGuest ? 'bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-500/20'}`}
             title={isGuest ? "Sign In" : "Log Out"}
           >
             {isGuest ? <LogIn size={20} /> : <LogOut size={20} />}
           </button>
        </div>
      </header>

      {/* Hero / Welcome */}
      <div className="mb-10 animate-slide-up">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Ready to challenge your mind, {currentUser.username.split(' ')[0]}?
        </h2>
        <p className="text-slate-600 dark:text-indigo-100 text-lg max-w-2xl">
          Create custom AI-powered quizzes or jump into one of our curated challenges.
        </p>
      </div>

      {/* Creation Section */}
      <div className="mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-lg font-bold text-slate-800 dark:text-indigo-200 mb-5 uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={18} />
          Create New Quiz
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Card (AI) */}
          <button 
            onClick={onCreateQuizAI}
            className="group relative flex flex-col items-start justify-between p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden text-left h-full min-h-[220px] border border-white/10 w-full"
          >
            <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10 w-full">
              <div className="flex justify-between items-start w-full mb-4">
                 <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                   <Sparkles className="text-white" size={28} />
                 </div>
                 <div className="px-3 py-1 bg-indigo-500/40 rounded-full border border-indigo-400/30 text-indigo-100 text-xs font-bold uppercase tracking-wider">
                   Popular
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 leading-tight">Generate with AI</h3>
              <p className="text-indigo-100 text-sm font-medium">Instantly generate a quiz on any topic using Gemini.</p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2 text-white font-semibold group-hover:translate-x-1 transition-transform bg-white/10 px-4 py-2 rounded-xl border border-white/5">
              <span>Start Creation</span>
              <ChevronRight size={18} />
            </div>
          </button>

          {/* Create Card (Manual) */}
          <button 
            onClick={onCreateQuizManual}
            className="group relative flex flex-col items-start justify-between p-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden text-left h-full min-h-[220px] border border-white/10 w-full"
          >
            <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10 w-full">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                 <PenTool className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 leading-tight">Build from Scratch</h3>
              <p className="text-emerald-100 text-sm font-medium">Manually design questions and answers for your students.</p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2 text-white font-semibold group-hover:translate-x-1 transition-transform bg-white/10 px-4 py-2 rounded-xl border border-white/5">
              <span>Start Building</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      </div>

      {/* Available Quizzes Section */}
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-lg font-bold text-slate-800 dark:text-indigo-200 mb-5 uppercase tracking-wider flex items-center gap-2">
          <LayoutGrid size={18} />
          Explore Quizzes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} className="h-[280px] bg-white/5 backdrop-blur-sm rounded-3xl animate-pulse border border-white/10"></div>
            ))
          ) : (
            quizzes.map((quiz, idx) => (
              <div 
                key={quiz._id} 
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full min-h-[280px] group animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        quiz.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 
                        quiz.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 
                        'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                      }`}>
                        {quiz.difficulty}
                      </span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <LayoutGrid size={16} />
                   </div>
                 </div>
                 
                 <div className="mb-auto">
                   <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">{quiz.category}</div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{quiz.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">{quiz.description}</p>
                 </div>

                 <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                   <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
                     <Clock size={14} />
                     <span>{quiz.duration || 5}m</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <button 
                       onClick={() => onShareQuiz(quiz)}
                       className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                       title="Share Quiz"
                     >
                       <Share2 size={16} />
                     </button>
                     <button 
                       onClick={() => onEditQuiz(quiz)}
                       className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                       title="Edit Quiz"
                     >
                       <Edit3 size={16} />
                     </button>
                     <button 
                      onClick={() => onSelectQuiz(quiz)}
                      className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:shadow-indigo-500/25 transition-all flex items-center gap-2 transform active:scale-95 ml-1"
                     >
                       <Play size={14} fill="currentColor" />
                       Play
                     </button>
                   </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [resultData, setResultData] = useState<{score: number, total: number, id: string} | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [lastQuizUpdate, setLastQuizUpdate] = useState(Date.now()); // New state to trigger dashboard refresh
  
  // For Manual Creator
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // For AI Modal
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setCurrentUser(user);
        } else {
          // No session? Create a guest session automatically
          // Await strict here to prevent race condition before setting loading=false
          const guest = await loginAsGuest();
          setCurrentUser(guest);
        }
      } catch (error) {
        console.error("Session init error", error);
        // Fallback to guest on error
        const guest = await loginAsGuest();
        setCurrentUser(guest);
      } finally {
        setLoadingSession(false);
      }
    };

    initSession();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setView('HOME');
  };

  const handleAuthAction = async () => {
    // If currently a guest, we simply switch to Auth view to allow them to sign in/register.
    // We do NOT clear the session yet, so if they click Back, they are still logged in as Guest.
    if (currentUser?.role === 'Guest') {
       setView('AUTH');
    } else {
       // If a regular user, we log them out completely
       await logout();
       setCurrentUser(null);
       setView('AUTH');
    }
  };

  const handleAuthCancel = async () => {
    // If the user is already logged in (e.g. Guest session active), just go home.
    if (currentUser) {
      setView('HOME');
      return;
    }

    // If no user (e.g. explicitly logged out), create a new guest session to go back to dashboard.
    setLoadingSession(true);
    try {
      const guest = await loginAsGuest();
      setCurrentUser(guest);
      setView('HOME');
    } catch (error) {
      console.error("Failed to restore guest session", error);
    } finally {
      setLoadingSession(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Helper to render content based on view
  const renderContent = () => {
    switch (view) {
      case 'AUTH':
        return <Auth onSuccess={handleLoginSuccess} onCancel={handleAuthCancel} />;

      case 'HOME':
        // Safe check: we should have a currentUser (guest or real) by now if loadingSession is false.
        // If somehow null, we redirect to Auth but allow onCancel to go back to Home (which re-triggers Guest login if needed)
        if (!currentUser) return <Auth onSuccess={handleLoginSuccess} onCancel={handleAuthCancel} />;
        return (
          <>
            <Dashboard 
              onSelectQuiz={(q) => { setActiveQuiz(q); setView('QUIZ'); }}
              onEditQuiz={(q) => { setEditingQuiz(q); setView('CREATE_MANUAL'); }}
              onShareQuiz={(q) => {
                 // Mock share
                 alert(`Share this link: ${window.location.origin}/quiz/${q._id}`);
              }}
              onViewLeaderboard={() => setView('LEADERBOARD')}
              onCreateQuizAI={() => setShowAIModal(true)}
              onCreateQuizManual={() => { setEditingQuiz(null); setView('CREATE_MANUAL'); }}
              onViewProfile={() => setView('PROFILE')}
              onAuthAction={handleAuthAction}
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              lastUpdate={lastQuizUpdate}
            />
            {showAIModal && (
              <CreateQuizModal 
                onCancel={() => setShowAIModal(false)}
                onSuccess={(quiz) => {
                  saveQuiz(quiz);
                  setShowAIModal(false);
                  alert(`Quiz "${quiz.title}" created!`);
                  setLastQuizUpdate(Date.now()); // Trigger dashboard refresh instead of reload
                }}
              />
            )}
          </>
        );
      
      case 'QUIZ':
        if (!activeQuiz) return <div>No quiz selected</div>;
        return (
          <QuizPlayer 
            quiz={activeQuiz} 
            onComplete={(id, score, total) => {
              setResultData({ id, score, total });
              setView('RESULT');
            }}
            onExit={() => setView('HOME')}
          />
        );

      case 'RESULT':
        if (!activeQuiz || !resultData) return null;
        return (
          <ResultView 
            score={resultData.score} 
            total={resultData.total} 
            title={activeQuiz.title} 
            onHome={() => { setActiveQuiz(null); setView('HOME'); }} 
          />
        );

      case 'LEADERBOARD':
        return <Leaderboard onBack={() => setView('HOME')} />;

      case 'PROFILE':
        if (!currentUser) return null;
        return (
          <Profile 
            user={currentUser} 
            onBack={() => setView('HOME')}
            onUpdate={(updatedUser) => setCurrentUser(updatedUser)} 
          />
        );

      case 'CREATE_MANUAL':
        return (
          <ManualQuizCreator 
            initialQuiz={editingQuiz}
            onCancel={() => setView('HOME')}
            onSave={(quiz) => {
              saveQuiz(quiz);
              setLastQuizUpdate(Date.now());
              setView('HOME');
            }}
          />
        );
      
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
       {renderContent()}
    </div>
  );
};

export default App;