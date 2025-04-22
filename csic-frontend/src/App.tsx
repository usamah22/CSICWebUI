import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import ProtectedAdminLayout from "./components/layout/ProtectedAdminLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import PartnersPage from "./pages/PartnersPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import LoginPage from "./pages/LoginPage";
import CreateEventForm from "./components/events/CreateEventForm";
import FeedbackPage from "./pages/FeedbackPage";
import ContactPage from "./pages/ContactPage";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage";
import { ManageEventsPage } from "./pages/admin/ManageEventsPage";
import { ManageFeedbackPage } from "./pages/admin/ManageFeedbackPage";
import { ManageMessagesPage } from "./pages/admin/ManageMessagesPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Full-width pages */}
            <Route
              path="/home"
              element={
                <Layout fullWidth>
                  <HomePage />
                </Layout>
              }
            />
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Constrained layout pages */}
            <Route
              path="/events"
              element={
                <Layout>
                  <EventsPage />
                </Layout>
              }
            />
            <Route
              path="/events/create"
              element={
                <Layout>
                  <ProtectedRoute
                    allowedRoles={["Admin", "Staff", "Professional"]}
                  >
                    <CreateEventForm />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/events/:id"
              element={
                <Layout>
                  <EventDetailPage />
                </Layout>
              }
            />
            <Route
              path="/partners"
              element={
                <Layout>
                  <PartnersPage />
                </Layout>
              }
            />
            <Route
              path="/bookings"
              element={
                <Layout>
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/feedback"
              element={
                <Layout>
                  <ProtectedRoute>
                    <FeedbackPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <LoginPage />
                </Layout>
              }
            />

            {/* Admin Section */}
            <Route path="/admin" element={<ProtectedAdminLayout />}>
              <Route path="users" element={<ManageUsersPage />} />
              <Route path="events" element={<ManageEventsPage />} />
              <Route path="feedback" element={<ManageFeedbackPage />} />
              <Route path="messages" element={<ManageMessagesPage />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
