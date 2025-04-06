import React, { useState } from "react";
import { StarIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeedbackFormProps {
  eventId: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  isSubmitting: boolean;
  initialRating?: number;
  initialComment?: string;
  buttonText?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  eventId,
  onSubmit,
  isSubmitting,
  initialRating = 0,
  initialComment = "",
  buttonText = "Submit Feedback",
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      await onSubmit({ rating, comment });
      if (!initialRating) {
        // Only reset if it's a new feedback
        setRating(0);
        setComment("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`w-6 h-6 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Comment
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Share your thoughts about the event..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#880090] hover:bg-[#7a0082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : buttonText}
      </button>
    </form>
  );
};
