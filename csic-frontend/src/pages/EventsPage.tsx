import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { EventCard } from "../components/events/EventCard";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { EventList } from "@/components/events/EventList";
import EventCalendar from "@/components/events/EventCalendar";

const EventsPage: React.FC = () => {
  const { data: events, isLoading } = useEvents();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list"); // Toggle state

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
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <Button
          onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
          variant="outline"
        >
          Switch to {viewMode === "list" ? "Calendar View" : "List View"}
        </Button>
      </div>

      <div className="">
        {/* {events?.map((event) => (
          <Link key={event.id} to={`/events/${event.id}`}>
            <EventCard event={event} />
          </Link>
        ))} */}
        {viewMode === "list" ? <EventList /> : <EventCalendar />}
      </div>
      <div className="pt-8">
        <Link
          to="/events/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Event
        </Link>
      </div>
    </div>
  );
};

export default EventsPage;
