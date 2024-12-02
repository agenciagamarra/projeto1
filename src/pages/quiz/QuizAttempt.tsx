import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Search } from 'lucide-react';
import { useQuizStore } from '../../store/quiz.store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/quiz/ConfirmModal';
import { TimeWarningModal } from '../../components/quiz/TimeWarningModal';
import { useTimer } from '../../hooks/useTimer';

export function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, isLoading, error, fetchQuizById, submitAttempt } = useQuizStore();
  
  const [answers, setAnswers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { timeLeft, isPaused, startTimer, pauseTimer } = useTimer(
    currentQuiz?.timeLimit ? currentQuiz.timeLimit * 60 : 0,
    () => handleSubmit(true)
  );

  useEffect(() => {
    if (id) {
      fetchQuizById(id);
    }
  }, [id, fetchQuizById]);

  useEffect(() => {
    if (currentQuiz) {
      setAnswers(new Array(currentQuiz.questions.length).fill(-1));
      startTimer();
    }
  }, [currentQuiz, startTimer]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (isTimeUp = false) => {
    if (submitted || !currentQuiz) return;
    
    setIsSubmitting(true);
    pauseTimer();

    try {
      const timeSpent = (currentQuiz.timeLimit * 60) - timeLeft;
      const correctAnswers = answers.reduce((acc, answer, index) => {
        return acc + (answer === currentQuiz.questions[index].correctOption ? 1 : 0);
      }, 0);
      const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

      await submitAttempt({
        quizId: currentQuiz.id,
        userId: '1', // Replace with actual user ID from auth store
        answers,
        score,
        timeSpent,
        completedAt: new Date()
      });

      setSubmitted(true);
      setTimeout(() => navigate('/history'), 2000);
    } catch (error) {
      console.error('Failed to submit attempt:', error);
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  const filteredQuestions = currentQuiz?.questions.filter(question =>
    question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Quiz not found'}</p>
        <button
          onClick={() => navigate('/quizzes')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const unansweredCount = answers.filter(a => a === -1).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                timeLeft <= 60 ? 'text-red-600 animate-pulse' : 'text-indigo-600'
              }`}>
                <Clock className="h-5 w-5" />
                <span className="text-lg font-medium">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
            {!submitted && (
              <div className="flex items-center space-x-2 text-gray-500">
                <AlertTriangle className="h-5 w-5" />
                <span>{unansweredCount} unanswered questions</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>

          <div className="space-y-8">
            {filteredQuestions?.map((question, questionIndex) => (
              <div
                key={question.id}
                className={`p-6 border rounded-lg ${
                  submitted
                    ? answers[questionIndex] === question.correctOption
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                    : answers[questionIndex] === -1
                    ? 'border-yellow-200'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {questionIndex + 1}. {question.text}
                </h3>

                {question.image && (
                  <img
                    src={question.image.url}
                    alt="Question"
                    className="mb-4 rounded-lg max-w-full"
                    style={{
                      width: question.image.width || 'auto',
                      height: question.image.height || 'auto'
                    }}
                  />
                )}

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswer(questionIndex, optionIndex)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 border rounded-md transition-colors ${
                        submitted
                          ? optionIndex === question.correctOption
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : answers[questionIndex] === optionIndex
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-300 opacity-60'
                          : answers[questionIndex] === optionIndex
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{String.fromCharCode(65 + optionIndex)}.</span>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!submitted && (
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setShowConfirm(true)}
                isLoading={isSubmitting}
              >
                Submit Quiz
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        unansweredCount={unansweredCount}
        timeLeft={timeLeft}
      />

      <TimeWarningModal
        isOpen={timeLeft <= 60 && timeLeft > 0 && !submitted && !showConfirm}
        onClose={() => {}}
      />
    </div>
  );
}