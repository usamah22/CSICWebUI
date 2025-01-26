import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { Event } from "../types";

export const useEvents = () => {
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data;
    },
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
  return useQuery<Event>({
    queryKey: ["events", id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
  });
};
