import React from 'react';
import { Card } from '../ui/Card';

export function PerformanceChart() {
  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Desempenho por Matéria</h3>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {['Matemática', 'Português', 'Ciências', 'História'].map((subject) => (
            <div key={subject} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">{subject}</span>
                <span className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 30 + 70)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${Math.floor(Math.random() * 30 + 70)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}