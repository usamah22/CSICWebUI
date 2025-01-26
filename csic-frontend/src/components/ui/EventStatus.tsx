import React from "react";
import { EventStatus as EventStatusType } from "../../types";

interface EventStatusProps {
  status: EventStatusType;
}

export const EventStatus: React.FC<EventStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Completed":
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
