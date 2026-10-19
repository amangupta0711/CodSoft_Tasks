import { z } from "zod";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";
export type StudentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "GRADUATED";
export type TeacherStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type FeeCategory = "TUITION" | "LIBRARY" | "LABORATORY" | "SPORTS" | "EXAMINATION" | "ANNUAL" | "OTHER";
export type InvoiceStatus = "PAID" | "PARTIALLY_PAID" | "PENDING" | "OVERDUE";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "ONLINE_DEMO" | "CHEQUE" | "CARD";

// User Session
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  studentId?: string | null;
  teacherId?: string | null;
}

// Zod Validation Schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const studentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  studentId: z.string().min(3, "Student ID must be at least 3 characters"),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  classId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "GRADUATED"]).default("ACTIVE"),
  enrollmentDate: z.string().optional(),
});

export const teacherSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  teacherId: z.string().min(3, "Teacher ID must be at least 3 characters"),
  phone: z.string().optional().nullable(),
  department: z.string().min(2, "Department is required"),
  qualification: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]).default("ACTIVE"),
  joiningDate: z.string().optional(),
});

export const classSchema = z.object({
  name: z.string().min(2, "Class name is required (e.g., Grade 10)"),
  section: z.string().min(1, "Section is required (e.g., A)"),
  room: z.string().optional().nullable(),
  academicYear: z.string().default("2024-2025"),
  capacity: z.coerce.number().min(1).default(40),
  classTeacherId: z.string().optional().nullable(),
});

export const subjectSchema = z.object({
  code: z.string().min(2, "Subject code is required (e.g., CS-101)"),
  name: z.string().min(2, "Subject name is required"),
  description: z.string().optional().nullable(),
  credits: z.coerce.number().min(1).default(3),
  department: z.string().min(2, "Department is required"),
});

export const teacherAssignmentSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().optional().nullable(),
  academicYear: z.string().default("2024-2025"),
});

export const attendanceRecordSchema = z.object({
  studentId: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  remarks: z.string().optional().nullable(),
});

export const saveAttendanceSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  records: z.array(attendanceRecordSchema).min(1, "At least one student record is required"),
});

export const examinationSchema = z.object({
  name: z.string().min(2, "Examination name is required"),
  term: z.string().min(2, "Term is required (e.g., Semester 1)"),
  academicYear: z.string().default("2024-2025"),
  examDate: z.string().min(1, "Examination date is required"),
  maxMarks: z.coerce.number().min(1, "Max marks must be greater than 0"),
  passingMarks: z.coerce.number().min(1, "Passing marks must be greater than 0"),
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().min(1, "Subject is required"),
});

export const markEntrySchema = z.object({
  studentId: z.string().min(1),
  marksObtained: z.coerce.number().min(0, "Marks cannot be negative"),
  remarks: z.string().optional().nullable(),
});

export const saveExamResultsSchema = z.object({
  examinationId: z.string().min(1, "Examination ID is required"),
  entries: z.array(markEntrySchema).min(1, "At least one mark entry is required"),
});

export const feeInvoiceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  title: z.string().min(2, "Invoice title is required"),
  category: z.enum(["TUITION", "LIBRARY", "LABORATORY", "SPORTS", "EXAMINATION", "ANNUAL", "OTHER"]),
  totalAmount: z.coerce.number().min(1, "Total amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional().nullable(),
});

export const feePaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.coerce.number().min(1, "Payment amount must be greater than 0"),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "ONLINE_DEMO", "CHEQUE", "CARD"]).default("ONLINE_DEMO"),
  paymentDate: z.string().optional(),
  transactionRef: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
