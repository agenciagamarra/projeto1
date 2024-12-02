import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Search } from 'lucide-react';
import { useQuizStore } from '../../store/quiz.store';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';

export function QuizList() {
  const { quizzes, isLoading, error, fetchQuizzes, searchQuizzes } = useQuizStore();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearch) {
      fetchQuizzes();
    } else {
      searchQuizzes(debouncedSearch);
    }
  }, [debouncedSearch, fetchQuizzes, searchQuizzes]);

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
          onClick={() => fetchQuizzes()}
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
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <p className="mt-2 text-gray-600">Select a quiz to start your assessment</p>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search by title, subject, or question content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
          icon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No quizzes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/quiz/${quiz.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-md">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {quiz.subject}
                  </span>
                </div>
                
                <h3 className="mt-4 text-lg font-medium text-gray-900">{quiz.title}</h3>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {quiz.timeLimit} minutes
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {quiz.questions.length} questions
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}