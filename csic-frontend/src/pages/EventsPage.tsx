import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { EventCard } from "../components/events/EventCard";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { EventList } from "@/components/events/EventList";
import EventCalendar from "@/components/events/EventCalendar";
import { useAuth } from "../contexts/AuthContext";

const EventsPage: React.FC = () => {
  const { data: events, isLoading } = useEvents();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list"); // Toggle state
  const { user } = useAuth(); // Get the current user from auth context

  // Check if user is not a student (can create events)
  const canCreateEvent = user && user.role !== "Student";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Events</h1>
        <Button
          onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
          variant="outline"
        >
          Switch to {viewMode === "list" ? "Calendar View" : "List View"}
        </Button>
      </div>

      <div className="">
        {viewMode === "list" ? <EventList /> : <EventCalendar />}
      </div>

      {/* Only show the Create Event button if user has permission */}
      {canCreateEvent && (
        <div className="pt-8">
          <Link
            to="/events/create"
            className="inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#880090] hover:bg-[#7a0082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Request New Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
