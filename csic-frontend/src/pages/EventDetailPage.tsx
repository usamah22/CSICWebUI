import React from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvents";
import { EventDetails } from "../components/events/EventDetails";
import { Spinner } from "../components/ui/Spinner";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EventDetails />
    </div>
  );
};

export default EventDetailPage;
