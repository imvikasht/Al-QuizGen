import express from 'express';
import { getQuizzes, createQuiz, getQuizById } from '../controllers/quizController';
import { login, register } from '../controllers/authController';

const router = express.Router();

// Auth Routes
router.post('/auth/login', login);
router.post('/auth/register', register);

// Quiz Routes
router.get('/quizzes', getQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes', createQuiz);

export default router;