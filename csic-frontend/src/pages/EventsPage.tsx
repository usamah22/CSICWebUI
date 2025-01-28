import React from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { EventCard } from "../components/events/EventCard";
import { Spinner } from "../components/ui/Spinner";

const EventsPage: React.FC = () => {
  const { data: events, isLoading } = useEvents();

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <Link key={event.id} to={`/events/${event.id}`}>
            <EventCard event={event} />
          </Link>
        ))}
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
