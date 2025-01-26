import React from "react";
import { BookingStatus as BookingStatusType } from "../../types";

interface BookingStatusProps {
  status: BookingStatusType;
}

export const BookingStatus: React.FC<BookingStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Attended":
        return "bg-blue-100 text-blue-800";
      case "NoShow":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};
