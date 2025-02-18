import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout: React.FC<{ children: React.ReactNode; fullWidth?: boolean }> = ({
  children,
  fullWidth = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main
        className={
          fullWidth
            ? "w-full py-6" // Full-width layout without padding
            : "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" // Constrained layout
        }
      >
        {children}
      </main>
      <Footer />
      
    </div>
  );
};