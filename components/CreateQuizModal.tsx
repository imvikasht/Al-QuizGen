import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Quiz } from '../types';
import { generateQuizWithAI } from '../services/geminiService';

interface CreateQuizModalProps {
  onCancel: () => void;
  onSuccess: (quiz: Quiz) => void;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ onCancel, onSuccess }) => {
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

export default CreateQuizModal;