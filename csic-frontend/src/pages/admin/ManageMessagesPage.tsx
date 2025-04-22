import React, { useEffect, useState } from "react";
import { useContactMessages } from "../../hooks/useContactMessages";
import MessageList from "../../components/contact/MessageList";
import MessageDetail from "../../components/contact/MessageDetail";
import { ContactMessage } from "../../types";
import { Toaster } from "react-hot-toast";

export const ManageMessagesPage: React.FC = () => {
  const { messages, loading, error, fetchMessages, markAsRead } =
    useContactMessages();
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages(filterUnread);
  }, [fetchMessages, filterUnread]);

  useEffect(() => {
    if (messages) {
      setUnreadCount(messages.filter((m) => !m.isRead).length);
    }
  }, [messages]);

  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id);
    if (success && selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, isRead: true } : null));
    }
    return success;
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="mt-2 text-gray-600">
            Manage and respond to messages from users
          </p>
        </div>
        <div className="flex space-x-4 items-center">
          <div className="bg-white rounded-md shadow-sm p-2">
            <span className="text-sm text-gray-500 mr-2">Unread messages:</span>
            <span className="font-medium text-purple-700">{unreadCount}</span>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="filter-unread"
              className="mr-2 text-sm font-medium text-gray-700"
            >
              Show unread only
            </label>
            <input
              type="checkbox"
              id="filter-unread"
              checked={filterUnread}
              onChange={() => setFilterUnread(!filterUnread)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
          </div>
          <button
            onClick={() => fetchMessages(filterUnread)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <MessageList
            messages={messages}
            onMarkAsRead={handleMarkAsRead}
            loading={loading}
            onViewMessage={handleViewMessage}
          />
        </div>
      </div>

      {selectedMessage && (
        <MessageDetail
          message={selectedMessage}
          onClose={handleCloseDetail}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
};

export default ManageMessagesPage;
