import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User as UserIcon, Home, BookOpen, History, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    ...(user ? [
      { name: 'Quizzes', href: '/quizzes', icon: BookOpen },
      { name: 'History', href: '/history', icon: History },
      ...(user.role === 'admin' ? [
        { name: 'Admin', href: '/admin', icon: LayoutDashboard }
      ] : [])
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || 
                               (item.href !== '/' && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-4 border-b-2 text-sm font-medium",
                      isActive
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className={cn(
                      "inline-flex items-center px-4 border-b-2 text-sm font-medium",
                      location.pathname === '/profile'
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Registrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Quiz System. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}