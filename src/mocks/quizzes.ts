import { Quiz } from '../types';

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Mathematics Fundamentals',
    subject: 'Mathematics',
    timeLimit: 30,
    questions: [
      {
        id: '1',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctOption: 1,
        subject: 'Mathematics',
        difficulty: 'easy'
      },
      {
        id: '2',
        text: 'What is the square root of 16?',
        options: ['2', '4', '6', '8'],
        correctOption: 1,
        subject: 'Mathematics',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: '2',
    title: 'Basic Science Concepts',
    subject: 'Science',
    timeLimit: 45,
    questions: [
      {
        id: '3',
        text: 'Which planet is closest to the Sun?',
        options: ['Venus', 'Mars', 'Mercury', 'Earth'],
        correctOption: 2,
        subject: 'Science',
        difficulty: 'medium'
      },
      {
        id: '4',
        text: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'O2', 'NaCl'],
        correctOption: 0,
        subject: 'Science',
        difficulty: 'easy'
      }
    ]
  }
];