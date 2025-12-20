// Simulating Mongoose Schemas as TypeScript Interfaces

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string; // Added for auth simulation
  role?: 'Student' | 'Teacher' | 'Admin' | 'Guest'; // Added for school context
  organization?: string; // Added for school/college name
  avatarUrl?: string; // Added for profile images
  totalScore: number;
  badgesArray: string[];
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questionsArray: Question[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  duration?: number; // Duration in minutes
}

export interface Result {
  _id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  date: string;
}

export type ViewState = 'HOME' | 'QUIZ' | 'LEADERBOARD' | 'RESULT' | 'CREATE_QUIZ' | 'CREATE_MANUAL' | 'PROFILE' | 'AUTH';

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[]; // user's selected indices
  isFinished: boolean;
  timeRemaining: number;
}