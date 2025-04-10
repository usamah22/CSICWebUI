import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const AdminPanelPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Show dashboard cards only on base /admin route
  const isDashboardHome = location.pathname === "/admin";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
      <p className="mt-4 text-lg text-gray-600">
        Manage the platform's content and settings.
      </p>

      {isDashboardHome && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Manage Users */}
          <div
            className="cursor-pointer border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/users")}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
            <p className="mt-2 text-gray-600">
              View, edit, and delete user accounts.
            </p>
          </div>

          {/* Manage Events */}
          <div
            className="cursor-pointer border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/events")}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Manage Events</h2>
            <p className="mt-2 text-gray-600">
              Create, approve, and cancel event listings.
            </p>
          </div>

          {/* View Feedback */}
          <div
            className="cursor-pointer border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/feedback")}
          >
            <h2 className="text-2xl font-semibold text-gray-800">View Feedback</h2>
            <p className="mt-2 text-gray-600">
              Respond to and manage event feedback.
            </p>
          </div>

          {/* Manage Contact Messages */}
          <div
            className="cursor-pointer border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/messages")}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Contact Messages</h2>
            <p className="mt-2 text-gray-600">
              View all submitted contact messages with sender emails.
            </p>
          </div>
        </div>
      )}

      {/* Render nested admin routes here */}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanelPage;
