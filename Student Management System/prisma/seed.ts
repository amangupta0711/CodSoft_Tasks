import { PrismaClient } from "@prisma/client";
import { getInitialSeedData } from "../lib/initial-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding EduManage PostgreSQL Database...");
  const data = getInitialSeedData();

  // Clear existing records in proper reverse-relational order
  console.log("Cleaning up existing tables...");
  await prisma.feePayment.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.result.deleteMany();
  await prisma.examination.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.teacherAssignment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating Users...");
  for (const u of data.users) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        passwordHash: u.passwordHash,
        name: u.name,
        role: u.role as any,
        avatar: u.avatar,
      },
    });
  }

  console.log("Creating Teachers...");
  for (const t of data.teachers) {
    await prisma.teacher.create({
      data: {
        id: t.id,
        teacherId: t.teacherId,
        fullName: t.fullName,
        email: t.email,
        phone: t.phone,
        department: t.department,
        qualification: t.qualification,
        joiningDate: new Date(t.joiningDate),
        status: t.status as any,
        userId: t.userId,
        avatar: t.avatar,
      },
    });
  }

  console.log("Creating Classes...");
  for (const c of data.classes) {
    await prisma.class.create({
      data: {
        id: c.id,
        name: c.name,
        section: c.section,
        room: c.room,
        academicYear: c.academicYear,
        capacity: c.capacity,
        classTeacherId: c.classTeacherId,
      },
    });
  }

  console.log("Creating Subjects...");
  for (const s of data.subjects) {
    await prisma.subject.create({
      data: {
        id: s.id,
        code: s.code,
        name: s.name,
        description: s.description,
        credits: s.credits,
        department: s.department,
      },
    });
  }

  console.log("Creating Teacher Assignments...");
  for (const ta of data.teacherAssignments) {
    await prisma.teacherAssignment.create({
      data: {
        id: ta.id,
        teacherId: ta.teacherId,
        classId: ta.classId,
        subjectId: ta.subjectId,
        academicYear: ta.academicYear,
      },
    });
  }

  console.log("Creating Students...");
  for (const s of data.students) {
    await prisma.student.create({
      data: {
        id: s.id,
        studentId: s.studentId,
        fullName: s.fullName,
        email: s.email,
        phone: s.phone,
        dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth) : null,
        gender: s.gender,
        address: s.address,
        status: s.status as any,
        enrollmentDate: new Date(s.enrollmentDate),
        userId: s.userId,
        currentClassId: s.currentClassId,
        avatar: s.avatar,
      },
    });
  }

  console.log("Creating Enrollments...");
  for (const e of data.enrollments) {
    await prisma.enrollment.create({
      data: {
        id: e.id,
        studentId: e.studentId,
        classId: e.classId,
        academicYear: e.academicYear,
      },
    });
  }

  console.log("Creating Attendance Records...");
  for (const a of data.attendance) {
    await prisma.attendance.create({
      data: {
        id: a.id,
        studentId: a.studentId,
        classId: a.classId,
        date: new Date(a.date),
        status: a.status as any,
        remarks: a.remarks,
        markedById: a.markedById,
      },
    });
  }

  console.log("Creating Examinations...");
  for (const ex of data.examinations) {
    await prisma.examination.create({
      data: {
        id: ex.id,
        name: ex.name,
        term: ex.term,
        academicYear: ex.academicYear,
        examDate: new Date(ex.examDate),
        maxMarks: ex.maxMarks,
        passingMarks: ex.passingMarks,
        classId: ex.classId,
        subjectId: ex.subjectId,
        createdById: ex.createdById,
      },
    });
  }

  console.log("Creating Results...");
  for (const r of data.results) {
    await prisma.result.create({
      data: {
        id: r.id,
        examinationId: r.examinationId,
        studentId: r.studentId,
        marksObtained: r.marksObtained,
        percentage: r.percentage,
        grade: r.grade,
        remarks: r.remarks,
        gradedById: r.gradedById,
      },
    });
  }

  console.log("Creating Fee Invoices...");
  for (const inv of data.feeInvoices) {
    await prisma.feeInvoice.create({
      data: {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        studentId: inv.studentId,
        title: inv.title,
        category: inv.category as any,
        totalAmount: inv.totalAmount,
        paidAmount: inv.paidAmount,
        balance: inv.balance,
        dueDate: new Date(inv.dueDate),
        status: inv.status as any,
        issuedDate: new Date(inv.issuedDate),
        notes: inv.notes,
      },
    });
  }

  console.log("Creating Fee Payments...");
  for (const p of data.feePayments) {
    await prisma.feePayment.create({
      data: {
        id: p.id,
        receiptNumber: p.receiptNumber,
        invoiceId: p.invoiceId,
        amount: p.amount,
        paymentDate: new Date(p.paymentDate),
        paymentMethod: p.paymentMethod as any,
        transactionRef: p.transactionRef,
        notes: p.notes,
        recordedById: p.recordedById,
      },
    });
  }

  console.log("✅ EduManage PostgreSQL Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
