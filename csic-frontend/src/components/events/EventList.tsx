import React from "react";
import { useEvents } from "../../hooks/useEvents";
import { EventCard } from "./EventCard";
import { Spinner } from "../ui/Spinner";
import { Link } from "react-router-dom";

export const EventList: React.FC = () => {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading events</div>;

  // Filter out events with "Draft" status
  const publishedEvents =
    events?.filter((event) => event.status !== "Draft") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {publishedEvents.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`}>
          <EventCard key={event.id} event={event} />
        </Link>
      ))}
    </div>
  );
};
