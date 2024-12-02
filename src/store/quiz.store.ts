import { create } from 'zustand';
import { Quiz } from '../types';
import { mockQuizzes } from '../mocks/quizzes';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  isLoading: boolean;
  error: string | null;
  fetchQuizzes: () => Promise<void>;
  fetchQuizById: (id: string) => Promise<void>;
  searchQuizzes: (term: string) => Promise<void>;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizzes: [],
  currentQuiz: null,
  isLoading: false,
  error: null,

  fetchQuizzes: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ quizzes: mockQuizzes, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch quizzes', isLoading: false });
    }
  },

  fetchQuizById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const quiz = mockQuizzes.find(q => q.id === id);
      set({ currentQuiz: quiz || null, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch quiz', isLoading: false });
    }
  },

  searchQuizzes: async (term) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const filtered = mockQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(term.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(term.toLowerCase())
      );
      set({ quizzes: filtered, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to search quizzes', isLoading: false });
    }
  }
}));