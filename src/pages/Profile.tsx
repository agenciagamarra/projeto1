import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User } from '../types';

export function Profile() {
  const { user, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    try {
      // Simulated API call - replace with actual profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock updated user data - replace with actual API response
      const updatedUser: User = {
        ...user!,
        name,
        email,
      };

      login(updatedUser);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 rounded-md p-3 text-sm">
                {success}
              </div>
            )}

            <Input
              label="Full name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <Input
                label="Current password"
                name="currentPassword"
                type="password"
              />

              <div className="mt-4">
                <Input
                  label="New password"
                  name="newPassword"
                  type="password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Account Status</h3>
              <p className="mt-1 text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}