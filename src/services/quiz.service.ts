import { Quiz, QuizAttempt } from '../types';
import { mockQuizzes } from '../mocks/quizzes';
import { mockAttempts } from '../mocks/attempts';

export const quizService = {
  async getQuizzes(): Promise<Quiz[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockQuizzes;
  },

  async getQuizById(id: string): Promise<Quiz | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockQuizzes.find(quiz => quiz.id === id);
  },

  async searchQuizzes(term: string): Promise<Quiz[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const searchTerm = term.toLowerCase();
    return mockQuizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm) ||
      quiz.subject.toLowerCase().includes(searchTerm) ||
      quiz.questions.some(q => 
        q.text.toLowerCase().includes(searchTerm) ||
        q.options.some(opt => opt.toLowerCase().includes(searchTerm))
      )
    );
  },

  async submitAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: Math.random().toString(36).substr(2, 9),
      completedAt: new Date()
    };
    mockAttempts.push(newAttempt);
    return newAttempt;
  }
};