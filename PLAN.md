# MedStore Development Plan

## Overview
This plan outlines the roadmap to develop the full functionality of the MedStore Healthcare Platform, transitioning from the current UI-only state to a fully functional full-stack application.

## Current Status (Updated Jan 31, 2026)
- **Frontend**: Next.js 14 + Tailwind CSS.
  - ✅ Home Page (Landing)
  - ✅ Auth Pages (Login/Register) - Fully Integrated
  - ✅ Patient Dashboard - Fully Integrated with Real Data
- **Backend**: NestJS + Prisma + Supabase.
  - ✅ Database Schema (Deployed)
  - ✅ Authentication (JWT, Guards, Profile)
  - ✅ API Endpoints (Auth routes active)

---

## Phase 1: Backend Core Setup (Completed)
**Objective**: Establish the data layer and authentication logic.
- ✅ Database Configuration (Prisma + Supabase)
- ✅ Authentication Module (JWT Strategy)
- ✅ Core Modules Setup

## Phase 2: Frontend-Backend Integration (Completed)
**Objective**: Make the UI functional.
- ✅ API Client Setup (`apiFetch` with Interceptors)
- ✅ Authentication Wiring (Login/Register connected)
- ✅ Patient Dashboard Integration (Profile Fetching, Dynamic Header/Sidebar)

## Phase 3: Feature Implementation (Next Priority)

### 3.1 Medicine Marketplace
-   **Backend**: 
    -   `GET /medicines/search`: Implement full-text search (Postgres ILIKE).
    -   `GET /medicines/:id`: Product details.
    -   Seed Script: Populate DB with initial medicine data.
-   **Frontend**: 
    -   Implement Search functionality on Home Page and Dashboard.
    -   Create `/medicines` listing page with filters.
    -   Create Product Detail Page.
    -   Implement Cart functionality (Context/Zustand).

### 3.2 Doctor Consultation
-   **Backend**:
    -   `GET /doctors`: Search with filters (Specialty, Location).
    -   `POST /appointments`: Booking logic.
-   **Frontend**:
    -   Doctor Search Page.
    -   Booking Flow (Select Date/Time -> Payment).

### 3.3 Payments & Orders
-   **Backend**:
    -   Integrate Razorpay/Stripe (Mock for now).
    -   Order creation logic.
-   **Frontend**:
    -   Checkout Page.
    -   Order Success/History views.

## Phase 4: Additional Dashboards
-   **Doctor Dashboard**: Schedule management, Patient list.
-   **Pharmacy Dashboard**: Inventory, Order fulfillment.
-   **Admin Dashboard**: Analytics, User management.

---

## Next Steps (Actionable)
1.  **Seed Medicines**: Create a script to add sample medicines to the Supabase database.
2.  **Build Search API**: Create the `MedicinesModule` in NestJS.
3.  **Frontend Search**: Connect the dashboard search bar to the new API.
