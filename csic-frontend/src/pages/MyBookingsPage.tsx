import React from "react";
import { BookingList } from "../components/bookings/BookingList";

const MyBookingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      <BookingList />
    </div>
  );
};

export default MyBookingsPage;
