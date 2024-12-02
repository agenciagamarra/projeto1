import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data
      const user: User = {
        id: '1',
        name: email === 'admin@example.com' ? 'Admin User' : 'Test User',
        email,
        role: email === 'admin@example.com' ? 'admin' : 'user',
        createdAt: new Date()
      };
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Invalid credentials', isLoading: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: 'user',
        createdAt: new Date()
      };
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Registration failed', isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));