import { PrismaClient } from "@prisma/client";
import {
  SEED_USERS,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  SEED_TABLES,
  SEED_ORDERS,
  SEED_RESERVATIONS,
} from "../lib/seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding DineDesk PostgreSQL Database...");

  // 1. Seed Users
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        phone: user.phone,
      },
    });
  }
  console.log("✅ Seeded Users (Admin, Kitchen Staff, Customer)");

  // 2. Seed Categories
  for (const cat of SEED_CATEGORIES) {
    await prisma.menuCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
    });
  }
  console.log("✅ Seeded Menu Categories");

  // 3. Seed Menu Items
  for (const item of SEED_MENU_ITEMS) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl,
        isVegetarian: item.isVegetarian,
        isAvailable: item.isAvailable,
        prepTimeMinutes: item.prepTimeMinutes,
        isPopular: item.isPopular,
        isArchived: item.isArchived,
      },
    });
  }
  console.log("✅ Seeded Menu Items");

  // 4. Seed Restaurant Tables
  for (const tbl of SEED_TABLES) {
    await prisma.restaurantTable.upsert({
      where: { id: tbl.id },
      update: {},
      create: {
        id: tbl.id,
        tableNumber: tbl.tableNumber,
        capacity: tbl.capacity,
        location: tbl.location,
        isActive: tbl.isActive,
      },
    });
  }
  console.log("✅ Seeded Restaurant Tables");

  // 5. Seed Orders
  for (const ord of SEED_ORDERS) {
    const existing = await prisma.order.findUnique({
      where: { orderNumber: ord.orderNumber },
    });
    if (!existing) {
      await prisma.order.create({
        data: {
          id: ord.id,
          orderNumber: ord.orderNumber,
          userId: ord.userId,
          customerName: ord.customerName,
          customerEmail: ord.customerEmail,
          contactNumber: ord.contactNumber,
          orderType: ord.orderType,
          status: ord.status,
          paymentMethod: ord.paymentMethod,
          paymentStatus: ord.paymentStatus,
          deliveryAddress: ord.deliveryAddress,
          specialInstructions: ord.specialInstructions,
          subtotal: ord.subtotal,
          taxAmount: ord.taxAmount,
          deliveryFee: ord.deliveryFee,
          totalAmount: ord.totalAmount,
          createdAt: new Date(ord.createdAt),
          updatedAt: new Date(ord.updatedAt),
          items: {
            create: ord.items.map((i) => ({
              id: i.id,
              menuItemId: i.menuItemId,
              itemName: i.itemName,
              itemPrice: i.itemPrice,
              quantity: i.quantity,
              subtotal: i.subtotal,
            })),
          },
        },
      });
    }
  }
  console.log("✅ Seeded Orders");

  // 6. Seed Reservations
  for (const res of SEED_RESERVATIONS) {
    const existing = await prisma.reservation.findUnique({
      where: { reservationNumber: res.reservationNumber },
    });
    if (!existing) {
      await prisma.reservation.create({
        data: {
          id: res.id,
          reservationNumber: res.reservationNumber,
          userId: res.userId,
          customerName: res.customerName,
          customerEmail: res.customerEmail,
          customerPhone: res.customerPhone,
          tableId: res.tableId,
          reservationDate: res.reservationDate,
          timeSlot: res.timeSlot,
          guestCount: res.guestCount,
          specialRequests: res.specialRequests,
          status: res.status,
          createdAt: new Date(res.createdAt),
          updatedAt: new Date(res.updatedAt),
        },
      });
    }
  }
  console.log("✅ Seeded Reservations");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
