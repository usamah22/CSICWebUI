import React from "react";
import { useBookings } from "../../hooks/useBookings";
import { formatDateTime } from "../../utils/format";
import { BookingStatus } from "../ui/BookingStatus";
import { Spinner } from "../ui/Spinner";
import { toast } from "react-hot-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const BookingList: React.FC = () => {
  const {
    bookings,
    isLoadingBookings,
    cancelBooking,
    isCancellingBooking,
    bookingsError,
  } = useBookings();

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (isLoadingBookings) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  if (bookingsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {bookingsError instanceof Error
            ? bookingsError.message
            : "Failed to load bookings"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't made any bookings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Event
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Location
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {booking.event.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDateTime(booking.event.startDate)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  {booking.event.location}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <BookingStatus status={booking.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {booking.status === "Confirmed" && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={isCancellingBooking}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:underline"
                  >
                    {isCancellingBooking ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
