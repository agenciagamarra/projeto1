```tsx
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { ProfileForm } from '../../components/user/ProfileForm';
import { SecurityForm } from '../../components/user/SecurityForm';
import { AccountStatus } from '../../components/user/AccountStatus';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function Profile() {
  const { user, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'profile' ? (
              <ProfileForm user={user} />
            ) : (
              <SecurityForm />
            )}
          </div>
        </div>

        <AccountStatus user={user} />
      </div>
    </div>
  );
}
```