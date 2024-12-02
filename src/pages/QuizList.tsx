import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, Search } from 'lucide-react';
import { Quiz } from '../types';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';

export function QuizList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setIsLoading(true);
        const data = await api.getQuizzes();
        setQuizzes(data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar quizzes');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  useEffect(() => {
    const searchQuizzes = async () => {
      if (!debouncedSearch.trim()) {
        const data = await api.getQuizzes();
        setQuizzes(data);
        return;
      }

      try {
        setIsLoading(true);
        const data = await api.searchQuizzes(debouncedSearch);
        setQuizzes(data);
        setError(null);
      } catch (err) {
        setError('Falha ao pesquisar quizzes');
      } finally {
        setIsLoading(false);
      }
    };

    searchQuizzes();
  }, [debouncedSearch]);

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
          onClick={() => window.location.reload()}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quizzes Disponíveis</h1>
        <p className="mt-2 text-gray-600">Selecione um quiz para começar sua avaliação</p>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Buscar por título, matéria ou conteúdo das questões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
          icon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum quiz encontrado</p>
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
                    {quiz.timeLimit} minutos
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    {quiz.questions.length} questões
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