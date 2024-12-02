import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    
    if (!rows[0]) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, req.params.id]
    );
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;