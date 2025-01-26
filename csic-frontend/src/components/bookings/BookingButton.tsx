import React from "react";
import { useCreateBooking } from "../../hooks/useBookings";
import { Event } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

interface BookingButtonProps {
  event: Event;
}

export const BookingButton: React.FC<BookingButtonProps> = ({ event }) => {
  const { isAuthenticated } = useAuth();
  const createBooking = useCreateBooking();

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#880090] hover:bg-[#b05eb3]"
      >
        Sign in to Book
      </Link>
    );
  }

  const handleBooking = async () => {
    try {
      await createBooking.mutateAsync({ eventId: event.id });
      toast.success("Event booked successfully!");
    } catch (error) {
      toast.error("Failed to book event");
    }
  };

  const isFullyBooked = event.currentBookings >= event.capacity;
  const isBookable = event.status === "Published" && !isFullyBooked;

  return (
    <button
      onClick={handleBooking}
      disabled={!isBookable || createBooking.isPending}
      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
    >
      {createBooking.isPending
        ? "Booking..."
        : isFullyBooked
        ? "Fully Booked"
        : "Book Event"}
    </button>
  );
};
