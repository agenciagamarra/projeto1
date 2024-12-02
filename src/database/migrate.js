import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { dbConfig } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    const statements = schema.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate().catch(console.error);