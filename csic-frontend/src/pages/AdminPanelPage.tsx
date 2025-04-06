import React from "react";

const AdminPanelPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
      <p className="mt-4 text-lg text-gray-600">
        Manage the platform's content and settings.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
          <p className="mt-2 text-gray-600">View, edit, and delete user accounts.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Events</h2>
          <p className="mt-2 text-gray-600">Create, update, and delete events.</p>
        </div>
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800">View Feedback</h2>
          <p className="mt-2 text-gray-600">Review feedback submitted by users.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;