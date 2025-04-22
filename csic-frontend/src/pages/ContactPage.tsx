import React, { useState, FormEvent } from "react";
import { useContactMessages } from "../hooks/useContactMessages";
import { CreateContactMessageRequest } from "../types";
import { Toaster } from "react-hot-toast";

const ContactPage: React.FC = () => {
  const { submitMessage, loading } = useContactMessages();
  const [formData, setFormData] = useState<CreateContactMessageRequest>({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await submitMessage(formData);
    if (success) {
      setFormData({ name: "", email: "", message: "" });
      setFormSubmitted(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          We would love to hear from you! Reach out to us with any questions or
          feedback.
        </p>

        {formSubmitted ? (
          <div className="mt-8 p-4 bg-green-50 rounded-md border border-green-200">
            <h2 className="text-xl font-medium text-green-800">
              Thank you for your message!
            </h2>
            <p className="mt-2 text-green-700">
              We've received your message and will get back to you as soon as
              possible.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  pattern=".*@aston\.ac\.uk$"
                  title="Please use your Aston University email (@aston.ac.uk)"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                ></textarea>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#880090] hover:bg-[#7a0082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
