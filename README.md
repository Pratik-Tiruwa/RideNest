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
4. **Partner Dashboard & Review Status (`PartnerDashboard.tsx`)**:
   - **Interactive Stepper Dashboard**: Animated progress bar and step indicators powered by **Framer Motion**.
   - **Documents Under Review (`StatusCard.tsx`)**: Renders dynamically on Step 4 when `partnerStatus === "pending"`, alerting the partner that the admin is reviewing documents.
   - **Rejection & Resubmission (`RejectionCard.tsx`)**: Renders dynamically on Step 4 when `partnerStatus === "rejected"`, displaying the admin's exact rejection reason with an interactive *"Review and Update"* action button to edit and resubmit.
5. **Live Video KYC (`/zego`)**:
   - 1-on-1 real-time video verification powered by `@zegocloud/zego-uikit-prebuilt`.
6. **Upcoming Steps**: Pricing configuration, Final Review, and Live account activation.

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
│   │   ├── admin/reviews/partner/[id]/ # Admin partner review page
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/   # Admin metrics & review queue API
│   │   │   │   └── reviews/partner/[id]/
│   │   │   │       ├── approve/ # Approve partner review API
│   │   │   │       ├── reject/  # Reject partner review API
│   │   │   │       └── route.ts # Fetch partner details for review
│   │   │   ├── auth/            # NextAuth, email verification & registration
│   │   │   ├── partner/onboarding/
│   │   │   │   ├── bank/        # Partner bank details API
│   │   │   │   ├── documents/   # Document upload (Aadhar, License, RC) API
│   │   │   │   └── vehicle/     # Vehicle registration & details API
│   │   │   └── user/me/         # Current user profile endpoint
│   │   ├── partner/onboarding/
│   │   │   ├── bank/            # Bank details form page
│   │   │   ├── documents/       # Document upload form page
│   │   │   └── vehicle/         # Vehicle registration page
│   │   ├── zego/                # ZegoCloud video KYC verification page
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

- **`User`**: Core user entity storing credentials, role (`user` \| `partner` \| `admin`), `partnerStatus` (`pending` \| `approved` \| `rejected`), `rejectionReason`, `partnerOnBoardingSteps` (1 to 8), OTP, and mobile number.
- **`Vehicle`**: Partner vehicle profile tracking `owner` reference, vehicle type (`bike`, `scooty`, `car`, `luxury`), registration number, and model name.
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
- [ ] Video KYC scheduling and Admin room joining workflow.
- [ ] Vehicle search, geolocation filters, and instant booking system for customers.
- [ ] Payment gateway integration (Razorpay / Stripe) for rental deposits and payments.
- [ ] Partner earnings dashboard and payout management.

---

## 👤 Author
**Pratik Tiruwa**  
- GitHub: [@Pratik-Tiruwa](https://github.com/Pratik-Tiruwa)
