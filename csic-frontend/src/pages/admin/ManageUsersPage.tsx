import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../services/api";
import toast from "react-hot-toast";


enum UserRole {
  Student = 0,
  Staff = 1,
  Professional = 2,
  Admin = 3
}

// Updates the User type to match your database schema
interface UserWithProperCasing extends Omit<User, 'firstName' | 'lastName'> {
  FirstName?: string;
  LastName?: string;
  firstName?: string; 
  lastName?: string;  
}

export const ManageUsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<UserWithProperCasing[]>({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });

  // Debug: Log the users and their roles when data is loaded
  useEffect(() => {
    if (users) {
      console.log("Users loaded:", users);
      users.forEach(user => {
        console.log(`User ${user.email} has role: ${user.role}`);
      });
    }
  }, [users]);

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string | number }) => {
      // Convert numeric role to string if needed
      const roleValue = typeof role === 'number' ? UserRole[role] : role;
      return userApi.updateUserRole(id, roleValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated");
    },
    onError: (error) => {
      console.error("Update role error:", error);
      toast.error("Failed to update role");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
    onError: (error) => {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (formData: { email: string; password: string; FirstName: string; LastName: string; role: string }) => {
      return userApi.createUser(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created");
      setForm({ firstName: "", lastName: "", email: "", password: "", role: UserRole.Student });
    },
    onError: (error) => {
      console.error("Create user error:", error);
      toast.error("Failed to create user");
    },
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: UserRole.Student,
  });

  // Keeps track of user roles while they're being updated
  const [pendingRoleUpdates, setPendingRoleUpdates] = useState<
    Record<string, number | string>
  >({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }
    
    // Using PascalCase to match DB column names exactly
    const userData = {
      FirstName: form.firstName,
      LastName: form.lastName,   
      email: form.email,
      password: form.password,
      role: UserRole[form.role]
    };
    
    createUserMutation.mutate(userData);
  };

  const handleRoleChange = (userId: string, newRole: string | number) => {
    console.log(`Changing role for user ${userId} to ${newRole}`);
    
    // Converts string to number if it's a numeric string
    const roleValue = typeof newRole === 'string' && !isNaN(Number(newRole)) 
      ? Number(newRole) 
      : newRole;
    
    // Updates the pending role state immediately for a responsive UI
    setPendingRoleUpdates((prev) => ({
      ...prev,
      [userId]: roleValue,
    }));

    // Sends the update to the server
    updateRoleMutation.mutate({
      id: userId,
      role: roleValue,
    });
  };

  // Get the current role value to display (either the pending update or the original)
  const getCurrentRoleValue = (user: UserWithProperCasing) => {
    return pendingRoleUpdates[user.id] !== undefined ? pendingRoleUpdates[user.id] : user.role;
  };

  // Format the full name for display - handle both PascalCase and camelCase properties
  const getFullName = (user: UserWithProperCasing) => {
    // Checks for both PascalCase and camelCase properties
    const first = user.FirstName || user.firstName || "";
    const last = user.LastName || user.lastName || "";
    
    if (first && last) {
      return `${first} ${last}`;
    } else if (first) {
      return first;
    } else if (last) {
      return last;
    } else {
      return "-";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">User Management</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Create new user panel */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-700 text-white p-4">
              <h2 className="text-xl font-semibold">Create New User</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {/* First Name field first */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              
              {/* Last Name field second */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
              
              {/* Email field third */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              
              {/* Password field fourth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              
              {/* Role field last */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: Number(e.target.value) })}
                >
                  {Object.entries(UserRole)
                    .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
                    .map(([key, value]) => (
                      <option key={key} value={value}>{key}</option>
                    ))}
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-700 text-white font-medium px-4 py-2 rounded-md hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
        
        {/* User table panel */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-700 text-white p-4">
              <h2 className="text-xl font-semibold">Manage Existing Users</h2>
              <div className="text-xs mt-1 text-white">
                {users ? `${users.length} users loaded` : 'Loading users...'}
              </div>
            </div>
            
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user: UserWithProperCasing) => {
                        const currentRole = getCurrentRoleValue(user);
                        
                        return (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {getFullName(user)}
                            </td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <select
                                value={currentRole}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                disabled={
                                  updateRoleMutation.isPending &&
                                  pendingRoleUpdates[user.id] !== undefined
                                }
                              >
                                {Object.entries(UserRole)
                                  .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
                                  .map(([key, value]) => (
                                    <option key={key} value={value}>{key}</option>
                                  ))}
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete ${user.email}?`)) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                                className="flex items-center text-red-600 hover:text-red-800 transition-colors focus:outline-none"
                                disabled={deleteUserMutation.isPending}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {users?.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-gray-500">
                            No users found. Create your first user from the form on the left.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};