# EduManage — Centralized Student Management System (Pro)

EduManage is an enterprise-grade, full-stack educational management platform engineered for college administrations, faculty members, and enrolled students. Built for the **CodSoft Full-Stack Web Development Internship**, this solution eliminates manual paperwork and fragmented spreadsheets through a centralized, high-security digital workflow.

---

## 🌟 Key Highlights & Architecture

- **Frontend:** Next.js (App Router, React 18, TypeScript)
- **Styling & UI:** Tailwind CSS with custom **Navy Blue & Subtle Gold** palette, smooth transitions, responsive collapsible sidebar, and clean modals.
- **Backend:** Next.js API Route Handlers with Zod request validation and server-side role & ownership verification.
- **Database:** **PostgreSQL** relational database with **Prisma ORM** (models, foreign keys, unique constraints, and cascade policies).
- **Session Auth:** Secure HTTP-only JWT sessions with `bcryptjs` password hashing.
- **Data Visualizations:** Interactive `Recharts` graphs for weekly attendance velocity, academic grading spreads, and departmental enrollment.
- **Resilience:** Intelligent database connection handling with offline fallback store (`.data/edumanage-db.json`) ensuring 100% uptime during demo recordings while maintaining pure PostgreSQL as the primary production engine.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Access Scope & Permissions |
| :--- | :--- |
| **Administrator** | Full institutional control: Add, edit, view & delete students/teachers; manage classes & subjects; assign faculty; view attendance and academic outcomes; issue fee invoices and record payments; generate audit reports. |
| **Teacher** | Access assigned classroom cohorts & subjects; mark and review classroom attendance registers with duplicate prevention; submit and evaluate student examination scores; view class average/highest/lowest metrics. |
| **Student** | Strict read-only isolation: View personal student profile, real-time attendance percentage, verified examination score report cards, and fee invoice dues & payment receipts. Cannot alter grades or payment history. |

---

## 🔑 Demo Login Credentials

For local evaluation and internship demonstration:

| Role | Demo Email | Password | Primary Profile / Notes |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@edumanage.com` | `AdminPassword123!` | Dr. Robert Vance (Director) |
| **Teacher** | `teacher@edumanage.com` | `TeacherPassword123!` | Prof. Marcus Thorne (Computer Science) |
| **Student** | `student@edumanage.com` | `StudentPassword123!` | Alex Rivera (STU-2024-001) |

> **Pro Tip:** On the login page, you can click any of the **"Internship Demo Accounts"** quick-filler buttons (**Admin**, **Teacher**, or **Student**) to instantly populate the credentials. Once logged in, use the **Quick Demo Switcher** in the top navbar to seamlessly toggle between roles during your screen-recorded demonstration!

---

## 🛠️ Windows Installation & Execution Guide

### 1. Prerequisites
Ensure you have installed:
- **Node.js** (v18, v20, or v22+)
- **Git**

### 2. Clone & Install Dependencies
Open PowerShell or Command Prompt:
```powershell
# Navigate to the project root directory
cd "c:\Users\sachi\OneDrive\Desktop\All in One\New folder"

# Install production and development dependencies
npm install
```

### 3. PostgreSQL Database Setup (Choose Option A or B)

#### Option A: Docker (Fastest — 10 seconds)
```powershell
docker run --name edumanage-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=edumanage -p 5432:5432 -d postgres:16-alpine
```

#### Option B: Native Windows PostgreSQL / Cloud (Neon / Supabase)
1. Download and install PostgreSQL from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/).
2. Create a database named `edumanage`.
3. Update your connection string in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/edumanage?schema=public"
JWT_SECRET="edumanage_jwt_super_secure_secret_key_2026_codsoft_internship"
```

### 4. Push Schema & Seed Initial Records
```powershell
# Generate Prisma Client
npm run prisma:generate

# Push schema directly to PostgreSQL
npm run prisma:push

# Run seed script to populate users, classes, subjects, attendance & invoices
npm run prisma:seed
```

### 5. Run Automated Tests
```powershell
npm test
```
*Validates password hashing, grading logic (A+, A, B, C, D, F), fee balance calculations, duplicate attendance prevention, and mark boundary validation.*

### 6. Start the Development Server
```powershell
npm run dev
```
Open your browser at **[http://localhost:3000](http://localhost:3000)**.

### 7. Production Build (Optional)
```powershell
npm run build
npm start
```

---

## 📁 Project Structure

```
edumanage/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend API Route Handlers
│   │   ├── auth/                 # Login, Logout, Session check
│   │   ├── dashboard/            # Role-specific real-time metrics
│   │   ├── database/             # PostgreSQL connection status
│   │   ├── students/             # Student CRUD operations
│   │   ├── teachers/             # Teacher CRUD operations
│   │   ├── classes/              # Class & Cohort management
│   │   ├── subjects/             # Subject syllabus management
│   │   ├── assignments/          # Faculty classroom assignments
│   │   ├── attendance/           # Daily register & history
│   │   ├── examinations/         # Exam scheduling
│   │   ├── results/              # Score grading & calculations
│   │   └── fees/                 # Invoices & payment receipts
│   ├── dashboard/                # Dashboards (admin, teacher, student)
│   ├── students/                 # Student list & profile views
│   ├── teachers/                 # Teacher directory
│   ├── classes/                  # Class & subject manager
│   ├── attendance/               # Attendance marking sheet
│   ├── examinations/             # Exam & grading center
│   ├── fees/                     # Financial ledger & receipt issuer
│   ├── reports/                  # Institutional audit reports
│   ├── login/                    # Secure authentication page
│   ├── layout.tsx                # Global HTML wrapper & metadata
│   └── globals.css               # Design system & custom CSS
├── components/
│   ├── layout/                   # Sidebar, Navbar, DashboardLayout
│   ├── common/                   # DbSetupModal
│   └── ui/                       # Modal dialog, Toast notifications
├── lib/
│   ├── auth.ts                   # JWT session & bcrypt utilities
│   ├── db.ts                     # Database service layer & queries
│   ├── initial-data.ts           # Comprehensive seed dataset
│   ├── prisma.ts                 # Prisma singleton & health checks
│   └── types.ts                  # Zod validation schemas & interfaces
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema with relational constraints
│   └── seed.ts                   # Database population script
├── tests/
│   └── api-tests.js              # Automated backend test suite
├── package.json
└── README.md
```

---

## 🛡️ Database Constraints & Business Rules

1. **Unique Identity:** `studentId` and `teacherId` are strictly unique across the institution.
2. **Attendance Integrity:** Enforces `@@unique([studentId, classId, date])` to guarantee no duplicate attendance records can ever exist for the same student on the same date.
3. **Examination Results:** Enforces `@@unique([examinationId, studentId])`. Marks are validated so that $0 \le \text{marksObtained} \le \text{maxMarks}$.
4. **Fee Balance Calculation:** Invoices compute remaining balance as $\text{balance} = \text{totalAmount} - \text{paidAmount}$. Payments cannot exceed outstanding balances.
5. **Configurable Grading Policy:**
   - **A+**: 90% – 100%
   - **A**: 80% – 89.9%
   - **B**: 70% – 79.9%
   - **C**: 60% – 69.9%
   - **D**: 50% – 59.9%
   - **F**: < 50%

---

## 🎥 Demonstration Video Walkthrough Tips

1. **Start at Login:** Show the clean design, toggle the password visibility, and use the demo credentials button.
2. **Admin Dashboard:** Highlight real KPI cards (derived dynamically from database records) and interactive Recharts attendance curves.
3. **Student CRUD:** Add a new student, filter by class, search by name, edit details, and open their profile card.
4. **Attendance Marking:** Select a class, pick today's date, click "Mark All Present", change one student to "Late" with a delay remark, and save with the transaction button.
5. **Exam Grading:** Switch to examinations, adjust marks for a student, and observe the instant letter grade computation.
6. **Fee Payment:** Issue an invoice, record a partial payment, and demonstrate remaining balance calculation and receipt generation.
7. **Role Verification:** Use the top-right Quick Switcher to log into the **Teacher** account (confirm restricted view) and **Student** account (confirm student only sees their own marks, attendance, and fees).
8. **PostgreSQL Pill:** Click the top database pill to show the active PostgreSQL integration modal.
#   C o d S o f t _ T a s k s  
 