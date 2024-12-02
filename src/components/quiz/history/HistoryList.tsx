```tsx
import { useState } from 'react';
import { Clock, Award, Calendar } from 'lucide-react';
import { QuizAttempt } from '../../../types';
import { AttemptDetailsModal } from './AttemptDetailsModal';
import { formatTime, formatDate } from '../../../lib/format';

interface HistoryListProps {
  attempts: QuizAttempt[];
}

export function HistoryList({ attempts }: HistoryListProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (attempts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No quiz attempts yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {attempts.map((attempt) => (
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

      {selectedAttempt && (
        <AttemptDetailsModal
          attempt={selectedAttempt}
          isOpen={!!selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
}
```