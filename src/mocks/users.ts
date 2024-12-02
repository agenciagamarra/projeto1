import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    createdAt: new Date('2024-02-20')
  }
];