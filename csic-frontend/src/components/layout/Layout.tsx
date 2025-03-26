// File: csic-frontend/src/components/layout/Layout.tsx

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout: React.FC<{ children: React.ReactNode; fullWidth?: boolean }> = ({
  children,
  fullWidth = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Consistent across all pages */}
      <Navbar fullWidth={fullWidth} />

      {/* Main Content */}
      <main className={`flex-grow ${fullWidth ? '' : 'container mx-auto px-4'}`}>
        {children}
      </main>

      {/* Footer - Stays at the bottom */}
      <Footer />
    </div>
  );
};