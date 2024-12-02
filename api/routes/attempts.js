import express from 'express';
import { attemptController } from '../controllers/attempt.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, attemptController.create);
router.get('/user/:userId', auth, attemptController.getUserAttempts);
router.get('/:id', auth, attemptController.getAttemptDetails);

export default router;