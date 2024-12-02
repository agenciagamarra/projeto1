import React from 'react';
import { Users, BookOpen, Award, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <Card.Content>
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-indigo-50">
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total de Usuários"
        value="156"
        icon={<Users className="h-6 w-6 text-indigo-600" />}
      />
      <StatsCard
        title="Quizzes Ativos"
        value="24"
        icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
      />
      <StatsCard
        title="Média de Pontuação"
        value="78%"
        icon={<Award className="h-6 w-6 text-indigo-600" />}
      />
      <StatsCard
        title="Tempo Médio"
        value="18min"
        icon={<Clock className="h-6 w-6 text-indigo-600" />}
      />
    </div>
  );
}