import React, { useState } from 'react';
import { User, Edit, Trash2, Search, UserPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User as UserType } from '../../types';
import { UserModal } from '../../components/admin/UserModal';
import { Modal } from '../../components/ui/Modal';

// Mock data - replace with actual API call
const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    createdAt: new Date('2024-02-20'),
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSubmit = async (userData: Partial<UserType>) => {
    // Simulated API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('User data:', userData);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    // Simulated API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Deleting user:', userToDelete.id);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage user accounts and permissions
          </p>
        </div>
        <Button
          onClick={() => setIsAddingUser(true)}
          className="mt-4 sm:mt-0"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 ml-4 inline-flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        isOpen={isAddingUser || !!selectedUser}
        onClose={() => {
          setIsAddingUser(false);
          setSelectedUser(null);
        }}
        user={selectedUser || undefined}
        onSubmit={handleUserSubmit}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleDeleteUser}
              className="w-full sm:w-auto sm:ml-3"
              variant="outline"
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
              }}
              className="mt-3 w-full sm:w-auto sm:mt-0"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}