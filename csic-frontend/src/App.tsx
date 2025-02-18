import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
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
                  <CreateEventForm />
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
              path="/login"
              element={
                <Layout>
                  <LoginPage />
                </Layout>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;