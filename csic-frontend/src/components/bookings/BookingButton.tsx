import React from "react";
import { useBookings } from "../../hooks/useBookings";
import { toast } from "react-hot-toast";

interface BookingButtonProps {
  eventId: string;
  isUserBooked: boolean;
  bookingId?: string;
  isFull: boolean;
  isPast: boolean;
}

const BookingButton = ({
  eventId,
  isUserBooked,
  bookingId,
  isFull,
  isPast,
}: BookingButtonProps) => {
  const {
    createBooking,
    cancelBooking,
    isCreatingBooking,
    isCancellingBooking,
  } = useBookings();

  const handleBooking = async () => {
    try {
      if (isUserBooked && bookingId) {
        await cancelBooking(bookingId);
      } else {
        await createBooking(eventId);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (isPast) {
    return (
      <button
        disabled
        className="w-full px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
      >
        Event has ended
      </button>
    );
  }

  if (isFull && !isUserBooked) {
    return (
      <button
        disabled
        className="w-full px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
      >
        Event is full
      </button>
    );
  }

  return (
    <button
      onClick={handleBooking}
      disabled={isCreatingBooking || isCancellingBooking}
      className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isUserBooked
          ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
          : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isCreatingBooking || isCancellingBooking ? (
        <span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {isUserBooked ? "Cancelling..." : "Booking..."}
        </span>
      ) : (
        <span>{isUserBooked ? "Cancel Booking" : "Book Now"}</span>
      )}
    </button>
  );
};

export default BookingButton;
