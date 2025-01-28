import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { eventsApi } from "../services/api";
import { Event } from "../types";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.getEvents,
  });
};

export const useUpcomingEvents = (count = 5) => {
  return useQuery<Event[]>({
    queryKey: ["events", "upcoming", count],
    queryFn: async () => {
      const { data } = await api.get(`/events/upcoming?count=${count}`);
      return data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      const { data } = await api.post(`/events/${eventId}/bookings`, {
        eventId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      try {
        const data = await eventsApi.getEvent(id);
        console.log("Event data received:", data); // Debug log
        return data;
      } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
    },
    enabled: !!id, // Only run the query if we have an ID
  });
};
