```tsx
import { QuizAttempt } from '../../../types';

interface PerformanceSummaryProps {
  attempts: QuizAttempt[];
}

export function PerformanceSummary({ attempts }: PerformanceSummaryProps) {
  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0
    ? Math.round(attempts.reduce((acc, attempt) => acc + attempt.score, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0
    ? Math.max(...attempts.map(attempt => attempt.score))
    : 0;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Performance Summary</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{averageScore}%</dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Quizzes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalAttempts}</dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Best Score</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{bestScore}%</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
```