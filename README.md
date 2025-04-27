# Computer Science Industry Club (CSIC) Frontend

## Overview

The Computer Science Industry Club (CSIC) website is a platform designed to enhance connections between students, academic staff, and industry professionals at Aston University. This frontend repository contains the user interface components built with React, TypeScript, and Vite for the CSIC web application.

## Features

- **Interactive Event Calendar**: Browse and search upcoming events, workshops, and networking opportunities.
- **Event Management**: Create, view, and manage CSIC events.
- **Booking System**: Reserve spots for events with booking confirmation.
- **User Authentication**: Secure role-based access control for students, staff, and administrators.
- **Admin Dashboard**: Easy-to-use interface for non-technical administrators.
- **Contact System**: Communication channel between students and industry professionals.
- **Feedback Management**: Collection and display of event feedback and ratings.
- **Responsive Design**: Optimised for desktop and mobile devices.
- **Accessibility Focus**: Built with accessibility standards (WCAG) in mind.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components based on modern design principles
- **Backend**: ASP.NET Core (separate repository)
- **Database**: PostgreSQL

## Project Structure

```
csic-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, and other assets
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── bookings/       # Booking-related components
│   │   ├── contact/        # Contact message components
│   │   ├── events/         # Event-related components
│   │   ├── feedback/       # Feedback components
│   │   ├── layout/         # Layout components (navbar, footer)
│   │   └── ui/             # Base UI components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   │   └── admin/          # Admin-specific pages
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
└── ...config files         # Various configuration files
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/usamah22/CSICWebUI.git
cd csic-frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be located in the `/dist` directory.

## User Roles

- **Students**: Can browse events, make bookings, and provide feedback.
- **Admin**: Can manage events, users, feedback, and contact messages.
- **Industry Partners**: Can submit requests to host events and guest lectures.
- **Staff**: Can submit requests to host events and guest lectures.

## Key Features

### Event Management

View upcoming events via an interactive calendar and detailed event pages.

### Booking System

Students can book event spots, view booking history, and manage reservations. Confirmation and status updates are provided.

### Feedback Collection

Submit feedback and ratings after attending events to help organisers improve future sessions.

### Admin Dashboard

Admins can manage users, events, feedback, and messages through a simple and intuitive dashboard.

### Contact System

Facilitates networking and communication between students and industry professionals.

### Accessibility and Compliance

Built following WCAG accessibility guidelines and GDPR compliance standards to ensure inclusivity.

## Contributing

As this project was developed as part of a university final year project, external contributions are not currently accepted.

## License

This project was developed for academic purposes at Aston University.

## Acknowledgments

- Aston University Computer Science Department
- All contributing industry partners
- Faculty advisors and project supervisors
