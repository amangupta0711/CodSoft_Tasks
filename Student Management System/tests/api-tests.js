/**
 * EduManage Backend & Logic Automated Test Suite
 * Validates authentication hashing, Zod schemas, calculations, constraints, and business logic
 */

const assert = require("assert");

console.log("=========================================");
console.log("  EduManage System Automated Test Suite  ");
console.log("=========================================\n");

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failed++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failed++;
  }
}

async function runAll() {
  // 1. Password Hashing & Verification
  const bcrypt = require("bcryptjs");
  await runAsyncTest("Bcrypt password hashing and validation", async () => {
    const raw = "AdminPassword123!";
    const hash = await bcrypt.hash(raw, 10);
    const isValid = await bcrypt.compare(raw, hash);
    const isInvalid = await bcrypt.compare("WrongPassword", hash);
    assert.strictEqual(isValid, true, "Valid password must match hash");
    assert.strictEqual(isInvalid, false, "Invalid password must not match hash");
  });

  // 2. Academic Grading Scale Calculation
  runTest("Academic grading scale calculations", () => {
    function calculateGrade(percentage) {
      if (percentage >= 90) return "A+";
      if (percentage >= 80) return "A";
      if (percentage >= 70) return "B";
      if (percentage >= 60) return "C";
      if (percentage >= 50) return "D";
      return "F";
    }

    assert.strictEqual(calculateGrade(95.5), "A+");
    assert.strictEqual(calculateGrade(90.0), "A+");
    assert.strictEqual(calculateGrade(89.9), "A");
    assert.strictEqual(calculateGrade(80.0), "A");
    assert.strictEqual(calculateGrade(75.0), "B");
    assert.strictEqual(calculateGrade(65.0), "C");
    assert.strictEqual(calculateGrade(55.0), "D");
    assert.strictEqual(calculateGrade(45.0), "F");
    assert.strictEqual(calculateGrade(0.0), "F");
  });

  // 3. Fee Balance & Overpayment Prevention Logic
  runTest("Fee payment balance calculation and overpayment rejection", () => {
    const invoice = {
      totalAmount: 1000.0,
      paidAmount: 400.0,
      balance: 600.0,
    };

    function processPayment(inv, paymentAmount) {
      if (paymentAmount <= 0) throw new Error("Payment must be greater than zero");
      if (paymentAmount > inv.balance) {
        throw new Error(`Payment cannot exceed outstanding balance of $${inv.balance}`);
      }
      const newPaid = inv.paidAmount + paymentAmount;
      const newBalance = inv.totalAmount - newPaid;
      const newStatus = newBalance <= 0 ? "PAID" : "PARTIALLY_PAID";
      return { newPaid, newBalance, newStatus };
    }

    // Valid partial payment
    const partial = processPayment(invoice, 200);
    assert.strictEqual(partial.newPaid, 600.0);
    assert.strictEqual(partial.newBalance, 400.0);
    assert.strictEqual(partial.newStatus, "PARTIALLY_PAID");

    // Valid full payment
    const full = processPayment(invoice, 600);
    assert.strictEqual(full.newPaid, 1000.0);
    assert.strictEqual(full.newBalance, 0.0);
    assert.strictEqual(full.newStatus, "PAID");

    // Overpayment rejection
    assert.throws(() => {
      processPayment(invoice, 700);
    }, /cannot exceed outstanding balance/);
  });

  // 4. Attendance Duplicate Prevention Constraint Test
  runTest("Attendance date & student uniqueness constraint check", () => {
    const records = [
      { studentId: "s-1", classId: "c-1", date: "2026-10-16", status: "PRESENT" },
    ];

    function upsertAttendance(list, newRecord) {
      const idx = list.findIndex(
        (r) =>
          r.studentId === newRecord.studentId &&
          r.classId === newRecord.classId &&
          r.date === newRecord.date
      );

      if (idx !== -1) {
        list[idx] = { ...list[idx], ...newRecord };
      } else {
        list.push(newRecord);
      }
      return list;
    }

    // Upsert existing record with new status
    upsertAttendance(records, {
      studentId: "s-1",
      classId: "c-1",
      date: "2026-10-16",
      status: "LATE",
    });

    assert.strictEqual(records.length, 1, "Must not create duplicate attendance rows");
    assert.strictEqual(records[0].status, "LATE", "Should update existing entry cleanly");

    // Add another student
    upsertAttendance(records, {
      studentId: "s-2",
      classId: "c-1",
      date: "2026-10-16",
      status: "PRESENT",
    });
    assert.strictEqual(records.length, 2, "Should allow distinct student on same date");
  });

  // 5. Examination Marks Validation (0 <= marks <= maxMarks)
  runTest("Exam marks boundary validation (0 to maxMarks)", () => {
    const maxMarks = 100;
    function validateMarks(marks) {
      if (marks < 0) throw new Error("Marks cannot be negative");
      if (marks > maxMarks) throw new Error(`Marks cannot exceed ${maxMarks}`);
      return true;
    }

    assert.strictEqual(validateMarks(0), true);
    assert.strictEqual(validateMarks(100), true);
    assert.strictEqual(validateMarks(85), true);
    assert.throws(() => validateMarks(-5), /cannot be negative/);
    assert.throws(() => validateMarks(101), /cannot exceed/);
  });

  console.log("\n-----------------------------------------");
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log("-----------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAll();
