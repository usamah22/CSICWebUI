import React from "react";
import { ContactMessage } from "../../types";
import { format } from "date-fns";

interface MessageDetailProps {
  message: ContactMessage | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => Promise<boolean>;
}

const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  onClose,
  onMarkAsRead,
}) => {
  if (!message) return null;

  const handleMarkAsRead = async () => {
    if (!message.isRead) {
      await onMarkAsRead(message.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              Message from {message.name}
              {!message.isRead && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                  Unread
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">From:</span>
              <div className="mt-1">
                <div className="text-sm text-gray-900">{message.name}</div>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-purple-600 hover:text-purple-900"
                >
                  {message.email}
                </a>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Received:
              </span>
              <div className="mt-1 text-sm text-gray-900">
                {format(new Date(message.createdAt), "PPP 'at' h:mm a")}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Message:
              </span>
              <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-900 whitespace-pre-wrap">
                {message.message}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            {!message.isRead && (
              <button
                onClick={handleMarkAsRead}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Mark as Read
              </button>
            )}
            <button
              onClick={() =>
                window.open(
                  `mailto:${message.email}?subject=Re: Your Contact Form Message&body=Dear ${message.name},%0D%0A%0D%0AThank you for contacting us regarding:%0D%0A%0D%0A"${message.message}"%0D%0A%0D%0A`
                )
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Reply by Email
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
