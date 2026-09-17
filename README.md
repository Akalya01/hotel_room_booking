# Hotel Room Booking System

A front-end web application for managing hotel room bookings — built as part of a coding assessment for **Raintech**.

This project covers the core day-to-day operations of a hotel front desk: checking guests in, reviewing bills, processing payments, and checking guests out.

---

## What This Application Does

### Dashboard
The main screen gives the front-desk staff a quick overview of the hotel. It shows room availability across floors using a color-coded grid, daily occupancy stats, and shortcut tiles to jump into common tasks like Check-in and Check-out.

### Guest Check-in
Staff can search for existing bookings or add a new guest on the spot. The system collects all the required details — guest name, room number, rent, GST, number of adults/kids, ID proof, and stay dates — through a clean popup form.

Key behaviors:
- Past dates are blocked for check-in (the date picker won't allow it).
- Check-out date must be after the check-in date.
- The bill (room charge, tax, total) is calculated automatically based on the selected dates.
- Guest details can be edited after adding, and the review panel updates in real time.

### Guest Check-out
Staff can look up a departing guest by name or room number. Once found, the system shows:
- All rooms associated with that guest, with checkboxes to select which ones to check out.
- A detailed bill breakdown per room — base room charge, extra charges (mini-bar, laundry, restaurant), GST, and subtotal.
- A combined total across all selected rooms.
- Payment method selection (Credit Card, Cash, UPI) and a one-click checkout button.

After payment, the room status updates to "Checked Out" and the checkout button is disabled for that room.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework and routing |
| React 19 | UI components and state management |
| Custom CSS | Styling with CSS Grid, Flexbox, and responsive media queries |
| lucide-react | Clean, consistent icons |
| react-hot-toast | Toast notifications for user feedback |

---

## How to Run

**Step 1** — Install dependencies:
```bash
npm install
```

**Step 2** — Start the development server:
```bash
npm run dev
```

**Step 3** — Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
  app/
    page.tsx                  Main entry point (Dashboard)
    globals.css               All global styles, layouts, and responsive breakpoints
    checkin/page.tsx           Check-in page route
    checkout/page.tsx          Check-out page route
  components/
    MainDashboard.tsx          Dashboard with room grid, stats, and navigation tiles
    GuestCheckin.tsx            Check-in workflow — guest form, room table, billing
    GuestCheckout.tsx           Check-out workflow — guest lookup, bill review, payment
    ui/
      FormField.tsx            Reusable form field with label, error, and hint support
      Panel.tsx                Reusable card/panel wrapper with optional header
      PageHeader.tsx           Shared top navigation bar with back button and search
      index.ts                 Barrel exports for all UI components
  utils/
    bookingLogic.ts            Business logic — room data, date validation, bill calculation
```

---

## Design Decisions

- **No backend** — All data is static/mock. The focus is purely on the front-end UI and interactions.
- **Reusable components** — Common patterns like form fields, panels, and page headers are extracted into shared components under `components/ui/`.
- **Responsive layout** — The UI adapts to desktop, tablet, and mobile screens using CSS media queries at 1024px, 768px, and 480px breakpoints.
- **Separation of concerns** — Business logic (date validation, bill calculation) lives in `utils/bookingLogic.ts`, separate from the UI components.

---

## Author

Built by **Akalya** for the Raintech front-end assessment.
