# Feature Development Checklist

## Phase 1: Foundation (Completed)
- [x] **Project Structure**: Monorepo setup (Frontend: Next.js, Backend: NestJS).
- [x] **Database Schema**: Designed and Deployed on Supabase (PostgreSQL).
  - Users, Doctors, Pharmacies, Medicines, Inventory, Appointments, Prescriptions, Orders.
- [x] **Backend Core**:
  - Prisma ORM configured (Downgraded to v5.10.0 for stability).
  - Auth Service implemented (Registration/Login logic).
  - Environment variables configured (Supabase URL, Keys).
- [x] **Frontend Core**:
  - Next.js App Router setup.
  - Tailwind CSS integration.
  - UI Components (Shadcn/UI) installed.
  - Layouts configured (MainLayout vs DashboardLayout).

## Phase 2: Authentication & User Management (Completed)
- [x] **Frontend Auth**:
  - Login Page (`/auth/login`) - Connected to Backend API.
  - Register Page (`/auth/register`) - Connected to Backend API.
  - API Client (`apiFetch`) implemented with Token management.
  - Sidebar dynamically updates with User Name.
- [x] **Backend Auth**:
  - Database Connection Verified (Supabase Pooler).
  - JWT Authentication implemented (Passport, JwtStrategy).
  - Auth Guards created (`JwtAuthGuard`).
- [x] **User Profile**:
  - Patient Dashboard (`/dashboard/patient`) - Integrated with `/auth/profile`.
  - Profile Management API (`/auth/profile`) - Protected endpoint working.
  - LocalStorage caching implemented for instant dashboard rendering.

## Phase 3: Core Features (Planned)
- [ ] **Medicine Marketplace**:
  - [ ] **Backend**: Medicine Seeding script.
  - [ ] **Backend**: Medicine Search API (`GET /medicines/search`).
  - [ ] **Frontend**: Medicine Search UI on Home and Dashboard.
  - [ ] **Frontend**: Cart Functionality.
- [ ] **Doctor Consultation**:
  - [ ] Doctor Search & Filtering.
  - [ ] Appointment Booking.
  - [ ] Video Consultation Integration.
- [ ] **Pharmacy Management**:
  - [ ] Inventory Dashboard.
  - [ ] Order Fulfillment.

## Action Items (Next Session)
1.  **Medicine Data**: Seed the database with sample medicines.
2.  **Search API**: Implement search functionality in the backend.
3.  **UI Integration**: Connect the "Search Medicines" bar in the dashboard to the backend.
