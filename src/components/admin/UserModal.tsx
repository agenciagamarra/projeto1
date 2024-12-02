import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User } from '../../types';
import { validateUser, ValidationError, getFieldError } from '../../lib/validation';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (userData: Partial<User>) => Promise<void>;
}

export function UserModal({ isOpen, onClose, user, onSubmit }: UserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'admin' | 'user',
    };

    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit(userData);
      onClose();
    } catch (err) {
      setErrors([{ field: 'submit', message: 'Failed to save user' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitError = getFieldError(errors, 'submit');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add User'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
            {submitError}
          </div>
        )}

        <Input
          label="Full name"
          name="name"
          defaultValue={user?.name}
          error={getFieldError(errors, 'name')}
          required
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          defaultValue={user?.email}
          error={getFieldError(errors, 'email')}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            defaultValue={user?.role || 'user'}
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              getFieldError(errors, 'role')
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {getFieldError(errors, 'role') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'role')}</p>
          )}
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full sm:w-auto sm:ml-3"
          >
            {user ? 'Save Changes' : 'Add User'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mt-3 w-full sm:w-auto sm:mt-0"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}