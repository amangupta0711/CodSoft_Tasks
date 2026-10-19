# EduManage — Centralized Student Management System

EduManage is a full-stack educational management platform designed to simplify academic and administrative operations for colleges and educational institutions. Developed as part of the **CodSoft Full-Stack Web Development Internship**, it brings student records, faculty management, attendance, examinations, and fee tracking into one centralized application.

---

## 🌟 Key Features

- **Role-Based Dashboards:** Separate interfaces for administrators, teachers, and students.
- **Student Management:** Add, view, update, and manage student records.
- **Teacher Management:** Maintain faculty information and manage teaching assignments.
- **Class & Subject Management:** Organize classes, subjects, and faculty assignments.
- **Attendance Tracking:** Record and review student attendance.
- **Examination & Results:** Manage examinations, student marks, and academic results.
- **Fee Management:** Maintain fee invoices, record payments, and track outstanding balances.
- **Reports:** Access academic and administrative information through reports.
- **Authentication:** Login and session management with role-based access control.
- **Responsive Interface:** Dashboard layouts, navigation, forms, and reusable UI components.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack web application framework |
| React | User interface development |
| TypeScript | Type-safe application development |
| Tailwind CSS | Styling and responsive layouts |
| Prisma ORM | Database schema and data access |
| PostgreSQL | Relational database |
| bcryptjs | Password hashing |
| JWT | Session authentication |
| Zod | Request validation |
| Recharts | Data visualizations |

---

## 👥 User Roles

### Administrator
- Manage student and teacher records.
- Organize classes and subjects.
- Assign faculty to classes.
- Review attendance and examination results.
- Manage fee invoices and payments.
- Access administrative reports.

### Teacher
- Access assigned classes and subjects.
- Record and review student attendance.
- Manage examination scores.
- Review academic performance.

### Student
- View personal profile information.
- Check attendance records.
- View examination results.
- Review fee invoices and payment information.

*Access depends on the permissions implemented in the application.*

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js (compatible with the project's dependencies)
- npm
- Git
- PostgreSQL, if using the PostgreSQL database configuration

### 1. Clone the Repository

```bash
git clone https://github.com/amangupta0711/CodSoft_Tasks.git
```

### 2. Navigate to the Project

```powershell
cd "CodSoft_Tasks/Student Management System"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project directory using `.env.example` as a reference.

Configure the required database connection and authentication variables. For example:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="replace_with_a_secure_random_secret"
```

Use the actual variable names required by the application. Never commit your `.env` file, database passwords, or production secrets to GitHub.

### 5. Configure the Database

Ensure that your database is running and that `DATABASE_URL` points to the correct database.

Generate the Prisma Client:

```bash
npm run prisma:generate
```

Apply the database schema:

```bash
npm run prisma:push
```

If the project includes a seed script and you want to load demo data, run:

```bash
npm run prisma:seed
```

### 6. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal, typically:

`http://localhost:3000`

### 7. Run Tests

If the test script is configured in `package.json`, run:

```bash
npm test
```

### 8. Create a Production Build

```bash
npm run build
```

Start the production server using the configured start script:

```bash
npm start
```

---

## 📁 Project Structure

```text
Student Management System/
├── app/
│   ├── api/
│   │   ├── assignments/
│   │   ├── attendance/
│   │   ├── auth/
│   │   ├── classes/
│   │   ├── dashboard/
│   │   ├── examinations/
│   │   ├── fees/
│   │   ├── results/
│   │   ├── students/
│   │   ├── subjects/
│   │   └── teachers/
│   ├── dashboard/
│   ├── students/
│   ├── teachers/
│   ├── attendance/
│   ├── examinations/
│   ├── fees/
│   ├── reports/
│   ├── login/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── initial-data.ts
│   ├── prisma.ts
│   └── types.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
├── public/
├── .env.example
├── package.json
├── package-lock.json
├── next.config.mjs
├── tailwind.config.ts
└── README.md
```

*The structure above summarizes the expected main directories; optional folders may differ in your local copy.*

---

## 🔐 Security & Data Integrity

The application is designed around role-based access and reliable academic records.

- Password hashing for authentication.
- Server-side validation of
