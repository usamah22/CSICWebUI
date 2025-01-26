import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateFeedback } from "../../hooks/useFeedback";
import { StarRating } from "../ui/StarRating";

const feedbackSchema = Yup.object().shape({
  rating: Yup.number().required("Required").min(1).max(5),
  comment: Yup.string().required("Required").min(10).max(500),
});

interface FeedbackFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  eventId,
  onSuccess,
}) => {
  const createFeedback = useCreateFeedback();

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: "",
    },
    validationSchema: feedbackSchema,
    onSubmit: async (values) => {
      try {
        await createFeedback.mutateAsync({
          eventId,
          ...values,
        });
        onSuccess?.();
        formik.resetForm();
      } catch (error) {
        console.error("Failed to submit feedback:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <StarRating
          value={formik.values.rating}
          onChange={(value) => formik.setFieldValue("rating", value)}
        />
        {formik.touched.rating && formik.errors.rating && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.rating}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          {...formik.getFieldProps("comment")}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.comment && formik.errors.comment && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.comment}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Feedback
      </button>
    </form>
  );
};
