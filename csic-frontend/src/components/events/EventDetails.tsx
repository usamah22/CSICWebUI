import React from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BookingButton from "../bookings/BookingButton";

interface EventDetailsProps {
  event: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    capacity: number;
    availableSpots: number;
    imageUrl?: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    category?: string;
  };
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {event.imageUrl && (
        <div className="relative h-64">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className={getStatusColor(event.status)}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>
        </div>
      )}

      <div className="p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          </div>
          {event.category && (
            <Badge variant="outline" className="mb-2">
              {event.category}
            </Badge>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <div>
              <div>{format(new Date(event.startDate), "PPP")}</div>
              <div>{format(new Date(event.startDate), "p")}</div>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-5 h-5 mr-2" />
            <span>
              {format(new Date(event.startDate), "p")} -{" "}
              {format(new Date(event.endDate), "p")}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPinIcon className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <UsersIcon className="w-5 h-5 mr-2" />
            <span>
              {event.availableSpots} spots available of {event.capacity}
            </span>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-2">About this event</h2>
          <div className="text-gray-700 whitespace-pre-wrap">
            {event.description}
          </div>
        </div>
      </div>
    </article>
  );
};
