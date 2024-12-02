import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Criar nova tentativa
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { userId, quizId, answers, score, timeSpent } = req.body;
    
    const [attemptResult] = await connection.execute(
      `INSERT INTO quiz_attempts (user_id, quiz_id, score, time_spent)
       VALUES (?, ?, ?, ?)`,
      [userId, quizId, score, timeSpent]
    );
    
    const attemptId = attemptResult.insertId;

    for (let i = 0; i < answers.length; i++) {
      await connection.execute(
        `INSERT INTO attempt_answers (attempt_id, question_id, selected_option)
         VALUES (?, ?, ?)`,
        [attemptId, i + 1, answers[i]]
      );
    }

    await connection.commit();
    res.status(201).json({ id: attemptId });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar tentativa:', error);
    res.status(500).json({ error: 'Erro ao criar tentativa' });
  } finally {
    connection.release();
  }
});

// Buscar tentativas de um usuário
router.get('/user/:userId', async (req, res) => {
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
    console.error('Erro ao buscar tentativas:', error);
    res.status(500).json({ error: 'Erro ao buscar tentativas' });
  }
});

// Buscar detalhes de uma tentativa
router.get('/:id', async (req, res) => {
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
    console.error('Erro ao buscar detalhes da tentativa:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da tentativa' });
  }
});

export default router;