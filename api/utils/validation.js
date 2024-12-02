import { z } from 'zod';

export const quizSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  subject: z.string().min(2, 'Matéria deve ter no mínimo 2 caracteres'),
  timeLimit: z.number().min(1).max(180),
  questions: z.array(z.object({
    text: z.string().min(1, 'Texto da questão é obrigatório'),
    options: z.array(z.string()).min(2).max(4),
    correctOption: z.number().min(0).max(3),
    image: z.object({
      url: z.string().url(),
      width: z.number().optional(),
      height: z.number().optional()
    }).optional()
  })).min(1, 'Quiz deve ter pelo menos uma questão')
});

export const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['admin', 'user'])
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export const attemptSchema = z.object({
  userId: z.string(),
  quizId: z.string(),
  answers: z.array(z.number()),
  score: z.number().min(0).max(100),
  timeSpent: z.number().min(0)
});