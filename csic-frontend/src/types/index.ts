export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  location: string;
  status: string;
  currentBookings: number;
  createdAt: string;
  createdById: string;
  availableSpots: number;
  imageUrl?: string; // todo: add imageUrl to Event type
  category?: string;
}
export type EventStatus = "Draft" | "Published" | "Cancelled" | "Completed";

export interface EventDetail extends Event {
  createdBy: {
    id: string;
    email: string;
    fullName: string;
  };
  bookings: EventBooking[];
  feedback: EventFeedback[];
}

export interface EventBooking {
  id: string;
  eventId: string;
  userId: string;
  status: BookingStatus;
  bookedAt: string;
  cancelledAt?: string;
  user?: User;
  event: Event;
}

export type BookingStatus = "Confirmed" | "Cancelled" | "Attended" | "NoShow";

export interface EventFeedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string; // JWT token for authentication
  userId: string; // Unique identifier for the user
  email: string; // User's email address
  username?: string; // Optional username
  expiresAt?: number; // Optional token expiration timestamp
}
