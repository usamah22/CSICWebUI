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
  imageUrl?: string; 
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

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string; // Added lastName property
  fullName?: string;
  role?: "Student" | "Staff" | "Professional" | "Admin";
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

export interface EventFeedback {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userFullName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateFeedbackRequest {
  eventId: string;
  rating: number;
  comment: string;
}

export interface UpdateFeedbackRequest {
  id: string;
  rating: number;
  comment: string;
}

// Contact Message Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface CreateContactMessageRequest {
  name: string;
  email: string;
  message: string;
}
