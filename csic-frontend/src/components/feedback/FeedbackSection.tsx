import React, { useState } from "react";
import { useFeedback } from "../../hooks/useFeedback";
import { FeedbackForm } from "./FeedbackForm";
import { FeedbackList } from "./FeedbackList";
import { EventFeedback } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Spinner } from "../ui/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeedbackSectionProps {
  eventId: string;
  hasUserBooked: boolean;
  isPastEvent: boolean;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  eventId,
  hasUserBooked,
  isPastEvent,
}) => {
  const { user } = useAuth();
  const {
    feedback,
    isLoading,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    isSubmitting,
    isUpdating,
    isDeleting,
  } = useFeedback(eventId);

  const [editingFeedback, setEditingFeedback] = useState<EventFeedback | null>(
    null
  );

  const handleSubmit = async (data: { rating: number; comment: string }) => {
    if (editingFeedback) {
      await updateFeedback({
        id: editingFeedback.id,
        ...data,
      });
      setEditingFeedback(null);
    } else {
      await createFeedback({
        eventId,
        ...data,
      });
    }
  };

  const handleEdit = (feedback: EventFeedback) => {
    setEditingFeedback(feedback);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (feedbackId: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await deleteFeedback(feedbackId);
    }
  };

  const handleCancelEdit = () => {
    setEditingFeedback(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const userFeedback = feedback?.find((f) => f.userId === user?.id);
  const canLeaveFeedback =
    hasUserBooked && isPastEvent && (!userFeedback || editingFeedback);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feedback</h2>
        {userFeedback && !editingFeedback && hasUserBooked && isPastEvent && (
          <button
            onClick={() => handleEdit(userFeedback)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit Your Feedback
          </button>
        )}
      </div>

      {!hasUserBooked && (
        <Alert>
          <AlertDescription>
            You need to attend this event to leave feedback
          </AlertDescription>
        </Alert>
      )}

      {hasUserBooked && !isPastEvent && (
        <Alert>
          <AlertDescription>
            You will be able to leave feedback here after you have attended the
            event
          </AlertDescription>
        </Alert>
      )}

      {canLeaveFeedback && (
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingFeedback ? "Edit Your Feedback" : "Leave Feedback"}
            </h3>
            {editingFeedback && (
              <button
                onClick={handleCancelEdit}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel Edit
              </button>
            )}
          </div>
          <FeedbackForm
            eventId={eventId}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || isUpdating}
            initialRating={editingFeedback?.rating}
            initialComment={editingFeedback?.comment}
            buttonText={editingFeedback ? "Update Feedback" : "Submit Feedback"}
          />
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          All Feedback {feedback?.length ? `(${feedback.length})` : ""}
        </h3>
        <FeedbackList
          feedback={feedback || []}
          onEdit={hasUserBooked && isPastEvent ? handleEdit : undefined}
          onDelete={hasUserBooked && isPastEvent ? handleDelete : undefined}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default FeedbackSection;
