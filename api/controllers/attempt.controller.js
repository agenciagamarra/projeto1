import { pool } from '../db.js';
import { attemptSchema } from '../utils/validation.js';

export const attemptController = {
  async create(req, res, next) {
    const connection = await pool.getConnection();
    try {
      const attemptData = attemptSchema.parse(req.body);
      await connection.beginTransaction();

      const [attemptResult] = await connection.execute(
        `INSERT INTO quiz_attempts (user_id, quiz_id, score, time_spent)
         VALUES (?, ?, ?, ?)`,
        [attemptData.userId, attemptData.quizId, attemptData.score, attemptData.timeSpent]
      );
      
      const attemptId = attemptResult.insertId;

      for (let i = 0; i < attemptData.answers.length; i++) {
        await connection.execute(
          `INSERT INTO attempt_answers (attempt_id, question_id, selected_option)
           VALUES (?, ?, ?)`,
          [attemptId, i + 1, attemptData.answers[i]]
        );
      }

      await connection.commit();
      res.status(201).json({ id: attemptId });
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  },

  async getUserAttempts(req, res, next) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          qa.*,
          q.title as quiz_title,
          u.name as user_name
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        JOIN users u ON qa.user_id = u.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
      `, [req.params.userId]);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async getAttemptDetails(req, res, next) {
    try {
      const [attempt] = await pool.execute(`
        SELECT 
          qa.*,
          q.title as quiz_title,
          u.name as user_name
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        JOIN users u ON qa.user_id = u.id
        WHERE qa.id = ?
      `, [req.params.id]);

      if (!attempt[0]) {
        return res.status(404).json({ error: 'Tentativa não encontrada' });
      }

      const [answers] = await pool.execute(`
        SELECT 
          aa.question_id,
          aa.selected_option,
          q.text as question_text,
          q.correct_option,
          GROUP_CONCAT(qo.option_text ORDER BY qo.option_index) as options
        FROM attempt_answers aa
        JOIN questions q ON aa.question_id = q.id
        JOIN question_options qo ON q.id = qo.question_id
        WHERE aa.attempt_id = ?
        GROUP BY aa.question_id
        ORDER BY aa.question_id
      `, [req.params.id]);

      res.json({
        ...attempt[0],
        answers: answers.map(a => ({
          ...a,
          options: a.options.split(',')
        }))
      });
    } catch (error) {
      next(error);
    }
  }
};