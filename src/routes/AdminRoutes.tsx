import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { QuizManagement } from '../pages/admin/QuizManagement';

export function AdminRoutes() {
  const { user } = useAuthStore();

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="quizzes" element={<QuizManagement />} />
    </Routes>
  );
}