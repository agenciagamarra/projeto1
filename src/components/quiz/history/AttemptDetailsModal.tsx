```tsx
import { Modal } from '../../ui/Modal';
import { QuizAttempt } from '../../../types';
import { Check, X } from 'lucide-react';
import { formatTime } from '../../../lib/format';

interface AttemptDetailsModalProps {
  attempt: QuizAttempt;
  isOpen: boolean;
  onClose: () => void;
}

export function AttemptDetailsModal({ attempt, isOpen, onClose }: AttemptDetailsModalProps) {
  // Mock quiz data - replace with actual quiz data from store
  const quiz = {
    title: 'Mathematics Fundamentals',
    questions: [
      {
        id: '1',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctOption: 1,
      },
      {
        id: '2',
        text: 'What is the square root of 16?',
        options: ['2', '4', '6', '8'],
        correctOption: 1,
      }
    ],
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quiz Results"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{quiz.title}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Score</p>
              <p className={`text-2xl font-bold ${
                attempt.score >= 80 ? 'text-green-600' :
                attempt.score >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {attempt.score}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(attempt.timeSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className={`p-4 rounded-lg ${
                attempt.answers[index] === question.correctOption
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">
                  {index + 1}. {question.text}
                </h4>
                {attempt.answers[index] === question.correctOption ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-md ${
                      optionIndex === question.correctOption
                        ? 'bg-green-100 text-green-700'
                        : attempt.answers[index] === optionIndex
                        ? 'bg-red-100 text-red-700'
                        : 'bg-white text-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{String.fromCharCode(65 + optionIndex)}.</span>
                      {option}
                      {optionIndex === question.correctOption && (
                        <Check className="ml-auto h-4 w-4 text-green-500" />
                      )}
                      {attempt.answers[index] === optionIndex &&
                       optionIndex !== question.correctOption && (
                        <X className="ml-auto h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
```