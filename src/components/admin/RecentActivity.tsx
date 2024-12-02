import React from 'react';
import { User, Clock, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  score?: number;
}

const recentActivities: ActivityItem[] = [
  {
    id: '1',
    user: 'João Silva',
    action: 'Completou o Quiz de Matemática',
    timestamp: new Date('2024-03-15T10:30:00'),
    score: 85,
  },
  {
    id: '2',
    user: 'Maria Santos',
    action: 'Iniciou o Quiz de Ciências',
    timestamp: new Date('2024-03-15T09:45:00'),
  },
];

export function RecentActivity() {
  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Atividade Recente</h3>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {activity.score && (
                  <Badge variant="success">
                    {activity.score}%
                  </Badge>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {activity.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}