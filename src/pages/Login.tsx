import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User } from '../types';
import { BookOpen, Lock, Mail } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let user: User;
      
      if (email === 'jane@example.com') {
        user = {
          id: '2',
          name: 'Jane Smith',
          email: email,
          role: 'admin',
          createdAt: new Date(),
        };
      } else {
        user = {
          id: '1',
          name: 'John Doe',
          email: email,
          role: 'user',
          createdAt: new Date(),
        };
      }

      login(user);
      navigate('/');
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-indigo-100 p-3">
            <BookOpen className="h-12 w-12 text-indigo-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bem-vindo de volta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Use <span className="font-medium text-indigo-600">jane@example.com</span> para acesso administrativo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Digite seu email"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />

            <Input
              label="Senha"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Digite sua senha"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex justify-center py-3"
              isLoading={isLoading}
            >
              Entrar
            </Button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Não tem uma conta?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                >
                  Criar nova conta
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}