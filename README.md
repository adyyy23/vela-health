# VELA Healthcare — Connected Discovery, Clinic Network & Patient Care Platform

> **VELA** is a portfolio-quality, multi-experience healthcare platform designed for modern clinic networks. It seamlessly bridges public healthcare discovery, patient mobile management, physician clinical workstations, and network-wide operations oversight.

---

## ✦ System Architecture & Experiences

VELA provides four distinct, dedicated role experiences sharing a unified real-time data layer:

| Experience | Target Form Factor | Core Responsibilities |
| :--- | :--- | :--- |
| **Public / Discovery** | Desktop & Mobile Web | Care Finder triage, interactive clinic maps (Leaflet/OSM), doctor directory, appointment booking wizard. |
| **Patient PWA** | Mobile-First PWA | Care Stream timeline, one-tap digital check-in, visit history, encrypted messaging, medical records/prescriptions. |
| **Doctor Workstation** | Desktop & Tablet | Inline operational indicator strip, Next Patient prioritization, 3-column clinical workspace, e-prescriptions. |
| **Admin Operations** | Desktop NOC | Real-time multi-clinic throughput Kanban board, stage transitions, credentialing, appointment auditing. |

---

## ✦ Visual Identity & Design System

The visual language follows an editorial clinical aesthetic inspired by high-end healthcare spaces:

- **Warm Ivory Canvas** (`#F5F6F1`): Organic, calming background replacing sterile hospital white.
- **Herbaceous Muted Sage** (`#526A5B` / `#3E5246`): Primary action and clinical guidance tint.
- **Deep Forest Slate** (`#17231D`): Dominant structural surfaces and high-contrast typography.
- **Surface Elevation** (`#FFFFFF`): Subtle single-pixel borders (`#E2E8E4`) without artificial shadow layers.
- **Corner Radii**: Standardized to buttons (`10px`), cards (`14px`), and major panels (`18px`).
- **Brand Mark**: Bespoke geometric emblem featuring an architectural **V** converging into a vitality beacon.

---

## ✦ Key Platform Features

### 1. Unified Appointment Lifecycle
- **Interactive Booking Wizard**: 10-step guided booking flow with real-time slot availability, specialty filters, and waitlist integration.
- **Rescheduling Engine**: Seamless slot replacement with automatic reconciliation and prior booking cancellation.
- **Digital Arrival & Check-In**: Instant arrival confirmation notifying reception desks and transitioning appointment stages across doctor and admin boards.
- **Post-Visit Verified Reviews**: 5-star clinical ratings and feedback collection tied to completed appointments.

### 2. Clinical Documentation Workspace
- Attending physician SOAP notes and structured examination records.
- Electronic prescription generation directly accessible from the patient document portal.
- Auto-transition from `IN_CONSULTATION` to `COMPLETED` with synchronization back to the physician schedule.

### 3. Synchronized Live Operations Board
- 5-column Kanban throughput: *Currently Checked In*, *Waiting in Lounge*, *In Consultation*, *Delayed/Pending*, and *Completed*.
- Direct stage transition controls for network administrators.

---

## ✦ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v3 with bespoke design tokens
- **Database**: SQLite (via `better-sqlite3`) with schema migrations & seed data
- **Mapping**: Leaflet & OpenStreetMap (`react-leaflet` with SSR boundary)
- **Icons**: Lucide React
- **Animations / Micro-interactions**: Canvas Confetti, CSS transitions

---

## ✦ Demo Accounts & Quick Switcher

Use the persistent **Demo Role Toolbar** in the bottom-right corner to test each experience:

| Role | Email | Password | Quick Link |
| :--- | :--- | :--- | :--- |
| **Public / Guest** | *Unauthenticated* | — | [`/`](http://localhost:3030/) |
| **Patient** | `patient@velahealth.com` | `PatientPass123!` | [`/patient`](http://localhost:3030/patient) |
| **Doctor** | `doctor@velahealth.com` | `DoctorPass123!` | [`/doctor`](http://localhost:3030/doctor) |
| **Administrator** | `admin@velahealth.com` | `AdminPass123!` | [`/admin`](http://localhost:3030/admin) |

---

## ✦ Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/adyyy23/vela-health.git
cd vela-health

# Install dependencies
npm install

# Start development server
npm run dev

# Or build and run production server
npm run build
npm start -- -p 3030
```

Open [http://localhost:3030](http://localhost:3030) to explore the application.

---

## ✦ License

MIT
