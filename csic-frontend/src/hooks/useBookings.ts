import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../services/api";
import { EventBooking } from "../types";

export const useBookings = () => {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery<EventBooking[]>({
    queryKey: ["bookings", "my"],
    queryFn: () => eventsApi.getMyBookings(),
  });

  const createBookingMutation = useMutation({
    mutationFn: (eventId: string) => eventsApi.createBooking(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "my"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => eventsApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "my"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // Helper functions for cleaner component code
  const createBooking = async (eventId: string) => {
    await createBookingMutation.mutateAsync(eventId);
  };

  const cancelBooking = async (bookingId: string) => {
    await cancelBookingMutation.mutateAsync(bookingId);
  };

  return {
    // Query state
    bookings: bookingsQuery.data,
    isLoadingBookings: bookingsQuery.isLoading,
    bookingsError: bookingsQuery.error,

    // Create booking
    createBooking,
    isCreatingBooking: createBookingMutation.isPending,
    createBookingError: createBookingMutation.error,

    // Cancel booking
    cancelBooking,
    isCancellingBooking: cancelBookingMutation.isPending,
    cancelBookingError: cancelBookingMutation.error,

    // Raw mutations if needed
    createBookingMutation,
    cancelBookingMutation,

    // Raw query if needed
    bookingsQuery,
  };
};
