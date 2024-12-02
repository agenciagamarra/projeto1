```tsx
import { useEffect } from 'react';
import { useAttemptStore } from '../../store/attempt.store';
import { HistoryList } from '../../components/quiz/history/HistoryList';
import { PerformanceSummary } from '../../components/quiz/history/PerformanceSummary';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function History() {
  const { attempts, isLoading, error, fetchUserAttempts } = useAttemptStore();

  useEffect(() => {
    fetchUserAttempts('1'); // Replace with actual user ID from auth store
  }, [fetchUserAttempts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchUserAttempts('1')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
        <p className="mt-2 text-gray-600">View your past quiz attempts and performance</p>
      </div>

      <div className="space-y-8">
        <PerformanceSummary attempts={attempts} />
        <HistoryList attempts={attempts} />
      </div>
    </div>
  );
}
```