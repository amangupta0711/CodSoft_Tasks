# DineDesk — Full-Stack Restaurant Ordering & Table Management Platform

**DineDesk** is a production-grade, full-stack restaurant ordering and table management platform built for the **CodSoft Full-Stack Web Development Internship (Task 2)**.

DineDesk connects customers, kitchen staff, and restaurant managers into a unified digital ecosystem. It eliminates manual order-taking errors, streamlines live kitchen coordination, and guarantees conflict-free table reservations.

---

## 🌟 Key Features

### 1. Customer Dining Experience
- **Digital Food Menu**: Filter by food category, pure vegetarian toggle, real-time search by dish name, and sorting by popularity or price.
- **Dynamic Shopping Cart**: Real-time quantity steppers, item removal, persistent cart across page navigation and reloads.
- **Transparent Pricing**: Automatic subtotal calculation, 5% GST restaurant tax, and configurable delivery fees.
- **Express Checkout**: Select Doorstep Delivery or Restaurant Takeaway, enter contact details, and choose Cash on Delivery, Pay at Counter, or Simulated Online Payment.
- **Live Order Tracking**: Real-time order progress timeline (`Pending` → `Confirmed` → `Preparing` → `Ready` → `Out for Delivery` / `Ready for Pickup` → `Completed`) with auto-polling every 10 seconds.
- **Customer Cancellation**: Self-service cancellation for orders that have not yet entered kitchen preparation.
- **Table Reservations**: Select date, time slot, and guest count with **real-time table conflict prevention** (prevents double bookings).

### 2. Kitchen Display System (KDS)
- **Live Ticket Dashboard**: Real-time incoming tickets displaying order number, ordered dishes, quantities, elapsed prep timer, and highlighted customer special requests.
- **Operational Status Stepper**: Move orders seamlessly from `Pending` → `Confirmed` → `Preparing` → `Ready` → `Dispatched / Completed`.
- **Delay Warnings**: Visual indicator badges for tickets waiting longer than 25 minutes.

### 3. Administrator & Management Portal
- **Executive Analytics**: Real-time recorded sales revenue, today's order count, pending tickets, and upcoming table reservations.
- **Interactive Charts**: Recharts-powered 7-day revenue trend area chart and top-selling dishes horizontal bar chart.
- **Menu CRUD Operations**: Create new dishes with custom prices and Unsplash imagery, update pricing and descriptions, toggle in-stock/sold-out status, and archive dishes without breaking historical order snapshots.
- **Order Management Table**: Search orders by reference number, filter by status, and update permitted order stages.
- **Reservation Management**: View all table bookings, seat arriving diners, and manage cancellations.

### 4. Enterprise Security & Architecture
- **Server-Side Authorization**: Enforces role checks (`CUSTOMER`, `STAFF`, `ADMIN`) on API endpoints and server routes.
- **Secure Password Hashing**: Passwords hashed using bcrypt with salt rounds.
- **Session Handling**: JWT-signed session stored in secure `HttpOnly`, `SameSite=Lax` cookies.
- **Zod Data Validation**: Robust schema validation for authentication, order placement, table booking, and menu editing.
- **Authoritative Server Pricing**: Client totals are never trusted; the server re-validates item availability and calculates line items, taxes, and fees directly from the database.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Bespoke Restaurant Color Palette (Cream, Forest Green, Amber Gold) |
| **Backend** | Next.js Route Handlers (Node.js) |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM |
| **Authentication** | Session-based JWT with bcrypt password hashing in HttpOnly cookies |
| **Validation** | Zod |
| **Icons & Charts** | Lucide React, Recharts |

---

## 🔑 Demo Testing Accounts

DineDesk includes pre-seeded demo accounts. The login page also features **1-Click Instant Login Buttons** for seamless presentation and video recording:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@dinedesk.com` | `Customer@123` | Digital menu, cart, checkout, order tracking, personal reservations |
| **Kitchen Staff** | `kitchen@dinedesk.com` | `Kitchen@123` | Kitchen Display System (`/kitchen`), order status progression |
| **Administrator** | `admin@dinedesk.com` | `Admin@123` | Executive dashboard (`/admin`), menu CRUD, all orders, all reservations |

---

## ⚙️ Windows Setup & Installation

### Prerequisites
- **Node.js** (v18.x or v20+ / v24+) and **npm** installed.
- **PostgreSQL Database**: You can use a local PostgreSQL server (port 5432) or a free managed cloud database like [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app).

### Step 1: Clone or Navigate to Project
```bash
cd Codsoft_Task2
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

Edit `.env` with your PostgreSQL connection URL:
```env
# Example for Local PostgreSQL:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/dinedesk?schema=public"

# Example for Managed Cloud PostgreSQL (Neon / Supabase):
DATABASE_URL="postgresql://user:password@ep-sample-host.neon.tech/dinedesk?sslmode=require"

JWT_SECRET="dinedesk-ultra-secure-jwt-secret-key-32charsmin-2026"
NEXT_PUBLIC_APP_NAME="DineDesk"
NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
NEXT_PUBLIC_DELIVERY_FEE="40"
NEXT_PUBLIC_TAX_RATE="0.05"
```

> **Note on Out-of-the-Box Fallback**: If PostgreSQL is not yet configured on your machine, DineDesk includes an automatic persistent local store fallback (`.data/store.json`) pre-populated with identical seed data, allowing you to run, test, and demonstrate the entire platform immediately without crashing!

### Step 4: Run Prisma Migrations and Seed Database
Generate the Prisma Client:
```bash
npm run prisma:generate
```

Push schema to PostgreSQL:
```bash
npm run prisma:push
```

Seed the database with rich categories, dishes, tables, and demo users:
```bash
npm run prisma:seed
```

### Step 5: Run Automated Verification Tests
Run the comprehensive test suite to verify business logic, pricing math, and conflict prevention:
```bash
npm test
```

### Step 6: Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Step 7: Build for Production
To create an optimized production build:
```bash
npm run build
npm start
```

---

## 📊 Relational Database Schema (Prisma)

The application models relational data with strict constraints and historical preservation:

- **`User`**: Manages customer profiles, staff, and administrators with role-based attributes.
- **`MenuCategory`**: Organizes dishes into appetizers, mains, pizza & pasta, burgers, desserts, and beverages.
- **`MenuItem`**: Stores dishes with pricing, preparation time, pure vegetarian status, chef pick flag, and soft-delete archive flag (`isArchived`).
- **`RestaurantTable`**: Configures physical restaurant tables with capacity and dining hall locations.
- **`Reservation`**: Unique composite constraint `@@unique([tableId, reservationDate, timeSlot])` preventing overlapping or conflicting bookings.
- **`Order`**: Tracks lifecycle status, payment details, customer recipient info, and delivery address.
- **`OrderItem`**: **Stores a historical snapshot** of dish name and unit price at time of purchase so historical receipts never change if the menu prices are updated later.
- **`PaymentRecord`**: Relational record of simulated payments or cash transaction references.

---

## 🧪 Verified Workflows

The test suite (`npm test`) and browser subagent verified all core flows:
1. **Customer Workflow**: Browse categorized menu → filter pure vegetarian dishes → add to cart → adjust quantities → complete checkout → receive order number → track order timeline.
2. **Kitchen Workflow**: Authenticate as kitchen staff → view incoming ticket with special notes → confirm ticket → start preparation → mark ready → dispatch for delivery.
3. **Table Reservation Workflow**: Select party size, date and time → select available table → receive booking reference `RES-YYYYMMDD-XXXX` → verified that submitting a second booking for the same table and time slot is blocked with a 400 conflict error.
4. **Admin Workflow**: View live revenue and order metrics → inspect 7-day sales charts → add/edit dishes → toggle availability → update reservation statuses.

---

## 📄 License
Created for the **CodSoft Full-Stack Web Development Internship**.
All demo photography sourced from Unsplash with appropriate permissive usage.
