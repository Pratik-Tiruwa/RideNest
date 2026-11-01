# 🚗 RideNest - Smart Vehicle Rental & Partner Onboarding Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v5_Beta-purple?style=for-the-badge&logo=auth0)](https://authjs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![ZegoCloud](https://img.shields.io/badge/ZegoCloud-Video_KYC-0055FF?style=for-the-badge)](https://www.zegocloud.com/)

**RideNest** is a full-stack, enterprise-grade vehicle rental ecosystem and partner management platform. It offers an end-to-end multi-step partner onboarding workflow, role-based dashboards (User, Partner, and Admin), real-time video KYC verification, Cloudinary document management, an animated administration metrics panel, a full-featured admin partner review & approval suite, and real-time review status tracking for onboarding partners.

---

## 🌟 Key Features Implemented

### 🔐 1. Authentication & Role-Based Authorization
- **NextAuth.js v5 (Beta)**: Credentials authentication and Google OAuth integration.
- **Email OTP Verification**: 6-digit email OTP dispatch via **Nodemailer** for user registration and verification.
- **Dynamic JWT Role Synchronization**: Real-time JWT session callback synchronizes updated database roles (`user`, `partner`, `admin`) to eliminate stale tokens.
- **Role-Based Dynamic Layout**:
  - `user` ➔ **Public Home** (Hero, vehicle sliders, rental catalog, booking flow).
  - `partner` ➔ **Partner Onboarding & Partner Dashboard**.
  - `admin` ➔ **Admin Metrics Dashboard** with isolated standalone navigation.

---

### 📋 2. Comprehensive Partner Onboarding Lifecycle
An interactive 8-stage onboarding stepper with dynamic progress tracking and state-dependent access control:

1. **Vehicle Registration (`/partner/onboarding/vehicle`)**:
   - Vehicle type selector (Bike, Scooty, Car, Luxury), model, and registration number.
   - Regex validation and uppercase number formatting.
   - Automatic prefetching and prefilling of existing vehicles with update support.
2. **Document Upload & Verification (`/partner/onboarding/documents`)**:
   - Upload fields for **Aadhar Card**, **Driving License**, and **Vehicle RC**.
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
   - **Partner Dashboard Call Alert (`ActionCard.tsx`)**: Shows dynamic *"Admin Started Video KYC"* card with a direct *"Join Call"* action button.
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

### 📊 3. Admin Panel & Metric Analytics
- **Live Statistics API (`/api/admin/dashboard`)**:
  - Total Partners count.
  - Approved, Pending, and Rejected partner status counts.
  - Review queue mapping pending partner applications with registered vehicle details.
- **Animated KPI Metric Cards (`Kpi.tsx`)**:
  - Built with `motion/react` with spring physics (`stiffness: 300, damping: 20`).
  - Interactive hover rotation (`-6deg`) and scale (`1.1`) on icon containers.
  - Themed variants (`totalPartners`, `approved`, `pending`, `rejected`).
  - Subtle backdrop glow animations on hover.
- **Review Queue Management (`ContentList.tsx` & `TabButton.tsx`)**:
  - Responsive review tabs with animated count badges for **Partner**, **Video KYC**, and **Vehicle** reviews.
  - Clean queue cards displaying partner avatar initials, email, registered vehicle preview, and direct review triggers.
  - Empty-state visual cards when queues are fully cleared.

---

### 🔍 4. Admin Partner Review & Approval Suite (`/admin/reviews/partner/[id]`)
- **Review Hub Header**: Sticky top navigation with back routing, partner details, and dynamic status badges (`Approved`, `Rejected`, `Pending`).
- **Interactive Document Previews (`DocPreview.tsx`)**:
  - Supports image and PDF preview rendering with modal viewer.
  - Displays uploaded Aadhaar Card, Driving License, and Vehicle RC.
- **Animated Vehicle & Bank Details Cards (`AnimatedCard.tsx`)**:
  - Vehicle details card showing vehicle type, model name, and registration number.
  - Bank details card showing account holder name, account number, IFSC code, and UPI ID.
- **Approval & Rejection Action Modals**:
  - Backdrop-blurred confirmation dialogs built with Framer Motion `AnimatePresence`.
  - Rejection modal requires admin reason input, stored in the database.
  - Dynamic loading spinners and button disabling to prevent race conditions during submission.
- **Backend Endpoints**:
  - `GET /api/admin/reviews/partner/[id]`: Fetches complete partner profile, vehicle data, uploaded KYC documents, and bank details.
  - `POST /api/admin/reviews/partner/[id]/approve`: Approves partner application and advances onboarding steps.
  - `POST /api/admin/reviews/partner/[id]/reject`: Sets partner status to rejected and records the rejection reason.

---

### 🚗 5. Admin Vehicle Review & Approval Suite (`/admin/reviews/vehicle/[id]`)
- **Review Page Layout**:
  - Sticky glassmorphic header with partner profile, back button, and dynamic status pills (`Approved`, `Rejected`, `Pending`).
  - Vehicle image showcase with Framer Motion entry and `object-contain` scaling to display uncropped vehicle previews.
- **Vehicle Specifications Card**:
  - Displays vehicle type, model name, registration number, and **Vehicle Color**.
- **Pricing Configuration Card**:
  - Real-time display of partner rates: **Base Fare**, **Price Per KM**, and **Waiting Charge** formatted with Indian Rupee currency notation.
- **Interactive Action Dialogs**:
  - **Approve Vehicle**: Triggers approval modal with confirmation and loading spinner.
  - **Reject Vehicle**: Triggers rejection modal requiring admin feedback and rejection reason.
- **Backend Endpoints**:
  - `GET /api/admin/reviews/vehicle/[id]`: Fetches complete vehicle details with populated owner profile.
  - `GET /api/admin/reviews/vehicle/[id]/approve`: Approves vehicle, resets rejection reason, and advances partner onboarding step to 7.
  - `POST /api/admin/reviews/vehicle/[id]/reject`: Sets vehicle status to `rejected` and stores admin rejection reason.
- **Dashboard Review Queue Filtering**:
  - `GET /api/admin/dashboard` filters `pendingVehicles` with `baseFare: { $exists: true }` to ensure only vehicles with submitted pricing appear in the admin queue.

---

### 🎨 5. Design System & Frontend Architecture
- **Tailwind CSS v4**: Modern CSS theme with glassmorphism (`backdrop-blur`), refined color palettes, and fluid layouts.
- **Redux Toolkit (`@reduxjs/toolkit`)**: Global client-side state management for user profile and active onboarding step hydration (`useGetMe`).
- **Framer Motion Micro-Interactions**: Smooth state transitions, tap effects (`whileTap={{ scale: 0.97 }}`), and animated modals.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), Vanilla CSS |
| **Animations** | [Framer Motion / Motion](https://motion.dev/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/), [React-Redux](https://react-redux.js.org/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/), [Mongoose 9](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v5 Beta](https://authjs.dev/), [Bcrypt](https://www.npmjs.com/package/bcrypt) |
| **Cloud Storage** | [Cloudinary SDK](https://cloudinary.com/) |
| **Video Calling** | [ZegoCloud UIKit](https://www.zegocloud.com/) |
| **Mailing** | [Nodemailer](https://nodemailer.com/) |
| **Icons** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |

---

## 📂 Project Structure

```text
ridenest/
├── public/                      # Static assets (logo_primary.png, vehicles, etc.)
├── src/
│   ├── app/
│   │   ├── admin/reviews/
│   │   │   ├── partner/[id]/    # Admin partner document review page
│   │   │   └── vehicle/[id]/    # Admin vehicle & pricing review page
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/   # Admin metrics & review queue API
│   │   │   │   ├── reviews/
│   │   │   │   │   ├── partner/[id]/ # Partner review, approve, reject endpoints
│   │   │   │   │   └── vehicle/[id]/ # Vehicle review, approve, reject endpoints
│   │   │   │   └── video-kyc/   # Video KYC start, pending & complete endpoints
│   │   │   ├── auth/            # NextAuth, email verification & registration
│   │   │   ├── partner/
│   │   │   │   ├── onboarding/
│   │   │   │   │   ├── bank/    # Partner bank details API
│   │   │   │   │   ├── documents/ # Document upload (Aadhar, License, RC) API
│   │   │   │   │   ├── pricing/ # Vehicle pricing, color & image upload API
│   │   │   │   │   └── vehicle/ # Vehicle registration & details API
│   │   │   │   └── video-kyc/request/ # Video KYC re-request endpoint
│   │   │   └── user/me/         # Current user profile endpoint
│   │   ├── partner/onboarding/
│   │   │   ├── bank/            # Bank details form page
│   │   │   ├── documents/       # Document upload form page
│   │   │   └── vehicle/         # Vehicle registration page
│   │   ├── video-kyc/[roomId]/  # Live 1-on-1 ZegoCloud video KYC room
│   │   ├── layout.tsx           # Root layout with Redux & Session providers
│   │   └── page.tsx             # Role-based conditional home router
│   ├── components/
│   │   ├── AdminDashboard.tsx   # Admin dashboard view
│   │   ├── AnimatedCard.tsx     # Reusable Framer Motion hover card
│   │   ├── AuthModel.tsx        # Login & Signup modal dialog
│   │   ├── ContentList.tsx      # Admin review queues list & action cards
│   │   ├── DocPreview.tsx       # Document preview component (Image & PDF)
│   │   ├── Footer.tsx           # Global application footer
│   │   ├── HeroSection.tsx      # Landing page hero banner
│   │   ├── Kpi.tsx              # Animated metric KPI card
│   │   ├── Navbar.tsx           # Top navigation bar
│   │   ├── PartnerDashboard.tsx # 8-step onboarding stepper dashboard
│   │   ├── PricingModel.tsx     # Step 6 modal for pricing rates, color & image upload
│   │   ├── PublicHome.tsx       # Customer home view
│   │   ├── RejectionCard.tsx    # Step 4 rejection alert card with reason & retry
│   │   ├── StatusCard.tsx       # Step 4 pending review status indicator card
│   │   ├── TabButton.tsx        # Animated review queue tab navigation button
│   │   └── VehicleSlider.tsx    # Interactive vehicle catalog slider
│   ├── hooks/
│   │   └── useGetMe.tsx         # Hook to fetch and hydrate user state
│   ├── lib/
│   │   ├── cloudinary.ts        # Cloudinary buffer upload configuration
│   │   ├── db.ts                # MongoDB connection utility
│   │   ├── Provider.tsx         # Combined providers wrapper
│   │   └── sendMail.ts          # Nodemailer OTP email dispatcher
│   ├── models/
│   │   ├── partnerBank.model.ts # Mongoose schema for partner bank info
│   │   ├── partnerDocs.model.ts # Mongoose schema for partner KYC documents
│   │   ├── user.model.ts        # User model with roles, partnerStatus & rejectionReason
│   │   └── vehicle.model.ts     # Registered vehicle schema
│   ├── redux/
│   │   ├── store.ts             # Redux central store
│   │   └── userSlice.ts         # User & onboarding state slice
│   └── auth.ts                  # NextAuth v5 configuration & JWT callbacks
├── package.json
└── README.md
```

---

## 🗄️ Database Schemas Summary

- **`User`**: Core user entity storing credentials, role (`user` \| `partner` \| `admin`), `partnerStatus` (`pending` \| `approved` \| `rejected`), `rejectionReason`, `partnerOnBoardingSteps` (1 to 8), `videoKycStatus` (`pending` \| `approved` \| `rejected` \| `in_progress`), `videoKycRoomId`, `videoKycRejectionReason`, OTP, and mobile number.
- **`Vehicle`**: Partner vehicle profile tracking `owner` reference, vehicle type (`bike`, `car`, `loading`, `truck`, `auto`), model name, registration number, `color`, `imageUrl`, pricing rates (`baseFare`, `pricePerKM`, `waitingCharge`), `status` (`approved` \| `pending` \| `rejected`), `rejectionReason`, and `isActive` flag.
- **`PartnerDocs`**: KYC documents storing Cloudinary URLs for Aadhar Card, Driving License (`licenseUrl`), and Vehicle RC, along with review status.
- **`PartnerBank`**: Financial payout profile containing account holder name, bank account number, IFSC code, and UPI ID.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.18 or higher recommended)
- **MongoDB** instance (local or MongoDB Atlas)
- **Cloudinary** account (for document uploads)
- **ZegoCloud** developer account (for Video KYC)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Pratik-Tiruwa/RideNest.git
cd ridenest
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following keys:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3008

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ZegoCloud Video KYC
NEXT_PUBLIC_ZEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_zego_server_secret
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3008](http://localhost:3008) in your browser to view the application.

---

## 🛣️ Roadmap & Upcoming Work
- [x] Complete Partner Document Approval / Rejection actions inside Admin Panel.
- [x] Video KYC scheduling, real-time room call initiation, and Admin verification workflow.
- [x] Vehicle pricing configuration, image upload, and Admin vehicle approval/rejection suite.
- [ ] Vehicle search, geolocation filters, and instant booking system for customers.
- [ ] Payment gateway integration (Razorpay / Stripe) for rental deposits and payments.
- [ ] Partner earnings dashboard and payout management.

---

## 👤 Author
**Pratik Tiruwa**  
- GitHub: [@Pratik-Tiruwa](https://github.com/Pratik-Tiruwa)
