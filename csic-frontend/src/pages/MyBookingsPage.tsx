import React from "react";
import { BookingList } from "../components/bookings/BookingList";

const MyBookingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
      <p className="mt-4 text-lg text-gray-600">Manage your event bookings</p>
      <div className="mt-6">
        <BookingList />
      </div>
    </div>
  );
};

export default MyBookingsPage;
