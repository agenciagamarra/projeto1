import mysql from 'mysql2/promise';
import { dbConfig } from './config';
import { Quiz, Question, User, QuizAttempt } from '../types';

const pool = mysql.createPool(dbConfig);

export const quizDb = {
  // Usuários
  async createUser(user: Partial<User>) {
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [user.name, user.email, user.passwordHash, user.role]
    );
    return result;
  },

  async getUserByEmail(email: string) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Quizzes
  async createQuiz(quiz: Partial<Quiz>) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [quizResult] = await connection.execute(
        `INSERT INTO quizzes (title, subject, time_limit)
         VALUES (?, ?, ?)`,
        [quiz.title, quiz.subject, quiz.timeLimit]
      );
      const quizId = quizResult.insertId;

      for (const question of quiz.questions || []) {
        const [questionResult] = await connection.execute(
          `INSERT INTO questions (quiz_id, text, image_url, image_width, 
           image_height, subject, correct_option)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            quizId,
            question.text,
            question.image?.url,
            question.image?.width,
            question.image?.height,
            question.subject,
            question.correctOption
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
      return quizId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getQuizzes() {
    const [rows] = await pool.execute(`
      SELECT q.*, COUNT(qu.id) as question_count
      FROM quizzes q
      LEFT JOIN questions qu ON q.id = qu.quiz_id
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `);
    return rows;
  },

  async searchQuizzes(term: string) {
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
    `, [`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`]);
    return rows;
  },

  async getQuizById(id: string) {
    const [rows] = await pool.execute(
      'SELECT * FROM quizzes WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async getQuizQuestions(quizId: string) {
    const [questions] = await pool.execute(`
      SELECT q.*, GROUP_CONCAT(qo.option_text ORDER BY qo.option_index) as options
      FROM questions q
      LEFT JOIN question_options qo ON q.id = qo.question_id
      WHERE q.quiz_id = ?
      GROUP BY q.id
      ORDER BY q.id
    `, [quizId]);

    return questions.map(q => ({
      ...q,
      options: q.options.split(',')
    }));
  },

  // Tentativas
  async createAttempt(attempt: QuizAttempt) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [attemptResult] = await connection.execute(
        `INSERT INTO quiz_attempts (user_id, quiz_id, score, time_spent)
         VALUES (?, ?, ?, ?)`,
        [attempt.userId, attempt.quizId, attempt.score, attempt.timeSpent]
      );
      const attemptId = attemptResult.insertId;

      for (let i = 0; i < attempt.answers.length; i++) {
        await connection.execute(
          `INSERT INTO attempt_answers (attempt_id, question_id, selected_option)
           VALUES (?, ?, ?)`,
          [attemptId, i + 1, attempt.answers[i]]
        );
      }

      await connection.commit();
      return attemptId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getUserAttempts(userId: string) {
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
    `, [userId]);
    return rows;
  },

  async getAttemptDetails(attemptId: string) {
    const [rows] = await pool.execute(`
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
    `, [attemptId]);

    return rows.map(r => ({
      ...r,
      options: r.options.split(',')
    }));
  }
};

export default quizDb;