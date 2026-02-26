# MedStore Development Plan & Progress Checklist

## Project Status
**Current Phase**: Core Functionality & User Experience Refinement
**Date**: 2026-02-25

## Implemented Features (✅ Ready)
- **Authentication**:
  - User Registration (Patient)
  - User Login (JWT based)
  - Protected Routes
- **Dashboard**:
  - Patient Dashboard Layout
  - Dynamic Greeting & User Info
  - Real-time Active Orders Count
  - Recent Order Timeline
- **Medicines**:
  - Search Medicines Functionality
  - Medicine Listing
  - Medicine Details (Basic)
- **Cart & Checkout**:
  - Add to Cart
  - View Cart
  - Update Quantity
  - Remove Items
  - Checkout Flow (Order Creation)
- **Orders**:
  - Order History Listing
  - Order Details View
- **Prescriptions**:
  - Upload Prescription (Image/PDF)
  - View Uploaded Prescriptions
  - Backend Storage (Supabase) & Database Tracking

## In Progress / Partially Implemented (🚧)
- **Health Wallet**:
  - UI Placeholder created
  - "Coming Soon" page linked
  - *Next Step*: Implement wallet balance schema & transaction history.

## Pending Features (📅 To Do)
- **Appointments**:
  - Doctor Listing
  - Booking Flow
- **Lab Tests**:
  - Test Listing
  - Booking Flow
- **Profile Management**:
  - Edit Profile
  - Address Management (Currently mocked in checkout)
- **Payment Gateway**:
  - Integration with real payment provider (Razorpay/Stripe) - *Currently Mocked*
- **Notifications**:
  - Email/SMS alerts for order status
  - In-app toast notifications (Currently using alerts)

## Known Issues / Notes
- **Checkout Address**: Currently uses a hardcoded address. Needs to be connected to user profile/input.
- **Images**: Using placeholder images for medicines.
- **Search**: Basic database search (case-insensitive).
