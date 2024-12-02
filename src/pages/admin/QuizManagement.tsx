import React, { useState } from 'react';
import { BookOpen, Edit, Trash2, Search, Plus, Clock, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Quiz, QuizImport } from '../../types';
import { QuizModal } from '../../components/admin/QuizModal';
import { QuizImportModal } from '../../components/admin/QuizImportModal';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';

// Mock data - replace with actual API call
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Mathematics Fundamentals',
    subject: 'Mathematics',
    questions: [],
    timeLimit: 30,
  },
  {
    id: '2',
    title: 'Basic Science Concepts',
    subject: 'Science',
    questions: [],
    timeLimit: 45,
  },
];

export function QuizManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [isImportingQuiz, setIsImportingQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const filteredQuizzes = mockQuizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuizSubmit = async (quizData: Partial<Quiz>) => {
    // Simulated API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Quiz data:', quizData);
  };

  const handleQuizImport = async (quizData: QuizImport) => {
    // Simulated API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Imported quiz data:', quizData);
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    // Simulated API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Deleting quiz:', quizToDelete.id);
    setIsDeleteModalOpen(false);
    setQuizToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Quizzes"
        description="Gerencie quizzes e suas questões"
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsImportingQuiz(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar Quiz
          </Button>
          <Button
            onClick={() => setIsAddingQuiz(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Quiz
          </Button>
        </div>
      </PageHeader>

      <div className="mt-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
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
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {quiz.timeLimit} minutos
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    setQuizToDelete(quiz);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-600 hover:text-red-900 inline-flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuizModal
        isOpen={isAddingQuiz || !!selectedQuiz}
        onClose={() => {
          setIsAddingQuiz(false);
          setSelectedQuiz(null);
        }}
        quiz={selectedQuiz || undefined}
        onSubmit={handleQuizSubmit}
      />

      <QuizImportModal
        isOpen={isImportingQuiz}
        onClose={() => setIsImportingQuiz(false)}
        onImport={handleQuizImport}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setQuizToDelete(null);
        }}
        title="Excluir Quiz"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.
          </p>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleDeleteQuiz}
              className="w-full sm:w-auto sm:ml-3"
              variant="outline"
            >
              Excluir
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setQuizToDelete(null);
              }}
              className="mt-3 w-full sm:w-auto sm:mt-0"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}