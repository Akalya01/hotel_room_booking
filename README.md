# Hotel Management Pro - Front-End Assessment

This is a single-page frontend application designed for a Hotel Room Booking coding test. It was built using **Next.js (App Router)** and **React**.

## Features

- **Main Dashboard**: An interactive overview of the hotel's operational status, including a color-coded floor grid (Available, Occupied, Dirty, Maintenance, Blocked) and quick actions.
- **Guest Check-in**: 
  - Select and view a list of available rooms.
  - Dynamically pick a Check-in Date and Check-out Date.
  - Real-time date validation (prevents past dates and invalid checkout dates).
  - Automatically calculates total nights, room rent, GST (12%), and total price based on date selections.
  - Inline UI for adding new guests directly to the list.
- **Guest Check-out**: 
  - Manage departing guests with an itemized, receipt-style billing summary.
- **Notifications**: Integrated `react-hot-toast` for realistic interaction feedback.

## Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: Custom CSS (`src/app/globals.css`) using modern CSS Grid and Flexbox layouts.
- **Icons**: `lucide-react`
- **Notifications**: `react-hot-toast`

## Getting Started

### 1. Install Dependencies
Make sure you are in the project root directory and run:
```bash
npm install
```

### 2. Run the Development Server
Start the local Next.js development server:
```bash
npm run dev
```

### 3. View the Application
Open [http://localhost:3000](http://localhost:3000) in your web browser.

## Code Structure

- `/src/app/page.tsx` - The main entry point (Dashboard view).
- `/src/app/checkin/page.tsx` - The Guest Check-in route.
- `/src/app/checkout/page.tsx` - The Guest Check-out route.
- `/src/components/` - Contains the primary UI components (`MainDashboard`, `GuestCheckin`, `GuestCheckout`).
- `/src/utils/bookingLogic.ts` - Contains pure functions for date validation, calculation logic, and initial mock data (separating business logic from UI).
- `/src/app/globals.css` - Contains all global styles and layout classes.
