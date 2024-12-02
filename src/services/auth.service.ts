import { User } from '../types';
import { mockUsers } from '../mocks/users';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return user;
  },

  async register(userData: { name: string; email: string; password: string }): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      role: 'user',
      createdAt: new Date()
    };
    
    mockUsers.push(newUser);
    return newUser;
  }
};