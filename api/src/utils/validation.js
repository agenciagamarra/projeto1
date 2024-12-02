import { z } from 'zod';

export const quizSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  timeLimit: z.number().min(1).max(180),
  questions: z.array(z.object({
    text: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).min(2).max(4),
    correctOption: z.number().min(0).max(3),
    image: z.object({
      url: z.string().url(),
      width: z.number().optional(),
      height: z.number().optional()
    }).optional()
  })).min(1, 'Quiz must have at least one question')
});

export function validateQuiz(data) {
  return quizSchema.parse(data);
}

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user'])
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

export const attemptSchema = z.object({
  userId: z.string(),
  quizId: z.string(),
  answers: z.array(z.number()),
  score: z.number().min(0).max(100),
  timeSpent: z.number().min(0)
});