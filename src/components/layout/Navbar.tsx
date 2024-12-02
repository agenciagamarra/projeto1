```tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { BookOpen, User, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    ...(user ? [
      { name: 'Quizzes', href: '/quizzes' },
      { name: 'History', href: '/history' },
      ...(user.role === 'admin' ? [{ name: 'Admin', href: '/admin' }] : [])
    ] : [])
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location.pathname === item.href
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-1" />
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```