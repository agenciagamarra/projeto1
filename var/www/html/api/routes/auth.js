import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE email = ? AND password_hash = ?',
      [email, password] // Na prática, usar bcrypt para hash
    );

    if (!users[0]) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no login' });
  }
});

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar se email já existe
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing[0]) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'user'] // Na prática, usar bcrypt para hash
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      role: 'user'
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro no registro' });
  }
});

export default router;