import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { loginSchema, userSchema } from '../utils/validation.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      const user = users[0];
      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        },
        token
      });
    } catch (error) {
      next(error);
    }
  },

  async register(req, res, next) {
    try {
      const userData = userSchema.parse(req.body);
      
      const [existing] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existing[0]) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const passwordHash = await bcrypt.hash(userData.password, 10);

      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [userData.name, userData.email, passwordHash, userData.role || 'user']
      );

      res.status(201).json({
        id: result.insertId,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user'
      });
    } catch (error) {
      next(error);
    }
  }
};