import React from "react";
import { StarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import { EventFeedback } from "../../types";

interface FeedbackListProps {
  feedback: EventFeedback[];
  onEdit?: (feedback: EventFeedback) => void;
  onDelete?: (feedbackId: string) => void;
  isDeleting?: boolean;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({
  feedback,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const { user } = useAuth();

  if (feedback.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No feedback yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {item.userFullName}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">
                  {format(new Date(item.createdAt), "PPP")}
                </span>
              </div>

              <div className="flex mt-1">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`w-5 h-5 ${
                      index < item.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {user?.id === item.userId && (
              <div className="flex space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            )}
          </div>

          {item.comment && (
            <p className="mt-4 text-gray-600 whitespace-pre-wrap">
              {item.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
