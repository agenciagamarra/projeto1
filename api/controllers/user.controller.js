import { pool } from '../db.js';
import { userSchema } from '../utils/validation.js';

export const userController = {
  async list(req, res, next) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, created_at FROM users'
      );
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
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
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const userData = userSchema.partial().parse(req.body);
      await pool.execute(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [userData.name, userData.email, userData.role, req.params.id]
      );
      res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};