import { QuizAttempt } from '../types';

export const mockAttempts: QuizAttempt[] = [
  {
    id: '1',
    userId: '1',
    quizId: '1',
    answers: [1, 1],
    score: 100,
    timeSpent: 600,
    completedAt: new Date('2024-03-15T10:30:00')
  },
  {
    id: '2',
    userId: '1',
    quizId: '2',
    answers: [2, 1],
    score: 50,
    timeSpent: 900,
    completedAt: new Date('2024-03-14T15:45:00')
  }
];