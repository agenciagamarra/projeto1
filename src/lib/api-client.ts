import { User, Quiz, QuizAttempt, QuizImport } from '../types';

const API_URL = 'http://157.245.92.191:3002/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API request failed' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const apiClient = {
  // Quizzes
  async getQuizzes(): Promise<Quiz[]> {
    return fetchApi('/quizzes');
  },

  async getQuizById(id: string): Promise<Quiz> {
    return fetchApi(`/quizzes/${id}`);
  },

  async searchQuizzes(term: string): Promise<Quiz[]> {
    return fetchApi(`/quizzes/search?q=${encodeURIComponent(term)}`);
  },

  async createQuiz(quiz: Partial<Quiz>): Promise<Quiz> {
    return fetchApi('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
  },

  async importQuiz(quizData: QuizImport): Promise<Quiz> {
    return fetchApi('/quizzes/import', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  // Quiz Attempts
  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
    return fetchApi('/attempts', {
      method: 'POST',
      body: JSON.stringify(attempt),
    });
  },

  async getUserAttempts(userId: string): Promise<QuizAttempt[]> {
    return fetchApi(`/attempts/user/${userId}`);
  },

  async getAttemptById(id: string): Promise<QuizAttempt> {
    return fetchApi(`/attempts/${id}`);
  },

  // Users
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(userData: { name: string; email: string; password: string }): Promise<User> {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getUsers(): Promise<User[]> {
    return fetchApi('/users');
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};