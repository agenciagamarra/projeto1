import { User, Quiz, Question } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateUser(data: Partial<User>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!data.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!data.role) {
    errors.push({ field: 'role', message: 'Role is required' });
  } else if (!['admin', 'user'].includes(data.role)) {
    errors.push({ field: 'role', message: 'Invalid role' });
  }

  return errors;
}

export function validateQuiz(data: Partial<Quiz>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (data.title.length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
  }

  if (!data.subject?.trim()) {
    errors.push({ field: 'subject', message: 'Subject is required' });
  }

  if (!data.timeLimit || data.timeLimit < 1) {
    errors.push({ field: 'timeLimit', message: 'Time limit must be at least 1 minute' });
  } else if (data.timeLimit > 180) {
    errors.push({ field: 'timeLimit', message: 'Time limit cannot exceed 180 minutes' });
  }

  if (!data.questions?.length) {
    errors.push({ field: 'questions', message: 'At least one question is required' });
  } else {
    data.questions.forEach((question, index) => {
      const questionErrors = validateQuestion(question, index);
      errors.push(...questionErrors);
    });
  }

  return errors;
}

export function validateQuestion(question: Partial<Question>, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `questions[${index}]`;

  if (!question.text?.trim()) {
    errors.push({ field: `${prefix}.text`, message: `Question ${index + 1} text is required` });
  }

  if (!question.options?.length || question.options.length < 2) {
    errors.push({ field: `${prefix}.options`, message: `Question ${index + 1} must have at least 2 options` });
  } else {
    question.options.forEach((option, optionIndex) => {
      if (!option.trim()) {
        errors.push({
          field: `${prefix}.options[${optionIndex}]`,
          message: `Option ${optionIndex + 1} in question ${index + 1} cannot be empty`,
        });
      }
    });
  }

  if (question.correctOption === undefined || question.correctOption < 0 || 
      question.correctOption >= (question.options?.length || 0)) {
    errors.push({
      field: `${prefix}.correctOption`,
      message: `Question ${index + 1} must have a valid correct option selected`,
    });
  }

  if (!question.difficulty) {
    errors.push({
      field: `${prefix}.difficulty`,
      message: `Question ${index + 1} must have a difficulty level`,
    });
  } else if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push({
      field: `${prefix}.difficulty`,
      message: `Question ${index + 1} has an invalid difficulty level`,
    });
  }

  return errors;
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(error => error.field === field)?.message;
}