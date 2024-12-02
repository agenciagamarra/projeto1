import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.js';
import { testConnection } from './db/index.js';

const app = express();

app.use(cors());
app.use(express.json());

// Testar conexão com o banco antes de iniciar o servidor
testConnection().then((connected) => {
  if (!connected) {
    console.error('Não foi possível estabelecer conexão com o banco de dados. Encerrando aplicação.');
    process.exit(1);
  }

  // Rotas
  app.use('/api', routes);

  // Middleware de erro global
  app.use(errorHandler);

  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
  });
});