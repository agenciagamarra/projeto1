import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User } from '../types';
import { BookOpen, User as UserIcon, Mail, Lock } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: '1',
        name,
        email,
        role: 'user',
        createdAt: new Date(),
      };

      login(user);
      navigate('/quizzes');
    } catch (err) {
      setError('Falha ao criar conta');
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
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Comece sua jornada de aprendizado hoje
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
              label="Nome completo"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Digite seu nome completo"
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            />

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
              autoComplete="new-password"
              required
              placeholder="Digite sua senha"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />

            <Input
              label="Confirmar senha"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirme sua senha"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />

            <Button
              type="submit"
              className="w-full flex justify-center py-3"
              isLoading={isLoading}
            >
              Criar conta
            </Button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Já tem uma conta?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                >
                  Fazer login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}