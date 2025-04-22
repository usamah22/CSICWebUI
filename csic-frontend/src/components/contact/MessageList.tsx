import React from "react";
import { ContactMessage } from "../../types";
import { format } from "date-fns";

interface MessageListProps {
  messages: ContactMessage[];
  onMarkAsRead: (id: string) => Promise<boolean>;
  loading: boolean;
  onViewMessage?: (message: ContactMessage) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMarkAsRead,
  loading,
  onViewMessage,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No messages found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Message
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {messages.map((message) => (
            <tr
              key={message.id}
              className={`${
                message.isRead ? "" : "bg-purple-50"
              } hover:bg-gray-50 cursor-pointer`}
              onClick={() => onViewMessage && onViewMessage(message)}
            >
              <td
                className="px-6 py-4 whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                {message.isRead ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Read
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Unread
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {message.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a
                  href={`mailto:${message.email}`}
                  className="text-purple-600 hover:text-purple-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  {message.email}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(message.createdAt), "PPP")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {message.message}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {!message.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(message.id);
                    }}
                    className="text-purple-600 hover:text-purple-900 mr-3"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `mailto:${message.email}?subject=Re: Your Contact Form Message&body=Dear ${message.name},%0D%0A%0D%0AThank you for contacting us regarding:%0D%0A%0D%0A"${message.message}"%0D%0A%0D%0A`
                    );
                  }}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Reply
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageList;
