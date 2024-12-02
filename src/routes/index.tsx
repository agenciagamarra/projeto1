```tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Home } from '../pages/Home';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Profile } from '../pages/user/Profile';
import { QuizList } from '../pages/quiz/QuizList';
import { QuizAttempt } from '../pages/quiz/QuizAttempt';
import { History } from '../pages/quiz/History';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { QuizManagement } from '../pages/admin/QuizManagement';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quiz/:id" element={<QuizAttempt />} />
        <Route path="/history" element={<History />} />
        
        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="quizzes" element={<QuizManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}
```