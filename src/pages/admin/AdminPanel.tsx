import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, BookOpen, BarChart } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { QuizManagement } from './QuizManagement';
import { AdminDashboard } from './AdminDashboard';

export function AdminPanel() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Quizzes', href: '/admin/quizzes', icon: BookOpen },
  ];

  return (
    <div className="flex">
      <div className="w-64 bg-white shadow-sm">
        <nav className="space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-w-0 bg-white">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="quizzes" element={<QuizManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}