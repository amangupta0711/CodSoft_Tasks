import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import { orderCheckoutSchema, reservationSchema, loginSchema } from "../lib/validation";

async function runTests() {
  console.log("====================================================");
  console.log("🧪 RUNNING COMPREHENSIVE DINEDESK VERIFICATION SUITE");
  console.log("====================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. User Authentication & Roles
  console.log("👉 Test Suite 1: Authentication & Demo Accounts");
  const admin = await db.user.findByEmail("admin@dinedesk.com");
  assert(admin !== null && admin.role === "ADMIN", "Admin demo account exists with ADMIN role");
  assert(
    admin ? bcrypt.compareSync("Admin@123", admin.passwordHash) : false,
    "Admin password verification succeeds"
  );

  const kitchen = await db.user.findByEmail("kitchen@dinedesk.com");
  assert(kitchen !== null && kitchen.role === "STAFF", "Kitchen staff demo account exists with STAFF role");
  assert(
    kitchen ? bcrypt.compareSync("Kitchen@123", kitchen.passwordHash) : false,
    "Kitchen password verification succeeds"
  );

  const customer = await db.user.findByEmail("customer@dinedesk.com");
  assert(customer !== null && customer.role === "CUSTOMER", "Customer demo account exists with CUSTOMER role");
  assert(
    customer ? bcrypt.compareSync("Customer@123", customer.passwordHash) : false,
    "Customer password verification succeeds"
  );

  // 2. Menu Items & Dietary Filtering
  console.log("\n👉 Test Suite 2: Menu Browsing & Dietary Filtering");
  const allDishes = await db.menuItem.findMany();
  assert(allDishes.length >= 20, `Loaded ${allDishes.length} menu items from database`);

  const vegDishes = await db.menuItem.findMany({ isVegetarian: true });
  assert(vegDishes.every((d) => d.isVegetarian), "Pure vegetarian filter returns only vegetarian dishes");

  const searchResults = await db.menuItem.findMany({ search: "Butter Chicken" });
  assert(
    searchResults.some((d) => d.name.includes("Butter Chicken")),
    "Search finds 'Butter Chicken' accurately"
  );

  // 3. Order Placement & Authoritative Pricing
  console.log("\n👉 Test Suite 3: Order Checkout & Pricing Math");
  const testDish1 = allDishes[0];
  const testDish2 = allDishes[1];

  const testOrder = await db.order.create({
    userId: customer!.id,
    customerName: customer!.name,
    customerEmail: customer!.email,
    contactNumber: "+91 98765 43210",
    orderType: "DELIVERY",
    paymentMethod: "CASH_ON_DELIVERY",
    deliveryAddress: "Flat 101, Test Residency, MG Road, Bengaluru",
    specialInstructions: "Test kitchen notes",
    items: [
      { menuItemId: testDish1.id, quantity: 2 },
      { menuItemId: testDish2.id, quantity: 1 },
    ],
  });

  const expectedSubtotal = testDish1.price * 2 + testDish2.price * 1;
  const expectedTax = Math.round(expectedSubtotal * 0.05 * 100) / 100;
  const expectedTotal = Math.round((expectedSubtotal + expectedTax + 40) * 100) / 100;

  assert(testOrder.subtotal === expectedSubtotal, `Subtotal calculated correctly: ₹${testOrder.subtotal}`);
  assert(testOrder.taxAmount === expectedTax, `5% GST calculated correctly: ₹${testOrder.taxAmount}`);
  assert(testOrder.deliveryFee === 40, "Delivery fee applied correctly: ₹40");
  assert(testOrder.totalAmount === expectedTotal, `Total amount calculated correctly: ₹${testOrder.totalAmount}`);
  assert(testOrder.orderNumber.startsWith("ORD-"), `Unique order number generated: ${testOrder.orderNumber}`);

  // 4. Kitchen Order Status Progression
  console.log("\n👉 Test Suite 4: Kitchen Lifecycle & Status Progression");
  const confirmedOrder = await db.order.updateStatus(testOrder.id, "CONFIRMED");
  assert(confirmedOrder.status === "CONFIRMED", "Order moved to CONFIRMED");

  const preparingOrder = await db.order.updateStatus(testOrder.id, "PREPARING");
  assert(preparingOrder.status === "PREPARING", "Order moved to PREPARING");

  const readyOrder = await db.order.updateStatus(testOrder.id, "READY");
  assert(readyOrder.status === "READY", "Order moved to READY");

  const completedOrder = await db.order.updateStatus(testOrder.id, "COMPLETED");
  assert(completedOrder.status === "COMPLETED", "Order moved to COMPLETED");

  // 5. Order Cancellation Eligibility
  console.log("\n👉 Test Suite 5: Customer Cancellation Policy");
  try {
    await db.order.cancel(testOrder.id, customer!.id);
    assert(false, "Should not allow cancelling completed order");
  } catch (err: any) {
    assert(true, "Correctly prevented customer from cancelling completed order");
  }

  // 6. Table Reservation & Double Booking Prevention
  console.log("\n👉 Test Suite 6: Table Reservation & Double Booking Prevention");
  const tables = await db.table.findMany();
  assert(tables.length >= 8, `Loaded ${tables.length} restaurant tables`);

  const targetTable = tables[0];
  const testDate = "2026-11-20";
  const testTime = "19:30";

  const firstBooking = await db.reservation.create({
    userId: customer!.id,
    customerName: "Ananya Sharma",
    customerEmail: "customer@dinedesk.com",
    customerPhone: "+91 98765 43210",
    tableId: targetTable.id,
    reservationDate: testDate,
    timeSlot: testTime,
    guestCount: 2,
  });

  assert(
    firstBooking.reservationNumber.startsWith("RES-"),
    `First booking created successfully: ${firstBooking.reservationNumber}`
  );

  // Attempt duplicate booking for same table, date and time
  let conflictBlocked = false;
  try {
    await db.reservation.create({
      userId: customer!.id,
      customerName: "Duplicate Test Diner",
      customerEmail: "duplicate@example.com",
      customerPhone: "+91 98765 99999",
      tableId: targetTable.id,
      reservationDate: testDate,
      timeSlot: testTime,
      guestCount: 2,
    });
  } catch (err: any) {
    conflictBlocked = true;
  }
  assert(conflictBlocked, "Successfully prevented conflicting double booking for the same table and time slot!");

  // 7. Admin Dashboard Statistics
  console.log("\n👉 Test Suite 7: Admin Dashboard Statistics");
  const stats = await db.stats.getAdminDashboardStats();
  assert(stats.totalOrders > 0, `Stats show ${stats.totalOrders} total recorded orders`);
  assert(stats.recordedSales > 0, `Stats show ₹${stats.recordedSales} in sales`);
  assert(stats.popularDishes.length > 0, `Stats aggregated ${stats.popularDishes.length} popular dishes`);
  assert(stats.salesChartData.length === 7, "Generated 7-day revenue trend data points");

  console.log("\n====================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("====================================================\n");

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
