import React from "react";
import { useEvent } from "../../hooks/useEvents";
import { useParams } from "react-router-dom";
import { FeedbackList } from "../feedback/FeedbackList";
import { BookingButton } from "../bookings/BookingButton";
import { Spinner } from "../ui/Spinner";
import { EventStatus } from "../ui/EventStatus";

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id!);

  if (isLoading) return <Spinner />;
  if (!event) return <div>Event not found</div>;

  function formatDateTime(startDate: string): React.ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
        <div className="prose max-w-none mb-6">
          <p>{event.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
            <p className="mt-1">{formatDateTime(event.startDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1">{event.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
            <p className="mt-1">
              {event.currentBookings} / {event.capacity}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <EventStatus status={event.status} />
          </div>
        </div>

        <BookingButton event={event} />

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Feedback</h2>
          <FeedbackList eventId={event.id} />
        </div>
      </div>
    </div>
  );
};
