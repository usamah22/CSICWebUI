import React from "react";
import { cn } from "@/lib/utils";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#7a0082] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Media Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                X
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="mt-2">Email: support@example.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Aston Computer Science Industry Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
};