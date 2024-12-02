import express from 'express';
import multer from 'multer';
import { quizController } from '../controllers/quiz.controller.js';
import { auth, adminAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { quizSchema } from '../utils/validation.js';

const router = express.Router();
const upload = multer();

router.get('/', quizController.list);
router.get('/search', quizController.search);
router.get('/:id', quizController.getById);
router.post('/', adminAuth, validate(quizSchema), quizController.create);
router.post('/import', adminAuth, upload.single('file'), quizController.import);

export default router;