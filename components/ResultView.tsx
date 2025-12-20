import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface ResultViewProps {
  score: number;
  total: number;
  title: string;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ score, total, title, onHome }) => {
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

export default ResultView;