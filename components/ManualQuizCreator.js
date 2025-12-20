import React, { useState } from 'react';
import htm from 'htm';
import { Plus, Trash2, Save, X, CheckCircle, PenTool, Layers, Clock } from 'lucide-react';

const html = htm.bind(React.createElement);

const ManualQuizCreator = ({ onSave, onCancel, initialQuiz }) => {
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [category, setCategory] = useState(initialQuiz?.category || '');
  const [difficulty, setDifficulty] = useState(initialQuiz?.difficulty || 'Medium');
  const [duration, setDuration] = useState(initialQuiz?.duration || 5);
  const [questions, setQuestions] = useState(initialQuiz?.questionsArray || []);
  const [qText, setQText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addQuestion = () => {
    if (!qText.trim()) { setError('Question text is required'); return; }
    if (options.some(opt => !opt.trim())) { setError('All 4 options must be filled'); return; }
    
    setQuestions([...questions, {
      questionText: qText,
      options: [...options],
      correctAnswerIndex: correctIndex
    }]);

    setQText('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
    setError('');
  };

  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  const handleSaveQuiz = () => {
    if (!title.trim() || !category.trim()) { setError('Please fill in title and category.'); return; }
    if (questions.length === 0) { setError('Please add at least one question.'); return; }

    const newQuiz = {
      _id: initialQuiz ? initialQuiz._id : `q_manual_${Date.now()}`,
      title, description, category, difficulty, questionsArray: questions, duration
    };
    onSave(newQuiz);
  };

  // Shared input class for consistency and visibility
  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-200 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1";

  return html`
    <div className="min-h-screen p-4 md:p-8 animate-slide-up bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <${PenTool} className="text-emerald-600" />
               Quiz Builder
             </h1>
             <p className="text-slate-500 dark:text-slate-400 mt-1">Craft your own custom quiz from scratch.</p>
          </div>
          <div className="flex gap-3">
             <button onClick=${onCancel} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
             <button onClick=${handleSaveQuiz} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg transition-colors flex items-center gap-2">
               <${Save} size=${18} /> Publish
             </button>
          </div>
        </div>

        ${error && html`
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-300 rounded-xl flex items-center gap-2">
            <${X} size=${18} /> ${error}
          </div>
        `}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <!-- Left Col -->
           <div className="lg:col-span-7 space-y-6">
              <!-- Metadata -->
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                   <${Layers} size=${18} className="text-indigo-500" /> Quiz Details
                 </h3>
                 
                 <div className="space-y-5">
                   <div>
                     <label className=${labelClass}>Title</label>
                     <input 
                       className=${inputClass}
                       placeholder="e.g. Advanced JavaScript" 
                       value=${title} 
                       onChange=${e => setTitle(e.target.value)} 
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className=${labelClass}>Category</label>
                       <input 
                         className=${inputClass} 
                         placeholder="e.g. Coding" 
                         value=${category} 
                         onChange=${e => setCategory(e.target.value)} 
                       />
                     </div>
                     <div>
                       <label className=${labelClass}>Difficulty</label>
                       <select 
                         className=${inputClass}
                         value=${difficulty}
                         onChange=${(e) => setDifficulty(e.target.value)}
                       >
                         <option value="Easy">Easy</option>
                         <option value="Medium">Medium</option>
                         <option value="Hard">Hard</option>
                       </select>
                     </div>
                   </div>

                   <div>
                       <label className=${labelClass}>Duration (Min)</label>
                       <input 
                         type="number"
                         className=${inputClass} 
                         value=${duration} 
                         onChange=${e => setDuration(Number(e.target.value))} 
                       />
                   </div>

                   <div>
                     <label className=${labelClass}>Description</label>
                     <textarea 
                       className=${`${inputClass} resize-none h-32`}
                       placeholder="Short description..." 
                       value=${description} 
                       onChange=${e => setDescription(e.target.value)} 
                     />
                   </div>
                 </div>
              </div>

              <!-- Add Question -->
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl shadow-indigo-500/5 border border-indigo-50 dark:border-slate-700 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                 <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                   <${Plus} size=${20} className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 p-0.5 rounded" />
                   Add Question
                 </h3>

                 <div className="space-y-5">
                   <div>
                      <label className=${labelClass}>Question Text</label>
                      <input 
                        className=${inputClass}
                        placeholder="Enter question..." 
                        value=${qText} 
                        onChange=${e => setQText(e.target.value)} 
                      />
                   </div>
                   
                   <div className="space-y-4">
                     <label className=${labelClass}>Answer Options <span className="text-[10px] opacity-70 ml-1 font-normal">(Select correct answer)</span></label>
                     ${options.map((opt, i) => html`
                        <div key=${i} className="flex gap-3 items-center">
                           <input 
                             type="radio" 
                             name="correct" 
                             className="w-6 h-6 accent-indigo-600 cursor-pointer shrink-0"
                             checked=${correctIndex === i} 
                             onChange=${() => setCorrectIndex(i)} 
                           />
                           <input 
                             className=${`flex-1 px-4 py-2.5 rounded-xl border-2 outline-none transition-colors ${correctIndex === i ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-slate-900 dark:text-white' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'}`} 
                             value=${opt} 
                             onChange=${e => handleOptionChange(i, e.target.value)} 
                             placeholder=${`Option ${i+1}`} 
                           />
                        </div>
                     `)}
                   </div>

                   <div className="pt-4 flex justify-end">
                      <button onClick=${addQuestion} className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-lg">
                        <${Plus} size=${18} /> Add Question
                      </button>
                   </div>
                 </div>
              </div>
           </div>

           <!-- Right Col -->
           <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 sticky top-6">
                 <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/30 rounded-t-2xl">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Preview</h3>
                    <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 px-2 py-0.5 rounded text-xs font-bold">${questions.length} Questions</span>
                 </div>
                 <div className="p-4 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                    ${questions.length === 0 ? html`
                      <div className="text-center py-12 text-slate-400">
                        <p>No questions yet.</p>
                      </div>
                    ` : questions.map((q, i) => html`
                       <div key=${i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 relative group hover:border-indigo-200 dark:hover:border-slate-500 transition-colors">
                          <button onClick=${() => removeQuestion(i)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition-colors"><${Trash2} size=${16} /></button>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 pr-6 text-sm mb-3"><span className="text-slate-400 mr-2">${i+1}.</span>${q.questionText}</h4>
                          <div className="grid grid-cols-2 gap-2">
                             ${q.options.map((opt, optIdx) => html`
                               <div key=${optIdx} className=${`text-xs px-2 py-1.5 rounded border font-medium ${q.correctAnswerIndex === optIdx ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>${opt}</div>
                             `)}
                          </div>
                       </div>
                    `)}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `;
};

export default ManualQuizCreator;