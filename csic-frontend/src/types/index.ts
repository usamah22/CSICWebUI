export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
  location: string;
  status: EventStatus;
  currentBookings: number;
  createdAt: string;
}

export type EventStatus = "Draft" | "Published" | "Cancelled" | "Completed";

export interface EventBooking {
  id: string;
  eventId: string;
  userId: string;
  status: BookingStatus;
  bookedAt: string;
  event: Event;
}

export type BookingStatus = "Confirmed" | "Cancelled" | "Attended" | "NoShow";

export interface Feedback {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userFullName: string;
  rating: number;
  comment: string;
  createdAt: string;
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
