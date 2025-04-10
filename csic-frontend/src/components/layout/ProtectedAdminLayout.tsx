// src/components/layout/ProtectedAdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import AdminPanelPage from "../../pages/AdminPanelPage";

const ProtectedAdminLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPanelPage>
        {/* Render child routes inside the AdminPanelPage layout */}
        <Outlet />
      </AdminPanelPage>
    </ProtectedRoute>
  );
};

export default ProtectedAdminLayout;
