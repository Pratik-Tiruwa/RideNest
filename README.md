# 🚗 RideNest - Smart Vehicle Rental, Partner Onboarding & Real-Time Ride Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v5_Beta-purple?style=for-the-badge&logo=auth0)](https://authjs.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-v4-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Suggestions-8E75B2?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-Data_Viz-22B5BF?style=for-the-badge)](https://recharts.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![ZegoCloud](https://img.shields.io/badge/ZegoCloud-Video_KYC-0055FF?style=for-the-badge)](https://www.zegocloud.com/)

**RideNest** is a full-stack, enterprise-grade vehicle rental ecosystem, partner management, and real-time ride-booking platform. It bridges customers, vehicle partners, and platform administrators through:
- **Real-Time Geolocation Ride Booking & Live Navigation** with Leaflet, OpenStreetMap, and Socket.IO.
- **Dual OTP Verification Security Flow** (Pickup OTP & Drop OTP) to safeguard passengers and authenticate trip completion.
- **In-Ride Real-Time Chat with Google Gemini AI Smart Reply Suggestions** supporting multilingual conversational context (English, Hindi, and Hinglish).
- **Flexible Payments & Instant Reconciliation** supporting Razorpay online payment gateway and Cash rides with automatic commission splits.
- **Interactive 7-Day Earnings Visualizations (Recharts)** for both platform Administrators and Partners.
- **End-to-End Multi-Step Partner Onboarding** featuring document upload duplicate detection, live 1-on-1 Video KYC verification, vehicle pricing configuration, and administrative review suites.
- **Dedicated Real-Time Socket Microservice (`ridenest-socketServer`)** for high-frequency GPS tracking and bi-directional room-based event dispatch.

---

## 🌟 Complete Implemented Features

### 🔐 1. Authentication & Role-Based Authorization
- **NextAuth.js v5 (Beta)**: Credentials authentication and Google OAuth integration.
- **Email OTP Verification**: 6-digit email OTP generation and dispatch via **Nodemailer** for user registration and verification.
- **Dynamic JWT Role Synchronization**: Real-time JWT session callback synchronizes updated database roles (`user`, `partner`, `admin`) to eliminate stale tokens.
- **Role-Based Dynamic Layout**:
  - `user` ➔ **Public Home & Ride Search** (Hero, vehicle sliders, rental catalog, booking flow, ride tracking).
  - `partner` ➔ **Partner Onboarding Stepper, Partner Dashboard & Active Ride Management**.
  - `admin` ➔ **Admin Metrics Dashboard, Partner/Vehicle Review Queues & 7-Day Commission Analytics**.

---

### 🗺️ 2. Geolocation Discovery & Nearby Vehicle Search
- **Interactive Search Map (`/user/search`, `SearchMap.tsx`)**:
  - Interactive OpenStreetMap integration powered by `react-leaflet` and `leaflet`.
  - Auto-location detection with HTML5 Geolocation API.
  - Pickup and drop-off location selection with dynamic marker placement and reverse-geocoding via Nominatim/OSRM (`geocoding.ts`).
  - Road routing preview polyline with automated route distance (km) and estimated travel time (ETA).
- **MongoDB Geospatial Indexing (`2dsphere`)**:
  - `POST /api/vehicles/near-by` searches for active, online, and approved partners within a **10 km radius** using `$near` and `$geometry: Point`.
  - Filters by selected vehicle category (`bike`, `car`, `loading`, `truck`, `auto`).
- **Real-Time Driver Location Streaming (`GeoUpdater.tsx`)**:
  - Continuously monitors device coordinates with `navigator.geolocation.watchPosition` (high accuracy, 5000ms maximum age).
  - Streams real-time GPS coordinates directly to the Socket server via `update-location` events.
- **Dynamic Vehicle Catalog Card (`VehicleCard.tsx`)**:
  - Visual display of vehicle photo, model, color, pricing rates (base fare + per km), driver rating, and calculated route distance.
  - One-click trigger navigating directly into the booking checkout flow.

---

### 💳 3. Ride Booking, Fare Estimation & Checkout Lifecycle
- **Trip Estimation & Configuration (`/user/book`)**:
  - Formulates real-time pricing using the partner's verified rates:
    $$\text{Total Fare} = \text{Base Fare} + (\text{Distance in KM} \times \text{Price Per KM}) + \text{Waiting Charge}$$
  - Captures pickup address, destination address, and contact information.
- **Payment Selection & Gateway Integration (`/user/checkout`)**:
  - **Online Payment via Razorpay**:
    - Creates secure Razorpay order (`POST /api/payment/create`) via official Razorpay Node SDK.
    - Launches client-side Razorpay checkout modal with branding and order details.
    - Cryptographic signature validation (`POST /api/payment/verify`) using HMAC-SHA256 to guarantee transaction integrity before confirming the booking.
  - **Cash on Delivery**:
    - Instant booking confirmation with `paymentStatus = "cash"` for pay-after-ride convenience.
- **Booking State Machine (`IBooking`)**:
  - Complete lifecycle management: `idle` ➔ `requested` ➔ `awaiting_payment` ➔ `confirmed` ➔ `started` ➔ `completed` (or `cancelled` / `rejected`).
- **Customer Booking History (`/user/bookings`, `GET /api/user/bookings`)**:
  - Comprehensive dashboard displaying past and active bookings.
  - Status badges, fare details, route addresses, vehicle specifications, and a direct link to the live tracking page.

---

### 🚖 4. Partner Ride Dispatch & Active Ride Cockpit
- **Pending Requests Feed (`/partner/pending-requests`)**:
  - Partners receive real-time incoming booking requests with pickup/drop locations and calculated fares (`GET /api/partner/bookings/pending-requests`).
  - **Accept / Reject Handlers**:
    - `POST /api/partner/bookings/[id]/accept`: Claims the ride and sets booking status to `confirmed`.
    - `POST /api/partner/bookings/[id]/reject`: Rejects the ride and frees it for other nearby drivers.
- **Partner Active Ride View (`/partner/active-ride`)**:
  - Real-time ride monitoring dashboard for drivers (`GET /api/partner/my-active`).
  - Turn-by-turn route navigation to pickup and destination.
  - Direct call passenger trigger and live in-ride chat drawer.
- **Mobile-Responsive Expandable Drawer (`PanelContent.tsx`)**:
  - Framer Motion spring-animated bottom sheet drawer designed specifically for mobile drivers.
  - Allows seamless one-tap switching between full-screen map navigation, trip information, passenger details, and OTP verification modals.

---

### 📍 5. Live Ride Tracking & Dynamic Route Navigation
- **Dynamic Rider Tracking (`/user/ride/[id]`)**:
  - Real-time ride status monitoring for passengers (`GET /api/booking/active`, `GET /api/booking/[id]`).
- **Interactive Live Tracking Map (`LiveRideMap.tsx`)**:
  - Built with `react-leaflet` and Leaflet custom `DivIcon` styling.
  - **Custom Markers**:
    - Stylized dark-themed pills for `PICKUP` and `DROP` locations.
    - Smooth animated car marker reflecting driver position updates.
  - **Real-Time GPS Synchronization**:
    - Listens to `driver-location` events streamed over WebSockets from the driver's device.
    - Calculates distance-to-pickup, ETA-to-pickup, distance-to-destination, and ETA-to-drop in real time.
    - Robust coordinate sanitization and fallback checks to prevent Leaflet null runtime crashes.

---

### 🛡️ 6. Dual OTP Security Verification Workflow
To protect passengers from fraudulent pickups and ensure verifiable trip completion, a dual-layer OTP protocol is enforced:
1. **Pickup OTP Verification**:
   - `POST /api/partner/bookings/otp/pickup/send`: Generates a secure 6-digit OTP dispatched to the rider's email via Nodemailer.
   - `POST /api/partner/bookings/otp/pickup/verify`: Driver enters the passenger's OTP upon arrival. Once validated, the ride status transitions to `started`.
2. **Drop OTP & Trip Completion**:
   - `POST /api/partner/bookings/otp/drop/send`: Generates a 6-digit drop OTP emailed to the customer upon reaching the drop-off location.
   - `POST /api/partner/bookings/otp/drop/verify`: Driver inputs the drop OTP to finalize the trip:
     - Automatically verifies code validity and expiration.
     - **Automated Commission Split**: Calculates 10% platform commission (`adminCommission = fare * 0.10`) and 90% driver payout (`partnerAmount = fare - adminCommission`).
     - Updates `paymentStatus = "paid"` and marks `bookingStatus = "completed"`.

---

### 💬 7. In-Ride Real-Time Chat & Google Gemini AI Quick Replies
- **Real-Time Messaging (`RideChat.tsx`, `ChatMessage` model)**:
  - Isolated bi-directional chat rooms tied to the active booking (`ride-${bookingId}`).
  - Instant message broadcasting via Socket.IO (`chat-message`).
  - Persistent message history in MongoDB (`/api/chat/get-all`, `/api/chat/sender`).
  - Smooth auto-scrolling with `messagesEndRef` on incoming messages.
- **Google Gemini AI Quick Response Suggestions (`/api/chat/ai-suggestions`)**:
  - Integrated with Google's **Gemini AI API** (`gemini-2.5-flash` / Gemini REST endpoint).
  - Contextually analyzes recent chat messages and the sender's active role (`USER` vs `DRIVER`).
  - **Multilingual & Script Intelligence**:
    - Detects and mirrors the exact language, tone, and script of the conversation.
    - Provides authentic responses in **Hinglish / Roman Hindi** (e.g., *"Bas 5 minute me pahunch raha hu"*, *"Thoda traffic hai, 5 min lagenge"*), **Hindi** (Devanagari), or **English**.
  - One-tap quick response chips for fast, hands-free communication during transit.

---

### 🏁 8. Ride Completed Screen (`CompletedScreen.tsx`)
- Beautiful celebratory completion screen rendered on both passenger (`/user/ride/[id]`) and partner (`/partner/active-ride`) views.
- Animated emerald checkmark with Framer Motion spring physics.
- Displays detailed trip breakdown: Final fare collected, payment badge (`Paid`, `Cash`, `Pending`), and passenger/driver summary.
- One-click "Back to Home" navigation button.

---

### 📈 9. 7-Day Revenue Analytics & Data Visualization (Recharts)
- Integrated **Recharts** for interactive business intelligence and earnings tracking:
- **Admin Earnings Suite (`AdminEarning.tsx`, `GET /api/admin/earning`)**:
  - Aggregates daily platform commission (`adminCommission`) over the rolling past 7 days.
  - Interactive `BarChart` with rounded bars, custom axes, Cartesian grids, and responsive containers.
  - Dynamic bar highlighting: Visually differentiates today's bar and the week's best-performing revenue day.
  - Metric summary cards with Framer Motion staggered entrance:
    - **Weekly Total Revenue** with positive/negative trend indicators.
    - **Best Day** revenue and date badge.
    - **Daily Average** commission.
    - **Today's Earning** with day-over-day percentage delta calculations.
- **Partner Earnings Suite (`PartnerEarning.tsx`, `GET /api/partner/earning`)**:
  - Aggregates daily driver net payouts (`partnerAmount`) over the last 7 days.
  - Embedded directly inside `PartnerDashboard.tsx`.
  - Provides partners with transparent insights into their daily performance, peak earning days, and daily payout averages.

---

### ⚡ 10. Dedicated Real-Time Socket Microservice (`ridenest-socketServer`)
- Standalone Node.js + Express + Socket.IO microservice running alongside the Next.js application.
- **Real-Time Event Architecture**:
  - `identity`: Binds authenticated user IDs to socket sessions and toggles user state (`isOnline: true`).
  - `update-location`: High-frequency driver GPS coordinate ingestion updating MongoDB `Point` coordinates.
  - `join-ride`: Subscribes clients to room-isolated ride channels (`ride-${bookingId}`).
  - `driver-location-update`: Relays real-time vehicle coordinates to tracking passengers with sub-second latency.
  - `chat-message`: Broadcasts in-ride messages between riders and drivers.
  - `POST /emit`: Server-side push notification endpoint for dispatching events directly to target user socket connections.
  - `disconnect`: Automatically clears socket IDs and sets `isOnline: false`.

---

### 📋 11. Multi-Step Partner Onboarding Lifecycle
An interactive 8-stage onboarding stepper with dynamic progress tracking and state-dependent access control:
1. **Vehicle Registration (`/partner/onboarding/vehicle`)**:
   - Vehicle type selector (Bike, Scooty, Car, Luxury), model, and registration number.
   - Regex validation and uppercase number formatting.
   - Automatic prefetching and prefilling of existing vehicles with update support.
2. **Document Upload & Verification (`/partner/onboarding/documents`)**:
   - Upload fields for **Aadhaar Card**, **Driving License**, and **Vehicle RC**.
   - **Binary Buffer & Metadata Duplicate Detection**: Prevents duplicate file uploads on both client-side and server-side.
   - Direct integration with **Cloudinary** buffer upload utility.
   - Status badges and submission gating until all files are selected.
3. **Bank & Payout Setup (`/partner/onboarding/bank`)**:
   - Account holder name, account number, IFSC code, mobile number, and UPI ID.
   - Instant client-side validation and server-side persistence.
   - Automatic prefetching and prefilling for returning partners.
   - Immediate automatic redirect (`router.push('/')`) to dashboard upon step submission across all onboarding forms (Vehicle, Documents, Bank).
4. **Partner Dashboard & Review Status (`PartnerDashboard.tsx`)**:
   - **Interactive Stepper Dashboard**: Animated progress bar and step indicators powered by **Framer Motion**.
   - **Documents Under Review (`StatusCard.tsx`)**: Renders dynamically on Step 4 when `partnerStatus === "pending"`, alerting the partner that the admin is reviewing documents.
   - **Rejection & Resubmission (`RejectionCard.tsx`)**: Renders dynamically on Step 4 when `partnerStatus === "rejected"`, displaying the admin's exact rejection reason with an interactive *"Review and Update"* action button to edit and resubmit.
5. **Live Video KYC Verification (`/video-kyc/[roomId]`)**:
   - 1-on-1 real-time video verification powered by `@zegocloud/zego-uikit-prebuilt`.
   - **Live Admin Room Initiation**: Admin triggers video call from review dashboard (`/api/admin/video-kyc/start/[id]`).
   - **Partner Dashboard Call Alert**: Shows dynamic *"Admin Started Video KYC"* card with a direct *"Join Call"* action button.
   - **Re-request & Rejection Handling**: Partners can re-request video KYC upon rejection with room cleanup (`/api/partner/video-kyc/request`).
   - **Verification Completion**: Admin marks KYC as complete (`/api/admin/video-kyc/complete`), updating `videoKycStatus = "approved"` and advancing partner step to 5.
6. **Vehicle Pricing Model & Image Upload (`PricingModel.tsx`)**:
   - Triggered on Step 6 once partner document review and video KYC are both approved.
   - **Fare & Color Configuration**: Interactive animated modal to configure **Base Fare**, **Price Per KM**, **Waiting Charge**, and **Vehicle Color**.
   - **Vehicle Image Upload**: Direct Cloudinary upload with real-time local file preview (`URL.createObjectURL`).
   - **Prefill on Edit**: Automatically fetches and populates saved pricing, color, and image for quick updates (`GET /api/partner/onboarding/pricing`).
7. **Pricing Review & Resubmission (`PartnerDashboard.tsx`)**:
   - **Pricing Under Review (`StatusCard.tsx`)**: Displayed on Step 7 when `vehicleData.status === "pending"`.
   - **Pricing Rejection & Resubmission (`RejectionCard.tsx`)**: Renders when `vehicleData.status === "rejected"` with the admin's rejection reason and an *"Edit & Resubmit"* action button.
8. **Live Account Activation (`PartnerDashboard.tsx`)**:
   - **"🚀 You're Live" Completion Banner**: Celebratory card displayed on Step 8 when vehicle status is approved, with a direct *"Go to Bookings"* call-to-action button.

---

### 🔍 12. Admin Management, Partner & Vehicle Review Suites
- **Live Statistics API & KPI Cards (`/api/admin/dashboard`, `Kpi.tsx`)**:
  - Live metric cards with spring physics (`motion/react`) tracking Total Partners, Approved, Pending, and Rejected counts.
- **Review Queue Management (`ContentList.tsx` & `TabButton.tsx`)**:
  - Responsive review tabs with animated count badges for **Partner Documents**, **Video KYC**, and **Vehicle Pricing** queues.
- **Admin Partner Document Review (`/admin/reviews/partner/[id]`)**:
  - Interactive document previews (`DocPreview.tsx`) for Aadhaar, Driving License, and RC (Image & PDF support).
  - Vehicle and bank profile cards with approval & rejection confirmation modals.
  - Endpoints: `GET /api/admin/reviews/partner/[id]`, `POST .../approve`, `POST .../reject`.
- **Admin Vehicle & Pricing Review (`/admin/reviews/vehicle/[id]`)**:
  - Glassmorphic header, uncropped image preview, vehicle specifications, and formatted Indian Rupee pricing cards.
  - Endpoints: `GET /api/admin/reviews/vehicle/[id]`, `GET .../approve`, `POST .../reject`.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/), [JavaScript (ES Modules)](https://developer.mozilla.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), Glassmorphism |
| **Animations** | [Framer Motion / Motion](https://motion.dev/) |
| **Real-Time WebSockets** | [Socket.IO](https://socket.io/), [Socket.IO Client](https://socket.io/docs/v4/client-api/) |
| **Maps & Geolocation** | [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/), OpenStreetMap, OSRM / Nominatim |
| **Payments** | [Razorpay SDK](https://razorpay.com/), Webhooks & Signature Verification |
| **Generative AI** | [Google Gemini AI API](https://ai.google.dev/) (Contextual Multilingual Chat Suggestions) |
| **Data Visualization** | [Recharts](https://recharts.org/) (Interactive Revenue & Payout Bar Charts) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/), [React-Redux](https://react-redux.js.org/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) (2dsphere Geospatial Indexing), [Mongoose 9](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v5 Beta](https://authjs.dev/), [Bcrypt](https://www.npmjs.com/package/bcrypt) |
| **Cloud Storage** | [Cloudinary SDK](https://cloudinary.com/) (Buffer uploads) |
| **Video Calling** | [ZegoCloud UIKit](https://www.zegocloud.com/) (1-on-1 Video KYC) |
| **Mailing Service** | [Nodemailer](https://nodemailer.com/) (Registration, Pickup OTP, and Drop OTP) |
| **Icons** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |

---

## 📂 Project Architecture & Structure

```text
3.ridenest/
├── ridenest/                            # Next.js Full-Stack Application
│   ├── public/                          # Static assets (logo, vehicle illustrations)
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/reviews/
│   │   │   │   ├── partner/[id]/        # Admin partner document review page
│   │   │   │   └── vehicle/[id]/        # Admin vehicle & pricing review page
│   │   │   ├── api/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/       # Admin metrics & review queue API
│   │   │   │   │   ├── earning/         # 7-day admin commission analytics API
│   │   │   │   │   ├── reviews/         # Partner and vehicle review approval/rejection endpoints
│   │   │   │   │   └── video-kyc/       # Video KYC start, pending & complete endpoints
│   │   │   │   ├── auth/                # NextAuth, registration, and email OTP endpoints
│   │   │   │   ├── booking/
│   │   │   │   │   ├── active/          # Active customer booking details endpoint
│   │   │   │   │   ├── create/          # Ride booking creation API
│   │   │   │   │   └── [id]/            # Cancel and confirm endpoints
│   │   │   │   ├── chat/
│   │   │   │   │   ├── ai-suggestions/  # Gemini AI smart reply generator API
│   │   │   │   │   ├── get-all/         # Chat messages retrieval endpoint
│   │   │   │   │   └── sender/          # Chat message dispatch endpoint
│   │   │   │   ├── partner/
│   │   │   │   │   ├── bookings/        # Partner bookings, accept/reject, and pending requests
│   │   │   │   │   │   └── otp/         # Pickup and Drop OTP send & verify endpoints
│   │   │   │   │   ├── earning/         # 7-day partner payout analytics API
│   │   │   │   │   ├── my-active/       # Current active ride for driver
│   │   │   │   │   ├── onboarding/      # Bank, documents, pricing, and vehicle setup APIs
│   │   │   │   │   └── video-kyc/       # Video KYC re-request endpoint
│   │   │   │   ├── payment/
│   │   │   │   │   ├── create/          # Razorpay order generation endpoint
│   │   │   │   │   └── verify/          # Razorpay signature HMAC-SHA256 verification
│   │   │   │   ├── user/
│   │   │   │   │   ├── active-ride/     # Current user active ride query
│   │   │   │   │   ├── bookings/        # Customer ride history endpoint
│   │   │   │   │   └── me/              # User profile session endpoint
│   │   │   │   └── vehicles/near-by/    # MongoDB 2dsphere nearby vehicle query API
│   │   │   ├── partner/
│   │   │   │   ├── active-ride/         # Driver live ride cockpit & OTP controls
│   │   │   │   ├── bookings/            # Partner booking history
│   │   │   │   ├── pending-requests/    # Incoming ride requests feed
│   │   │   │   └── onboarding/          # Step forms: vehicle, documents, bank
│   │   │   ├── user/
│   │   │   │   ├── book/                # Route fare estimation & trip configuration
│   │   │   │   ├── bookings/            # Customer ride history dashboard
│   │   │   │   ├── checkout/            # Payment gateway checkout (Razorpay / Cash)
│   │   │   │   ├── ride/[id]/           # Passenger live ride tracking & chat page
│   │   │   │   └── search/              # OpenStreetMap vehicle discovery page
│   │   │   ├── video-kyc/[roomId]/      # Live 1-on-1 ZegoCloud video KYC room
│   │   │   ├── layout.tsx               # Root layout with Redux, Session, and GeoUpdater
│   │   │   └── page.tsx                 # Role-based conditional home router
│   │   ├── components/
│   │   │   ├── AdminDashboard.tsx       # Admin KPI & review queue view
│   │   │   ├── AdminEarning.tsx         # Admin 7-day revenue analytics (Recharts)
│   │   │   ├── AnimatedCard.tsx         # Reusable Framer Motion hover card
│   │   │   ├── AuthModel.tsx            # Login & Signup modal dialog
│   │   │   ├── CompletedScreen.tsx      # Ride completion celebration & fare summary
│   │   │   ├── ContentList.tsx          # Admin review queue lists & action cards
│   │   │   ├── DocPreview.tsx           # Document preview component (Image & PDF)
│   │   │   ├── Footer.tsx               # Global application footer
│   │   │   ├── GeoUpdater.tsx           # Background driver GPS coordinate tracker
│   │   │   ├── HeroSection.tsx          # Landing page hero banner
│   │   │   ├── Kpi.tsx                  # Animated metric KPI card
│   │   │   ├── LiveRideMap.tsx          # Leaflet live ride tracking & car marker map
│   │   │   ├── Navbar.tsx               # Responsive role-aware top navigation bar
│   │   │   ├── PanelContent.tsx         # Expandable mobile driver drawer & bottom sheet
│   │   │   ├── PartnerDashboard.tsx     # 8-step onboarding stepper dashboard
│   │   │   ├── PartnerEarning.tsx       # Partner 7-day earnings summary (Recharts)
│   │   │   ├── PricingModel.tsx         # Step 6 modal for pricing rates, color & image upload
│   │   │   ├── PublicHome.tsx           # Customer home view
│   │   │   ├── RejectionCard.tsx        # Step 4 rejection alert card with reason & retry
│   │   │   ├── RideChat.tsx             # Real-time chat with Gemini AI quick replies
│   │   │   ├── SearchMap.tsx            # OpenStreetMap search & routing map
│   │   │   ├── StatusCard.tsx           # Step 4 pending review status indicator card
│   │   │   ├── TabButton.tsx            # Animated review queue tab navigation button
│   │   │   ├── VehicleCard.tsx          # Vehicle catalog preview & booking trigger card
│   │   │   └── VehicleSlider.tsx        # Interactive vehicle catalog slider
│   │   ├── hooks/
│   │   │   └── useGetMe.tsx             # Hook to fetch and hydrate user state
│   │   ├── lib/
│   │   │   ├── cloudinary.ts            # Cloudinary buffer upload utility
│   │   │   ├── db.ts                    # MongoDB connection caching utility
│   │   │   ├── geocoding.ts             # Nominatim/OSRM reverse geocoding utility
│   │   │   ├── Provider.tsx             # Combined Redux & Session providers wrapper
│   │   │   ├── razorpay.ts              # Razorpay SDK initialization
│   │   │   ├── sendMail.ts              # Nodemailer OTP email dispatcher
│   │   │   └── socket.ts                # Client-side Socket.IO singleton
│   │   ├── models/
│   │   │   ├── booking.model.ts         # Booking schema with locations, OTPs, fares & statuses
│   │   │   ├── chatMessage.model.ts     # Chat schema with bookingId, sender & text
│   │   │   ├── partnerBank.model.ts     # Partner bank & payout schema
│   │   │   ├── partnerDocs.model.ts     # Partner KYC documents schema
│   │   │   ├── user.model.ts            # User schema with roles, socketId & 2dsphere location
│   │   │   └── vehicle.model.ts         # Vehicle schema with pricing rates & active status
│   │   └── redux/
│   │       ├── ReduxProvider.tsx        # Redux provider component
│   │       ├── store.ts                 # Redux central store configuration
│   │       └── userSlice.ts             # User & onboarding state slice
│   ├── package.json
│   └── README.md
│
└── ridenest-socketServer/               # Dedicated Real-Time Socket Microservice
    ├── models/
    │   └── user.model.js                # Socket user schema for location and online status
    ├── index.js                         # Express + Socket.IO server & event handlers
    ├── package.json
    └── README.md
```

---

## 🗄️ Database Schemas Summary

- **`User`**: Core user entity storing credentials, role (`user` \| `partner` \| `admin`), `partnerStatus` (`pending` \| `approved` \| `rejected`), `rejectionReason`, `partnerOnBoardingSteps` (1 to 8), `videoKycStatus`, `videoKycRoomId`, `videoKycRejectionReason`, OTP, mobile number, `socketId`, `isOnline` status, and GeoJSON `location: { type: "Point", coordinates: [lng, lat] }` with a MongoDB `2dsphere` index.
- **`Vehicle`**: Partner vehicle profile tracking `owner` reference, vehicle type (`bike`, `car`, `loading`, `truck`, `auto`), model name, registration number, `color`, `imageUrl`, pricing rates (`baseFare`, `pricePerKM`, `waitingCharge`), `status` (`approved` \| `pending` \| `rejected`), `rejectionReason`, and `isActive` availability flag.
- **`Booking`**: Full ride lifecycle entity tracking:
  - References to `user`, `driver`, and `vehicle`.
  - Pickup and drop addresses with GeoJSON `Point` coordinates.
  - Calculated `fare`, `userMobileNumber`, and `driverMobileNumber`.
  - `bookingStatus`: `idle` \| `requested` \| `awaiting_payment` \| `confirmed` \| `started` \| `completed` \| `cancelled` \| `rejected` \| `expired`.
  - `paymentStatus`: `pending` \| `paid` \| `cash` \| `failed` and `paymentDeadline`.
  - Commission breakdown: `adminCommission` (10% platform fee) and `partnerAmount` (90% driver payout).
  - Security OTP fields: `pickUpOtp`, `pickUpOtpExpires`, `dropOtp`, `dropOtpExpires`.
- **`ChatMessage`**: Real-time communication entity storing `bookingId` reference, `sender` (`user` \| `driver`), `text`, and automatic timestamps.
- **`PartnerDocs`**: KYC documents storing Cloudinary secure URLs for Aadhaar Card, Driving License (`licenseUrl`), and Vehicle RC, along with review status.
- **`PartnerBank`**: Financial payout profile containing account holder name, bank account number, IFSC code, and UPI ID.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.18 or higher recommended)
- **MongoDB** instance (local or MongoDB Atlas)
- **Cloudinary** account (for KYC document and vehicle image uploads)
- **ZegoCloud** developer account (for 1-on-1 Video KYC)
- **Razorpay** account (for test payments)
- **Google Gemini API Key** (for real-time chat reply suggestions)

---

### 2. Installation

Clone the repository and install dependencies for both the main Next.js application and the Socket server:

```bash
# Clone the repository
git clone https://github.com/Pratik-Tiruwa/RideNest.git
cd 3.ridenest

# Install Next.js frontend & API dependencies
cd ridenest
npm install

# Install Socket microservice dependencies
cd ../ridenest-socketServer
npm install
```

---

### 3. Environment Variables Configuration

#### Next.js Application (`ridenest/.env.local`):

```env
# Database
MONGODB_URL=your_mongodb_connection_string

# Authentication (NextAuth.js v5)
AUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3008

# Google OAuth
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Email Service (Nodemailer for OTPs)
EMAIL=your_email@gmail.com
PASS=your_email_app_password

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ZegoCloud Video KYC
NEXT_PUBLIC_ZEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_zego_server_secret

# Real-Time Socket.IO Server
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:6000

# Razorpay Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Google Gemini AI (Smart Chat Reply Suggestions)
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=your_gemini_api_key
```

#### Socket Server (`ridenest-socketServer/.env`):

```env
PORT=6000
MONGODB_URL=your_mongodb_connection_string
NEXT_BASE_URL=http://localhost:3008
```

---

### 4. Running the Development Environment

Launch both services in separate terminal windows:

```bash
# Terminal 1: Run Socket.IO Server
cd ridenest-socketServer
npm run dev

# Terminal 2: Run Next.js Application
cd ridenest
npm run dev
```

Open [http://localhost:3008](http://localhost:3008) in your browser to experience the application.

---

## 🛣️ Roadmap & Completed Milestones

- [x] Complete Multi-Step Partner Onboarding & Document Uploads.
- [x] Partner Document Approval / Rejection suite inside Admin Panel.
- [x] Video KYC scheduling, real-time room call initiation, and Admin verification workflow.
- [x] Vehicle pricing configuration, image upload, and Admin vehicle approval/rejection suite.
- [x] Geolocation vehicle search with OpenStreetMap, Leaflet routing, and 10km radius MongoDB `$near` lookup.
- [x] Flexible checkout with **Razorpay** online payment gateway & Cash on delivery.
- [x] Dedicated real-time **Socket.IO** microservice for location streaming and chat room isolation.
- [x] Live interactive ride tracking map with dynamic car marker and remaining distance/ETA updates.
- [x] Dual OTP verification protocol (Pickup OTP & Drop OTP) dispatched via Nodemailer.
- [x] In-ride real-time chat with **Google Gemini AI** context-aware, multilingual quick reply suggestions.
- [x] Automated revenue and commission splits (10% platform fee, 90% driver payout).
- [x] **Recharts** 7-day interactive earnings bar charts and KPI metrics for both Admin and Partners.
- [ ] Advance scheduled ride bookings.
- [ ] Automated partner instant payout withdrawals via Razorpay Route / Payouts.
- [ ] Push notifications & SMS alerts via Twilio / Firebase Cloud Messaging.

---

## 👤 Author
**Pratik Tiruwa**  
- GitHub: [@Pratik-Tiruwa](https://github.com/Pratik-Tiruwa)
