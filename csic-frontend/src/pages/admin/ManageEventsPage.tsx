import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Eye, Edit, MoreHorizontal, Search } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Spinner } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/badge";

export enum EventStatusEnum {
  Draft = 0,
  Published = 1,
  Cancelled = 2,
  Completed = 3,
}

export enum BookingStatusEnum {
  Confirmed = 0,
  Cancelled = 1,
  Attended = 2,
  NoShow = 3,
}

// Defining the interface for Event type
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  location: string;
  status: EventStatusEnum;
  currentBookings: number;
  createdAt: string;
  createdById: string;
  availableSpots: number;
  imageUrl?: string;
  category?: string;
}

// Defining the interface for User type
export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string;
}

// Defining the interface for EventBooking type
export interface EventBooking {
  id: string;
  eventId: string;
  userId: string;
  status: BookingStatusEnum;
  bookedAt: string;
  cancelledAt?: string;
  user?: User;
  event?: Event;
}

import api from "../../services/api";

const adminEventsApi = {
  publishEvent: async (eventId: string): Promise<any> => {
    return await api.put(`/events/${eventId}/status`, {
      id: eventId,
      status: EventStatusEnum.Published,
    });
  },
  cancelEvent: async (eventId: string): Promise<any> => {
    return await api.put(`/events/${eventId}/status`, {
      id: eventId,
      status: EventStatusEnum.Cancelled,
    });
  },
  completeEvent: async (eventId: string): Promise<any> => {
    return await api.put(`/events/${eventId}/status`, {
      id: eventId,
      status: EventStatusEnum.Completed,
    });
  },
  deleteEvent: async (eventId: string): Promise<any> => {
    return await api.put(`/events/${eventId}/status`, {
      id: eventId,
      status: EventStatusEnum.Cancelled,
    });
  },
  getEventAttendees: async (eventId: string): Promise<EventBooking[]> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data.bookings || [];
  },
  updateAttendance: async (
    bookingId: string,
    attended: boolean
  ): Promise<any> => {
    return await api.put(`/eventbookings/${bookingId}/attendance`, {
      bookingId: bookingId,
      attended: attended,
    });
  },
  cancelBooking: async (bookingId: string): Promise<any> => {
    return await api.put(`/eventbookings/${bookingId}/cancel`);
  },
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && (
          <div className="p-4 border-t flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
};

interface EventStatusBadgeProps {
  status: EventStatusEnum;
}

const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ status }) => {
  const getStatusString = (): string => {
    switch (status) {
      case EventStatusEnum.Draft:
        return "Draft";
      case EventStatusEnum.Published:
        return "Published";
      case EventStatusEnum.Cancelled:
        return "Cancelled";
      case EventStatusEnum.Completed:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (): string => {
    switch (status) {
      case EventStatusEnum.Draft:
        return "bg-gray-100 text-gray-800";
      case EventStatusEnum.Published:
        return "bg-green-100 text-green-800";
      case EventStatusEnum.Cancelled:
        return "bg-red-100 text-red-800";
      case EventStatusEnum.Completed:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return <Badge className={getStatusClass()}>{getStatusString()}</Badge>;
};

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <EventStatusBadge status={event.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p>{event.location}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Dates</h3>
            <p>
              Start: {new Date(event.startDate).toLocaleString()}
              <br />
              End: {new Date(event.endDate).toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Capacity</h3>
            <p>
              {event.currentBookings} / {event.capacity} ({event.availableSpots}{" "}
              available)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AttendeeListProps {
  eventId: string;
}

const AttendeeList: React.FC<AttendeeListProps> = ({ eventId }) => {
  const queryClient = useQueryClient();
  const {
    data: attendees,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["eventAttendees", eventId],
    queryFn: () => adminEventsApi.getEventAttendees(eventId),
  });

  const markAttendanceMutation = useMutation({
    mutationFn: ({
      bookingId,
      attended,
    }: {
      bookingId: string;
      attended: boolean;
    }) => adminEventsApi.updateAttendance(bookingId, attended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventAttendees", eventId] });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => adminEventsApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventAttendees", eventId] });
    },
  });

  const handleMarkAttendance = (bookingId: string, attended: boolean): void => {
    markAttendanceMutation.mutate({ bookingId, attended });
  };

  const handleCancelBooking = (bookingId: string): void => {
    cancelBookingMutation.mutate(bookingId);
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert>
        <AlertDescription>Failed to load attendees</AlertDescription>
      </Alert>
    );
  }

  if (!attendees || attendees.length === 0) {
    return <p className="text-center py-4">No bookings for this event yet.</p>;
  }

  const getStatusText = (status: BookingStatusEnum): string => {
    switch (status) {
      case BookingStatusEnum.Confirmed:
        return "Confirmed";
      case BookingStatusEnum.Cancelled:
        return "Cancelled";
      case BookingStatusEnum.Attended:
        return "Attended";
      case BookingStatusEnum.NoShow:
        return "No-Show";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status: BookingStatusEnum): string => {
    switch (status) {
      case BookingStatusEnum.Confirmed:
        return "bg-blue-100 text-blue-800";
      case BookingStatusEnum.Cancelled:
        return "bg-red-100 text-red-800";
      case BookingStatusEnum.Attended:
        return "bg-green-100 text-green-800";
      case BookingStatusEnum.NoShow:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booked At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attendees.map((attendee: EventBooking) => (
            <tr key={attendee.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {attendee.user?.fullName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {attendee.user?.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                    attendee.status
                  )}`}
                >
                  {getStatusText(attendee.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(attendee.bookedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="space-x-2">
                  {attendee.status === BookingStatusEnum.Confirmed && (
                    <>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleMarkAttendance(attendee.id, true)}
                        disabled={markAttendanceMutation.isPending}
                      >
                        Mark Attended
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-900"
                        onClick={() => handleMarkAttendance(attendee.id, false)}
                        disabled={markAttendanceMutation.isPending}
                      >
                        Mark No-Show
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleCancelBooking(attendee.id)}
                        disabled={cancelBookingMutation.isPending}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ActionDropdownProps {
  event: Event;
  onPublish: (id: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (event: Event) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  event,
  onPublish,
  onCancel,
  onComplete,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleAction =
    (action: Function, param: any) =>
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      action(param);
      setIsOpen(false);
    };

  useEffect(() => {
    if (isOpen) {
      const closeDropdown = (): void => setIsOpen(false);
      document.addEventListener("click", closeDropdown);
      return () => document.removeEventListener("click", closeDropdown);
    }
  }, [isOpen]);

  return (
    <div
      className="relative"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <button
        className="text-gray-600 hover:text-gray-900"
        onClick={handleToggle}
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link
            to={`/events/${event.id}/edit`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit Event
          </Link>

          {event.status === EventStatusEnum.Draft && (
            <button
              onClick={handleAction(onPublish, event.id)}
              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
            >
              Publish Event
            </button>
          )}

          {event.status === EventStatusEnum.Published && (
            <>
              <button
                onClick={handleAction(onCancel, event.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cancel Event
              </button>
              <button
                onClick={handleAction(onComplete, event.id)}
                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              >
                Mark as Completed
              </button>
            </>
          )}

          {(event.status === EventStatusEnum.Draft ||
            event.status === EventStatusEnum.Cancelled) && (
            <button
              onClick={handleAction(onDelete, event)}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete Event
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface UsersIconProps {
  className?: string;
}

const Users: React.FC<UsersIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const ManageEventsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const [detailsMode, setDetailsMode] = useState<"details" | "attendees">(
    "details"
  );

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      return data.map((event: any) => ({
        ...event,
        availableSpots: event.capacity - event.currentBookings,
      }));
    },
  });

  const publishEventMutation = useMutation({
    mutationFn: adminEventsApi.publishEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const cancelEventMutation = useMutation({
    mutationFn: adminEventsApi.cancelEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const completeEventMutation = useMutation({
    mutationFn: adminEventsApi.completeEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: adminEventsApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      setDeleteDialogOpen(false);
    },
  });

  const filteredEvents = events.filter((event: Event) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "draft" && event.status === EventStatusEnum.Draft) ||
      (activeTab === "published" &&
        event.status === EventStatusEnum.Published) ||
      (activeTab === "cancelled" &&
        event.status === EventStatusEnum.Cancelled) ||
      (activeTab === "completed" && event.status === EventStatusEnum.Completed);

    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handlePublishEvent = (eventId: string): void => {
    publishEventMutation.mutate(eventId);
  };

  const handleCancelEvent = (eventId: string): void => {
    cancelEventMutation.mutate(eventId);
  };

  const handleCompleteEvent = (eventId: string): void => {
    completeEventMutation.mutate(eventId);
  };

  const handleOpenDeleteDialog = (event: Event): void => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEvent = (): void => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  };

  const openEventDetails = (
    event: Event,
    mode: "details" | "attendees" = "details"
  ): void => {
    setSelectedEvent(event);
    setDetailsMode(mode);
    setDetailsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Failed to load events. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Manage Events</h1>
        <Link to="/events/create">
          <Button>Create New Event</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "draft"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("draft")}
            >
              Draft
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "published"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("published")}
            >
              Published
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "cancelled"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === "completed"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr className="bg-white border-b">
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No events found
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event: Event) => (
                  <tr
                    key={event.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-4">
                      <EventStatusBadge status={event.status} />
                    </td>
                    <td className="px-6 py-4">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{event.location}</td>
                    <td className="px-6 py-4">
                      {event.currentBookings} / {event.capacity}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEventDetails(event, "details")}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEventDetails(event, "attendees")}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Users className="h-5 w-5" />
                        </button>
                        <ActionDropdown
                          event={event}
                          onPublish={handlePublishEvent}
                          onCancel={handleCancelEvent}
                          onComplete={handleCompleteEvent}
                          onDelete={handleOpenDeleteDialog}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Confirm Cancellation"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              No, Keep Event
            </Button>
            <Button
              onClick={handleDeleteEvent}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteEventMutation.isPending}
            >
              {deleteEventMutation.isPending
                ? "Processing..."
                : "Yes, Cancel Event"}
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to cancel the event "{selectedEvent?.title}"?
          This action cannot be undone.
        </p>
      </Modal>

      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedEvent?.title || "Event Details"}
        footer={
          <Button onClick={() => setDetailsModalOpen(false)}>Close</Button>
        }
      >
        {selectedEvent && (
          <div>
            <div className="mb-4 border-b pb-2">
              <div className="flex space-x-4">
                <button
                  className={`py-2 px-4 ${
                    detailsMode === "details"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setDetailsMode("details")}
                >
                  Details
                </button>
                <button
                  className={`py-2 px-4 ${
                    detailsMode === "attendees"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setDetailsMode("attendees")}
                >
                  Attendees
                </button>
              </div>
            </div>

            {detailsMode === "details" ? (
              <EventDetails event={selectedEvent} />
            ) : (
              <AttendeeList eventId={selectedEvent.id} />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageEventsPage;
