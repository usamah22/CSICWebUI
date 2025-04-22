import { useState, useCallback } from "react";
import { contactApi } from "../services/api";
import { ContactMessage, CreateContactMessageRequest } from "../types";
import { toast } from "react-hot-toast";

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (unreadOnly: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactApi.getMessages(unreadOnly);
      setMessages(data);
    } catch (err) {
      setError("Failed to fetch messages");
      toast.error("Could not load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  const submitMessage = useCallback(
    async (data: CreateContactMessageRequest) => {
      setLoading(true);
      setError(null);
      try {
        await contactApi.submitContactMessage(data);
        return true;
      } catch (err) {
        setError("Failed to send message");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      await contactApi.markAsRead(id);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
      );
      return true;
    } catch (err) {
      toast.error("Failed to mark message as read");
      return false;
    }
  }, []);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    submitMessage,
    markAsRead,
  };
};
