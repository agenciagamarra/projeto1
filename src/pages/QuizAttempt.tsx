import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Quiz, Question } from '../types';
import { Check, X, Clock, AlertTriangle, Timer, Search } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuthStore } from '../store/authStore';

export function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;

      try {
        const quizData = await api.getQuizWithQuestions(id);
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(-1));
        setTimeLeft(quizData.timeLimit * 60);
      } catch (err) {
        setError('Falha ao carregar quiz');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const handleSubmit = useCallback(async (isTimeUp: boolean = false) => {
    if (isSubmitted || !quiz || !user) return;
    
    setIsSubmitting(true);
    setIsPaused(true);
    
    try {
      const correctAnswers = answers.reduce((acc, answer, index) => {
        return acc + (answer === quiz.questions[index].correctOption ? 1 : 0);
      }, 0);
      const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
      
      await api.submitQuizAttempt({
        id: '', // será gerado pelo banco
        userId: user.id,
        quizId: quiz.id,
        answers,
        score: finalScore,
        timeSpent: quiz.timeLimit * 60 - timeLeft,
        completedAt: new Date(),
      });

      setScore(finalScore);
      setIsSubmitted(true);
      setShowTimeWarning(false);
      setShowConfirmSubmit(false);
    } catch (error) {
      setError('Falha ao enviar respostas');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, isSubmitted, quiz, timeLeft, user]);

  // ... resto do código do componente permanece igual ...
  
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

  if (!quiz) return null;

  // ... resto do JSX permanece igual ...
}