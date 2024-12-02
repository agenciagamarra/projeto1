import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

export const pool = mysql.createPool(dbConfig);

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    return false;
  }
}