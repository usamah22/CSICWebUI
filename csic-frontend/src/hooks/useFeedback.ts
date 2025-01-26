import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { Feedback } from "../types";

export const useEventFeedback = (eventId: string) => {
  return useQuery<Feedback[]>({
    queryKey: ["feedback", eventId],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventId}/feedback`);
      return data;
    },
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: {
      eventId: string;
      rating: number;
      comment: string;
    }) => {
      const { data } = await api.post(
        `/events/${feedback.eventId}/feedback`,
        feedback
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["feedback", variables.eventId],
      });
    },
  });
};
