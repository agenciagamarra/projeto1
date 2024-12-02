import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Middleware de erro global
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});