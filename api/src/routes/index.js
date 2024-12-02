import express from 'express';
import quizRoutes from './quiz.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import attemptRoutes from './attempt.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/users', userRoutes);
router.use('/attempts', attemptRoutes);

export default router;