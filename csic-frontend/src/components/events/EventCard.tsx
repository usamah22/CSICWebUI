import React from "react";
import { Event } from "../../types";
import { format } from "date-fns";
import clsx from "clsx";

interface EventCardProps {
  event: Event;
  onBook?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onBook }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <div className="mt-4 space-y-2">
        <p className="text-sm">
          <span className="font-medium">Date:</span>{" "}
          {format(new Date(event.startDate), "PPP")}
        </p>
        <p className="text-sm">
          <span className="font-medium">Location:</span> {event.location}
        </p>
        <p className="text-sm">
          <span className="font-medium">Capacity:</span> {event.currentBookings}
          /{event.capacity}
        </p>
      </div>
      <div className="mt-4">
        <span
          className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            {
              "bg-green-100 text-green-800": event.status === "Published",
              "bg-yellow-100 text-yellow-800": event.status === "Draft",
              "bg-red-100 text-red-800": event.status === "Cancelled",
              "bg-gray-100 text-gray-800": event.status === "Completed",
            }
          )}
        >
          {event.status}
        </span>
      </div>
      {onBook && event.status === "Published" && (
        <button
          onClick={onBook}
          disabled={event.currentBookings >= event.capacity}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Book Event
        </button>
      )}
    </div>
  );
};
