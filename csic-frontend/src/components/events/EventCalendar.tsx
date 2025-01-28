import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import { eventsApi } from "../../services/api";
import { Event } from "../../types";

const locales = {
  "en-GB": enGB,
};

// Initialize the localizer for react-big-calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch events when the component mounts
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventsApi.getEvents();
        setEvents(fetchedEvents);

        // Transform events into a format suitable for react-big-calendar
        const transformedEvents = fetchedEvents.map((event) => ({
          id: event.id, // Include the event ID for navigation
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          status: event.status, // Include the status for styling
        }));
        setCalendarEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Handle event click
  const handleEventClick = (event: any) => {
    navigate(`/events/${event.id}`); // Navigate to the event detail page
  };

  // Function to dynamically assign styles based on event status
  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3174ad"; // Default color

    switch (event.status) {
      case "Draft":
        backgroundColor = "#ff9800"; // Orange
        break;
      case "Published":
        backgroundColor = "#4caf50"; // Green
        break;
      case "Cancelled":
        backgroundColor = "#f44336"; // Red
        break;
      case "Completed":
        backgroundColor = "#2196f3"; // Blue
        break;
      default:
        backgroundColor = "#9e9e9e"; // Gray
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        color: "white",
        border: "none",
      },
    };
  };

  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        style={{ height: 500, border: "1px solid #ddd", borderRadius: "8px" }}
        onSelectEvent={handleEventClick}
        eventPropGetter={eventStyleGetter} // Apply custom styles
      />
    </div>
  );
};

export default EventCalendar;
