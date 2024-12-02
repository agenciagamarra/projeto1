```tsx
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lock } from 'lucide-react';

export function SecurityForm() {
  const { isLoading, error } = useAuthStore();
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      // Handle through store error state
      return;
    }

    try {
      // Simulated API call - replace with actual update
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
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
        label="Current password"
        type="password"
        value={formData.currentPassword}
        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        required
      />

      <Input
        label="New password"
        type="password"
        value={formData.newPassword}
        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        required
      />

      <Input
        label="Confirm new password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        required
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Update Password
        </Button>
      </div>
    </form>
  );
}
```