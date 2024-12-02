import { pool } from '../db/connection.js';
import { QuizService } from '../services/quiz.service.js';
import { validateQuiz } from '../utils/validation.js';

const quizService = new QuizService(pool);

export class QuizController {
  async list(req, res, next) {
    try {
      const quizzes = await quizService.getAllQuizzes();
      res.json(quizzes);
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { q } = req.query;
      const quizzes = await quizService.searchQuizzes(q);
      res.json(quizzes);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const quiz = await quizService.getQuizById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const validatedData = validateQuiz(req.body);
      const quizId = await quizService.createQuiz(validatedData);
      res.status(201).json({ id: quizId });
    } catch (error) {
      next(error);
    }
  }
}

export const quizController = new QuizController();