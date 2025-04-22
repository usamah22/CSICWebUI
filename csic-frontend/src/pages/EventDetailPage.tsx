import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvents";
import { EventDetails } from "../components/events/EventDetails";
import { Spinner } from "../components/ui/Spinner";
import BookingButton from "../components/bookings/BookingButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EventDetail } from "../types";
import { useAuth } from "../contexts/AuthContext";
import FeedbackSection from "@/components/feedback/FeedbackSection";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError, error } = useEvent(id!);
  const { user } = useAuth();
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingComplete = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load event"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
          <p className="mt-2 text-gray-600">
            The event you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const detailEvent = event as EventDetail;
  const isPastEvent = new Date(event.endDate) < new Date();
  const isEventFull = event.currentBookings >= event.capacity;
  const userBooking = detailEvent.bookings?.find((b) => b.userId === user?.id);
  const hasUserBooked = !!userBooking;

  const eventDetailsProps = {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    capacity: event.capacity,
    status: event.status as "upcoming" | "ongoing" | "completed" | "cancelled",
    availableSpots: event.availableSpots,
    imageUrl: event.imageUrl,
    category: event.category,
    createdById: event.createdById,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventDetails event={eventDetailsProps} />
          <div className="mt-8">
            <FeedbackSection
              eventId={event.id}
              hasUserBooked={hasUserBooked}
              isPastEvent={isPastEvent}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {bookingSuccess && (
              <Alert className="mb-4">
                <AlertDescription>
                  Booking successful! Check your email for confirmation.
                </AlertDescription>
              </Alert>
            )}
            <BookingButton
              eventId={event.id}
              isUserBooked={hasUserBooked}
              bookingId={userBooking?.id}
              isFull={isEventFull}
              isPast={isPastEvent}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
