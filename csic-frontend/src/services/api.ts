import axios from "axios";
import {
  AuthResponse,
  BookingStatus,
  Event,
  EventBooking,
  EventDetail,
  EventStatus,
  LoginRequest,
} from "../types";

import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: "https://localhost:7086/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request headers:", config.headers);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Received successful response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Request failed:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
);

interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  location: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },
};

const mapEventStatus = (status: any): EventStatus => {
  switch (status) {
    case "Draft":
    case "Published":
    case "Cancelled":
    case "Completed":
      return status as EventStatus;
    case 0:
      return "Draft";
    case 1:
      return "Published";
    case 2:
      return "Cancelled";
    case 3:
      return "Completed";
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

const mapBookingStatus = (status: any): BookingStatus => {
  switch (status) {
    case "Draft":
    case "Published":
    case "Cancelled":
    case "Completed":
      return status as BookingStatus;
    case 0:
      return "Confirmed";
    case 1:
      return "Cancelled";
    case 2:
      return "Attended";
    case 3:
      return "NoShow";
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

const transformEvent = (event: any): Event => ({
  ...event,
  status: mapEventStatus(event.status),
  availableSpots: event.capacity - event.currentBookings,
  imageUrl: event.imageUrl || undefined,
});

const transformBooking = (booking: any): EventBooking => ({
  ...booking,
  status: mapBookingStatus(booking.status),
  bookedAt: new Date(booking.bookedAt).toISOString(),
  cancelledAt: booking.cancelledAt
    ? new Date(booking.cancelledAt).toISOString()
    : undefined,
  user: booking.user || undefined,
  event: transformEvent(booking.event),
});

export const eventsApi = {
  createEvent: async (eventData: CreateEventRequest): Promise<string> => {
    try {
      console.log("Sending event data:", JSON.stringify(eventData, null, 2));
      const response = await api.post<string>("/events", {
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate, // Already ISO string
        endDate: eventData.endDate, // Already ISO string
        capacity: eventData.capacity,
        location: eventData.location,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Request that caused the error:", error.config);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }
      throw error;
    }
  },

  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get("/events");
      return response.data.map(transformEvent);
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  getEvent: async (id: string): Promise<EventDetail> => {
    try {
      const response = await api.get(`/events/${id}`);
      return {
        ...transformEvent(response.data),
        createdBy: response.data.createdBy,
        bookings: response.data.bookings || [],
        feedback: response.data.feedback || [],
      };
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  createBooking: async (eventId: string): Promise<string> => {
    try {
      const response = await api.post<string>(`/events/${eventId}/bookings`, {
        eventId,
      });

      toast.success("Booking created successfully!");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to create booking";
        throw new Error(message);
      }
      throw error;
    }
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    try {
      await api.put(`/eventbookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to cancel booking";
        throw new Error(message);
      }
      throw error;
    }
  },

  getMyBookings: async (): Promise<EventBooking[]> => {
    try {
      const response = await api.get<EventBooking[]>("/eventbookings/my");
      return response.data.map(transformBooking); // Apply transformBooking to each booking
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },
};

interface EventBookingDto {
  id: string;
  eventId: string;
  userId: string;
  status: "Confirmed" | "Cancelled" | "Attended" | "NoShow";
  bookedAt: string;
  cancelledAt?: string;
}

export default api;
