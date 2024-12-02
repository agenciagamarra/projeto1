import React, { useState } from 'react';
import { User, Clock, Award, Eye, Search, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { QuizDetailsModal } from '../QuizDetailsModal';
import { QuizAttempt } from '../../types';

// Mock data - substituir por dados reais da API
const mockAttempts = [
  {
    id: '1',
    userId: '1',
    userName: 'João Silva',
    quizId: '1',
    quizTitle: 'Matemática Básica',
    answers: [1, 2, 0, 1, 3],
    score: 80,
    timeSpent: 1200,
    completedAt: new Date('2024-03-15T10:30:00'),
  },
  {
    id: '2',
    userId: '2',
    userName: 'Maria Santos',
    quizId: '2',
    quizTitle: 'História do Brasil',
    answers: [0, 1, 2, 1, 0],
    score: 60,
    timeSpent: 900,
    completedAt: new Date('2024-03-14T15:45:00'),
  },
];

export function UserAttempts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const filteredAttempts = mockAttempts.filter(
    (attempt) =>
      attempt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-medium">Histórico de Tentativas</h3>
          <div className="w-full sm:w-64">
            <Input
              type="search"
              placeholder="Buscar por usuário ou quiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {filteredAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{attempt.userName}</h4>
                      <p className="text-sm text-gray-500">{attempt.quizTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(attempt.completedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(attempt.timeSpent)}</span>
                    </div>
                    <Badge variant={getScoreColor(attempt.score)}>
                      {attempt.score}%
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAttempt(attempt)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>

      {selectedAttempt && (
        <QuizDetailsModal
          isOpen={!!selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
          attempt={selectedAttempt}
        />
      )}
    </Card>
  );
}