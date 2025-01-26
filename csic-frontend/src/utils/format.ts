import { format, formatDistanceToNow } from "date-fns";

export const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "PPP p");
};

export const formatRelativeTime = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};
