```typescript
import { create } from 'zustand';
import { QuizAttempt } from '../types';
import { mockAttempts } from '../mocks/attempts';

interface AttemptStore {
  attempts: QuizAttempt[];
  isLoading: boolean;
  error: string | null;
  fetchUserAttempts: (userId: string) => Promise<void>;
  getAttemptById: (id: string) => Promise<QuizAttempt | undefined>;
}

export const useAttemptStore = create<AttemptStore>((set, get) => ({
  attempts: [],
  isLoading: false,
  error: null,

  fetchUserAttempts: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ attempts: mockAttempts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch attempts', isLoading: false });
    }
  },

  getAttemptById: async (id) => {
    const { attempts } = get();
    return attempts.find(attempt => attempt.id === id);
  }
}));
```