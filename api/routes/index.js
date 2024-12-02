import express from 'express';
import quizRoutes from './quizzes.js';
import attemptRoutes from './attempts.js';
import userRoutes from './users.js';
import authRoutes from './auth.js';

const router = express.Router();

router.use('/quizzes', quizRoutes);
router.use('/attempts', attemptRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;