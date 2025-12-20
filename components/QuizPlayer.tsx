import React, { useState, useEffect } from 'react';
import { Quiz, Question } from '../types';
import { submitQuiz, getCurrentUser } from '../services/mockBackend';
import { Timer, CheckCircle, XCircle, ArrowRight, AlertCircle, LogOut, HelpCircle } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (resultId: string, score: number, total: number) => void;
  onExit: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  // Use quiz duration (minutes) converted to seconds, or default to 5 minutes
  const [timeRemaining, setTimeRemaining] = useState((quiz.duration || 5) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (isSubmitting) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  const currentQuestion: Question = quiz.questionsArray[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setAnswers((prev) => [...prev, selectedOption]);
    } else {
      setAnswers((prev) => [...prev, -1]);
    }

    if (currentIndex < quiz.questionsArray.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    const finalAnswers = selectedOption !== null 
      ? [...answers, selectedOption] 
      : [...answers, -1];

    const user = getCurrentUser();
    const totalDuration = (quiz.duration || 5) * 60;

    try {
      const response = await submitQuiz(
        user._id,
        quiz._id,
        finalAnswers,
        totalDuration - timeRemaining
      );
      onComplete(response.result._id, response.result.score, quiz.questionsArray.length * 10);
    } catch (error) {
      console.error("Failed to submit", error);
      alert("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIndex) / quiz.questionsArray.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 px-2">
        <button 
          onClick={onExit} 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition-colors font-medium"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Quit Quiz</span>
        </button>
        
        <div className="bg-white border border-slate-200 text-slate-900 shadow-sm dark:bg-white/10 dark:backdrop-blur-md dark:border-white/20 px-4 py-2 rounded-full flex items-center gap-3">
          <Timer className="text-indigo-600 dark:text-indigo-200" size={18} />
          <span className="font-mono font-bold text-slate-900 dark:text-white tracking-widest">{formatTime(timeRemaining)}</span>
        </div>

        <div className="text-slate-600 dark:text-white/80 font-medium">
          <span className="text-indigo-600 dark:text-indigo-200">Q</span> {currentIndex + 1} <span className="text-slate-300 dark:text-white/40">/</span> {quiz.questionsArray.length}
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden animate-slide-up flex flex-col md:flex-row min-h-[500px] border border-transparent dark:border-slate-700">
        
        {/* Left Side: Question Context */}
        <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-900/50 p-8 border-r border-slate-100 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200 dark:bg-slate-700">
             <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>

          <div>
            <div className="inline-block px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-6 shadow-sm">
              {quiz.category}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              {currentQuestion.questionText}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Select the best answer from the options provided.</p>
          </div>

          <div className="mt-8 hidden md:block">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
               <div className="flex items-start gap-3">
                 <HelpCircle className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" size={18} />
                 <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed font-medium">
                   Tip: Read all options carefully before selecting. Once you select an answer, you can't change it.
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Options */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-center bg-white dark:bg-slate-800">
           <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              let optionClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden ";
              let icon = <span className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center justify-center group-hover:border-indigo-500 dark:group-hover:border-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{(idx + 10).toString(36).toUpperCase()}</span>;
              
              if (isAnswered) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  optionClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300 shadow-sm z-10";
                  icon = <CheckCircle className="text-emerald-500 fill-emerald-100 dark:fill-emerald-900" size={24} />;
                } else if (idx === selectedOption) {
                  optionClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-300 shadow-sm";
                  icon = <XCircle className="text-rose-500 fill-rose-100 dark:fill-rose-900" size={24} />;
                } else {
                  optionClass += "border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-50 grayscale";
                }
              } else {
                optionClass += "border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 bg-white dark:bg-slate-800";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={optionClass}
                >
                  <span className={`font-semibold text-lg ${isAnswered ? '' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{option}</span>
                  <div className="shrink-0 ml-4">
                    {icon}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end h-12">
            {isAnswered && (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white pl-6 pr-5 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all flex items-center gap-2 animate-fade-in transform active:scale-95"
              >
                <span>{currentIndex === quiz.questionsArray.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight size={18} />
              </button>
            )}
            {!isAnswered && (
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium animate-pulse">
                <AlertCircle size={14} />
                <span>Choose an answer</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizPlayer;