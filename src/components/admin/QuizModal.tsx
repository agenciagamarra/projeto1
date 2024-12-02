import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { validateQuiz, ValidationError, getFieldError } from '../../lib/validation';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz?: Quiz;
  onSubmit: (quizData: Partial<Quiz>) => Promise<void>;
}

export function QuizModal({ isOpen, onClose, quiz, onSubmit }: QuizModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [questions, setQuestions] = useState<Partial<Question>[]>(
    quiz?.questions || [{ 
      text: '', 
      options: ['', '', '', ''], 
      correctOption: 0,
      subject: '',
      difficulty: 'medium',
    }]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const quizData = {
      title: formData.get('title') as string,
      subject: formData.get('subject') as string,
      timeLimit: parseInt(formData.get('timeLimit') as string, 10),
      questions,
    };

    const validationErrors = validateQuiz(quizData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit(quizData);
      onClose();
    } catch (err) {
      setErrors([{ field: 'submit', message: 'Falha ao salvar quiz' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        text: '', 
        options: ['', '', '', ''], 
        correctOption: 0,
        subject: '',
        difficulty: 'medium',
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateQuestionImage = (index: number, field: 'url' | 'width' | 'height', value: string) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[index];
    const image = question.image || {};
    
    if (field === 'url') {
      updatedQuestions[index] = {
        ...question,
        image: { ...image, url: value }
      };
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        updatedQuestions[index] = {
          ...question,
          image: { ...image, [field]: numValue }
        };
      }
    }
    
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const options = [...updatedQuestions[questionIndex].options!];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options };
    setQuestions(updatedQuestions);
  };

  const submitError = getFieldError(errors, 'submit');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quiz ? 'Editar Quiz' : 'Criar Quiz'}
      className="sm:max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
            {submitError}
          </div>
        )}

        <Input
          label="Título do Quiz"
          name="title"
          defaultValue={quiz?.title}
          error={getFieldError(errors, 'title')}
          required
        />

        <Input
          label="Matéria"
          name="subject"
          defaultValue={quiz?.subject}
          error={getFieldError(errors, 'subject')}
          required
        />

        <Input
          label="Tempo Limite (minutos)"
          name="timeLimit"
          type="number"
          min="1"
          max="180"
          defaultValue={quiz?.timeLimit || 30}
          error={getFieldError(errors, 'timeLimit')}
          required
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Questões</h4>
            <Button type="button" onClick={addQuestion} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Questão
            </Button>
          </div>

          {getFieldError(errors, 'questions') && (
            <p className="text-sm text-red-600">{getFieldError(errors, 'questions')}</p>
          )}

          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <Input
                    label={`Questão ${questionIndex + 1}`}
                    value={question.text}
                    onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                    error={getFieldError(errors, `questions[${questionIndex}].text`)}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-600 hover:text-red-700"
                  disabled={questions.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h5 className="flex items-center text-sm font-medium text-gray-700">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Imagem da Questão (opcional)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="URL da Imagem"
                    value={question.image?.url || ''}
                    onChange={(e) => updateQuestionImage(questionIndex, 'url', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <Input
                    label="Largura (px)"
                    type="number"
                    value={question.image?.width || ''}
                    onChange={(e) => updateQuestionImage(questionIndex, 'width', e.target.value)}
                    placeholder="800"
                  />
                  <Input
                    label="Altura (px)"
                    type="number"
                    value={question.image?.height || ''}
                    onChange={(e) => updateQuestionImage(questionIndex, 'height', e.target.value)}
                    placeholder="600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dificuldade
                </label>
                <select
                  value={question.difficulty}
                  onChange={(e) => updateQuestion(questionIndex, 'difficulty', e.target.value)}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    getFieldError(errors, `questions[${questionIndex}].difficulty`)
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
                {getFieldError(errors, `questions[${questionIndex}].difficulty`) && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(errors, `questions[${questionIndex}].difficulty`)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={question.correctOption === optionIndex}
                      onChange={() => updateQuestion(questionIndex, 'correctOption', optionIndex)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Input
                      placeholder={`Opção ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                      error={getFieldError(errors, `questions[${questionIndex}].options[${optionIndex}]`)}
                      required
                    />
                  </div>
                ))}
                {getFieldError(errors, `questions[${questionIndex}].correctOption`) && (
                  <p className="text-sm text-red-600">
                    {getFieldError(errors, `questions[${questionIndex}].correctOption`)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full sm:w-auto sm:ml-3"
          >
            {quiz ? 'Salvar Alterações' : 'Criar Quiz'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mt-3 w-full sm:w-auto sm:mt-0"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}