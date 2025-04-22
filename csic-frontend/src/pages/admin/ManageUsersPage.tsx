import React, { useState } from "react";
import { User } from "../../types"; // Adjust the path to where the User type is defined
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../services/api";
import toast from "react-hot-toast";

export const ManageUsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"], // Explicitly define the query key
    queryFn: userApi.getUsers, // Define the query function
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created");
      setForm({ email: "", password: "", role: "Student" });
    },
    onError: () => toast.error("Failed to create user"),
  });

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Student", // Updated to match backend case
  });

  // Keep track of user roles while they're being updated
  const [pendingRoleUpdates, setPendingRoleUpdates] = useState<
    Record<string, string>
  >({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }
    createUserMutation.mutate(form);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    // Update the pending role state immediately for a responsive UI
    setPendingRoleUpdates((prev) => ({
      ...prev,
      [userId]: newRole,
    }));

    // Send the update to the server
    updateRoleMutation.mutate({
      id: userId,
      role: newRole,
    });
  };

  // Get the current role value to display (either the pending update or the original)
  const getCurrentRoleValue = (user: User) => {
    return pendingRoleUpdates[user.id] || user.role;
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Create new user */}
      <form
        onSubmit={handleCreate}
        className="mb-8 p-4 border rounded-lg bg-white shadow-sm space-y-4 max-w-md"
      >
        <h3 className="text-xl font-semibold">Create New User</h3>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full border rounded px-3 py-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
          <option value="Professional">Professional</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Create User
        </button>
      </form>

      {/* User table */}
      {isLoading ? (
        <div>Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: User) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2 border">
                    {user.fullName ? `${user.fullName}` : "-"}
                  </td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">
                    <select
                      value={getCurrentRoleValue(user)}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                      disabled={
                        updateRoleMutation.isPending &&
                        Boolean(pendingRoleUpdates[user.id])
                      }
                    >
                      <option value="Student">Student</option>
                      <option value="Staff">Staff</option>
                      <option value="Professional">Professional</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => deleteUserMutation.mutate(user.id)}
                      className="text-red-600 hover:underline"
                      disabled={deleteUserMutation.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
