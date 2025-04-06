import React from "react";
import { useMyFeedback } from "../hooks/useFeedback";
import { Spinner } from "../components/ui/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { StarIcon, PencilIcon, TrashIcon, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const FeedbackPage = () => {
  const { feedback, isLoading, error, deleteFeedback } = useMyFeedback();
  const navigate = useNavigate();

  const handleEditFeedback = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(feedbackId);
        toast.success("Feedback deleted successfully");
      } catch (error) {
        toast.error("Failed to delete feedback");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load feedback</AlertDescription>
      </Alert>
    );
  }

  if (!feedback?.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          No Feedback Yet
        </h2>
        <p className="mt-2 text-gray-600">
          You haven't provided any feedback yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Feedback</h1>
        <p className="mt-4 text-lg text-gray-600">Manage your event feedback</p>
      </div>

      <div className="grid gap-6">
        {feedback.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => navigate(`/events/${item.eventId}`)}
                >
                  {item.eventTitle}
                </h3>
                <div className="flex items-center mt-2 text-gray-500 text-sm">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{format(new Date(item.createdAt), "PPP")}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditFeedback(item.eventId)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Edit feedback"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteFeedback(item.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Delete feedback"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex mt-3">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-5 w-5 ${
                    index < item.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {item.comment && (
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                {item.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
