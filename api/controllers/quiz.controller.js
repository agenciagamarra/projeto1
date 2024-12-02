import { pool } from '../db.js';
import { parseTxtQuiz } from '../utils/quiz-parser.js';

export const quizController = {
  async list(req, res, next) {
    try {
      const [rows] = await pool.execute(`
        SELECT q.*, COUNT(qu.id) as question_count
        FROM quizzes q
        LEFT JOIN questions qu ON q.id = qu.quiz_id
        GROUP BY q.id
        ORDER BY q.created_at DESC
      `);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async search(req, res, next) {
    try {
      const { q } = req.query;
      const [rows] = await pool.execute(`
        SELECT DISTINCT q.*
        FROM quizzes q
        LEFT JOIN questions qu ON q.id = qu.quiz_id
        LEFT JOIN question_options qo ON qu.id = qo.question_id
        WHERE 
          q.title LIKE ? OR
          q.subject LIKE ? OR
          qu.text LIKE ? OR
          qo.option_text LIKE ?
      `, [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const [quiz] = await pool.execute(
        'SELECT * FROM quizzes WHERE id = ?',
        [req.params.id]
      );

      if (!quiz[0]) {
        return res.status(404).json({ error: 'Quiz não encontrado' });
      }

      const [questions] = await pool.execute(`
        SELECT q.*, GROUP_CONCAT(qo.option_text ORDER BY qo.option_index) as options
        FROM questions q
        LEFT JOIN question_options qo ON q.id = qo.question_id
        WHERE q.quiz_id = ?
        GROUP BY q.id
        ORDER BY q.id
      `, [req.params.id]);

      const formattedQuestions = questions.map(q => ({
        ...q,
        options: q.options.split(','),
        image: q.image_url ? {
          url: q.image_url,
          width: q.image_width,
          height: q.image_height
        } : undefined
      }));

      res.json({
        ...quiz[0],
        questions: formattedQuestions
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const connection = await pool.getConnection();
    try {
      const quizData = req.validatedData;
      await connection.beginTransaction();

      const [quizResult] = await connection.execute(
        `INSERT INTO quizzes (title, subject, time_limit)
         VALUES (?, ?, ?)`,
        [quizData.title, quizData.subject, quizData.timeLimit]
      );
      
      const quizId = quizResult.insertId;

      for (const question of quizData.questions) {
        const [questionResult] = await connection.execute(
          `INSERT INTO questions (quiz_id, text, image_url, image_width, image_height)
           VALUES (?, ?, ?, ?, ?)`,
          [
            quizId,
            question.text,
            question.image?.url,
            question.image?.width,
            question.image?.height
          ]
        );

        const questionId = questionResult.insertId;

        for (let i = 0; i < question.options.length; i++) {
          await connection.execute(
            `INSERT INTO question_options (question_id, option_text, option_index)
             VALUES (?, ?, ?)`,
            [questionId, question.options[i], i]
          );
        }
      }

      await connection.commit();
      res.status(201).json({ id: quizId });
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  },

  async import(req, res, next) {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const connection = await pool.getConnection();
    try {
      const content = req.file.buffer.toString('utf-8');
      const questions = parseTxtQuiz(content);
      const { title, subject, timeLimit } = req.body;

      await connection.beginTransaction();

      const [quizResult] = await connection.execute(
        `INSERT INTO quizzes (title, subject, time_limit)
         VALUES (?, ?, ?)`,
        [title, subject, parseInt(timeLimit, 10)]
      );
      
      const quizId = quizResult.insertId;

      for (const question of questions) {
        const [questionResult] = await connection.execute(
          `INSERT INTO questions (quiz_id, text, image_url, image_width, image_height)
           VALUES (?, ?, ?, ?, ?)`,
          [
            quizId,
            question.text,
            question.image?.url,
            question.image?.width,
            question.image?.height
          ]
        );

        const questionId = questionResult.insertId;

        for (let i = 0; i < question.options.length; i++) {
          await connection.execute(
            `INSERT INTO question_options (question_id, option_text, option_index)
             VALUES (?, ?, ?)`,
            [questionId, question.options[i], i]
          );
        }
      }

      await connection.commit();
      res.status(201).json({ id: quizId });
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }
};