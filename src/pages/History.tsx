import React, { useState } from 'react';
import { Clock, Award, Calendar } from 'lucide-react';
import { QuizAttempt } from '../types';
import { QuizDetailsModal } from '../components/QuizDetailsModal';

// Mock data - replace with actual API call
const mockAttempts: QuizAttempt[] = [
  {
    id: '1',
    userId: '1',
    quizId: '1',
    answers: [1, 2, 0, 1, 3, 2, 1, 0, 2, 1],
    score: 80,
    timeSpent: 1200, // 20 minutes
    completedAt: new Date('2024-03-15T10:30:00'),
  },
  {
    id: '2',
    userId: '1',
    quizId: '2',
    answers: [0, 1, 2, 1, 0, 2, 1, 3, 2, 1],
    score: 70,
    timeSpent: 1500, // 25 minutes
    completedAt: new Date('2024-03-14T15:45:00'),
  },
];

export function History() {
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
        <p className="mt-2 text-gray-600">View your past quiz attempts and performance</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockAttempts.map((attempt) => (
            <li key={attempt.id}>
              <button
                onClick={() => setSelectedAttempt(attempt)}
                className="w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <p className="text-sm font-medium text-gray-900">
                        Mathematics Fundamentals
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(attempt.completedAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(attempt.timeSpent)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-gray-400" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreColor(attempt.score)}`}>
                          {attempt.score}%
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          attempt.score >= 80
                            ? 'bg-green-500'
                            : attempt.score >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${attempt.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Performance Summary</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">75%</dd>
            </div>
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Quizzes</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">2</dd>
            </div>
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Best Score</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">80%</dd>
            </div>
          </dl>
        </div>
      </div>

      {selectedAttempt && (
        <QuizDetailsModal
          isOpen={!!selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
          attempt={selectedAttempt}
        />
      )}
    </div>
  );
}