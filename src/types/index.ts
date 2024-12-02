```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  timeLimit: number;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: number[];
  score: number;
  timeSpent: number;
  completedAt: Date;
}
```