import React, { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const AdminPanelPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Manage Events", path: "/admin/events" },
    { label: "Manage Users", path: "/admin/users" },
    { label: "Contact Messages", path: "/admin/messages" },
  ];

  // Redirect to /admin/events if we're exactly at /admin
  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/events", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={`cursor-pointer p-3 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanelPage;