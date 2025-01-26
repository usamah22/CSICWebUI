import React from "react";
import { useEventFeedback } from "../../hooks/useFeedback";
import { Spinner } from "../ui/Spinner";
import { StarRating } from "../ui/StarRating";
import { formatRelativeTime } from "../../utils/format";

interface FeedbackListProps {
  eventId: string;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ eventId }) => {
  const { data: feedback, isLoading } = useEventFeedback(eventId);

  if (isLoading) return <Spinner />;

  if (!feedback?.length) {
    return <p className="text-gray-500">No feedback yet</p>;
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{item.userFullName}</span>
              <StarRating value={item.rating} readOnly />
            </div>
            <span className="text-sm text-gray-500">
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>
          <p className="mt-2 text-gray-700">{item.comment}</p>
        </div>
      ))}
    </div>
  );
};
