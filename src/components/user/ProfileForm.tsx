```tsx
import { useState } from 'react';
import { User } from '../../types';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, User as UserIcon } from 'lucide-react';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { isLoading, error } = useAuthStore();
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    try {
      // Simulated API call - replace with actual update
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
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
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        icon={<UserIcon className="h-5 w-5 text-gray-400" />}
        required
      />

      <Input
        label="Email address"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        required
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
```