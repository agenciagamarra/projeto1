```tsx
import { User } from '../../types';
import { Shield } from 'lucide-react';

interface AccountStatusProps {
  user: User;
}

export function AccountStatus({ user }: AccountStatusProps) {
  return (
    <div className="px-6 py-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Account Status</h3>
            <p className="mt-1 text-sm text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
```