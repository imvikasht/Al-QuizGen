
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import Quiz from '../models/Quiz';

// Get all quizzes
// Fix: Use any for req and res to resolve "Property 'json' does not exist" errors caused by type shadowing or version mismatches
export const getQuizzes = async (req: any, res: any) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
};

// Create a new quiz
// Fix: Use any for req and res
export const createQuiz = async (req: any, res: any) => {
  try {
    const newQuiz = new Quiz(req.body);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz' });
  }
};

// Get quiz by ID
// Fix: Use any for req and res
export const getQuizById = async (req: any, res: any) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz' });
  }
};
