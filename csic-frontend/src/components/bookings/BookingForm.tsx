import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingFormProps {
  eventId: string;
  availableSpots: number;
  onBookingComplete: (booking: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  eventId,
  availableSpots,
  onBookingComplete,
}) => {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/events/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          eventId,
          numberOfTickets,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const booking = await response.json();
      onBookingComplete(booking);
      navigate("/my-bookings");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="tickets"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Tickets
          </label>
          <select
            id="tickets"
            value={numberOfTickets}
            onChange={(e) => setNumberOfTickets(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {[...Array(Math.min(availableSpots, 5))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {availableSpots} spots remaining
          </span>
          <button
            type="submit"
            disabled={isSubmitting || availableSpots === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Booking..." : "Book Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
