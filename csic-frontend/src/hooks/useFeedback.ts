import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi } from "../services/api";
import { toast } from "react-hot-toast";

export const useFeedback = (eventId: string) => {
  const queryClient = useQueryClient();

  const { data: feedback, isLoading } = useQuery({
    queryKey: ["feedback", eventId],
    queryFn: () => feedbackApi.getEventFeedback(eventId),
  });

  const createFeedbackMutation = useMutation({
    mutationFn: feedbackApi.createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", eventId] });
      toast.success("Feedback submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: feedbackApi.updateFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", eventId] });
      toast.success("Feedback updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update feedback");
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: feedbackApi.deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", eventId] });
      toast.success("Feedback deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete feedback");
    },
  });

  return {
    feedback,
    isLoading,
    createFeedback: createFeedbackMutation.mutateAsync,
    updateFeedback: updateFeedbackMutation.mutateAsync,
    deleteFeedback: deleteFeedbackMutation.mutateAsync,
    isSubmitting: createFeedbackMutation.isPending,
    isUpdating: updateFeedbackMutation.isPending,
    isDeleting: deleteFeedbackMutation.isPending,
  };
};

export const useMyFeedback = () => {
  const queryClient = useQueryClient();

  const {
    data: feedback,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feedback", "my"],
    queryFn: () => feedbackApi.getMyFeedback(),
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: feedbackApi.deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "my"] });
      toast.success("Feedback deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete feedback");
    },
  });

  return {
    feedback,
    isLoading,
    error,
    deleteFeedback: deleteFeedbackMutation.mutateAsync,
    isDeleting: deleteFeedbackMutation.isPending,
  };
};
