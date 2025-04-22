import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminPanelPage from "@/pages/AdminPanelPage";

const ProtectedAdminLayout: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("Admin check - User:", user);
  console.log("Admin check - Role:", user?.role);
  console.log("Admin check - Is Admin:", user?.role === "Admin");

  // Check if the user is authenticated and has the Admin role
  if (!isAuthenticated || !user || user.role !== "Admin") {
    console.log("Access denied to admin page - redirecting to home");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminPanelPage />
    </div>
  );
};

export default ProtectedAdminLayout;
