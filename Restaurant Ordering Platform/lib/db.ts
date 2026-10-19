import fs from "fs";
import path from "path";
import prisma from "./prisma";
import {
  SEED_USERS,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  SEED_TABLES,
  SEED_ORDERS,
  SEED_RESERVATIONS,
} from "./seedData";

let isPrismaConnected: boolean | null = null;

async function checkPostgresConnection(): Promise<boolean> {
  if (isPrismaConnected !== null) return isPrismaConnected;
  try {
    // Quick probe to test if PostgreSQL is running and reachable
    await prisma.$queryRaw`SELECT 1`;
    isPrismaConnected = true;
    console.log(" Connected to PostgreSQL via Prisma successfully.");
    return true;
  } catch (error) {
    isPrismaConnected = false;
    console.warn("ℹ️ PostgreSQL connection not detected. Using persistent local store. Set DATABASE_URL and run prisma:push to switch to live PostgreSQL anytime.");
    return false;
  }
}

// Local persistent fallback store
const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  phone: string | null;
}

interface LocalStoreData {
  users: DbUser[];
  categories: any[];
  menuItems: any[];
  tables: any[];
  orders: any[];
  reservations: any[];
}

function getLocalStore(): LocalStoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
    const initialData: LocalStoreData = {
      users: [...SEED_USERS],
      categories: [...SEED_CATEGORIES],
      menuItems: [...SEED_MENU_ITEMS],
      tables: [...SEED_TABLES],
      orders: [...SEED_ORDERS],
      reservations: [...SEED_RESERVATIONS],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const content = fs.readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    const initialData: LocalStoreData = {
      users: [...SEED_USERS],
      categories: [...SEED_CATEGORIES],
      menuItems: [...SEED_MENU_ITEMS],
      tables: [...SEED_TABLES],
      orders: [...SEED_ORDERS],
      reservations: [...SEED_RESERVATIONS],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function saveLocalStore(data: LocalStoreData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  user: {
    async findByEmail(email: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.user.findUnique({ where: { email } });
      }
      const store = getLocalStore();
      return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    async findById(id: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.user.findUnique({ where: { id } });
      }
      const store = getLocalStore();
      return store.users.find((u) => u.id === id) || null;
    },

    async create(data: { name: string; email: string; passwordHash: string; role?: "CUSTOMER" | "STAFF" | "ADMIN"; phone?: string }) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.user.create({ data });
      }
      const store = getLocalStore();
      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || ("CUSTOMER" as const),
        phone: data.phone || null,
      };
      store.users.push(newUser);
      saveLocalStore(store);
      return newUser;
    },
  },

  category: {
    async findMany() {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.menuCategory.findMany({
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        });
      }
      const store = getLocalStore();
      return store.categories.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    },
  },

  menuItem: {
    async findMany(params?: { categoryId?: string; isVegetarian?: boolean; search?: string; sortBy?: string }) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        const where: Record<string, unknown> = { isArchived: false };
        if (params?.categoryId && params.categoryId !== "all") {
          where.categoryId = params.categoryId;
        }
        if (typeof params?.isVegetarian === "boolean") {
          where.isVegetarian = params.isVegetarian;
        }
        if (params?.search) {
          where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ];
        }

        let orderBy: Record<string, "asc" | "desc"> = { isPopular: "desc" };
        if (params?.sortBy === "price-asc") orderBy = { price: "asc" };
        else if (params?.sortBy === "price-desc") orderBy = { price: "desc" };
        else if (params?.sortBy === "name") orderBy = { name: "asc" };

        return prisma.menuItem.findMany({
          where,
          include: { category: true },
          orderBy,
        });
      }

      const store = getLocalStore();
      let items = store.menuItems.filter((i) => !i.isArchived);

      if (params?.categoryId && params.categoryId !== "all") {
        items = items.filter((i) => i.categoryId === params.categoryId);
      }
      if (typeof params?.isVegetarian === "boolean") {
        items = items.filter((i) => i.isVegetarian === params.isVegetarian);
      }
      if (params?.search) {
        const term = params.search.toLowerCase();
        items = items.filter((i) => i.name.toLowerCase().includes(term) || i.description.toLowerCase().includes(term));
      }

      if (params?.sortBy === "price-asc") {
        items.sort((a, b) => a.price - b.price);
      } else if (params?.sortBy === "price-desc") {
        items.sort((a, b) => b.price - a.price);
      } else if (params?.sortBy === "name") {
        items.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
      }

      return items.map((i) => ({
        ...i,
        category: store.categories.find((c) => c.id === i.categoryId) || null,
      }));
    },

    async findById(id: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.menuItem.findUnique({
          where: { id },
          include: { category: true },
        });
      }
      const store = getLocalStore();
      const item = store.menuItems.find((i) => i.id === id);
      if (!item) return null;
      return {
        ...item,
        category: store.categories.find((c) => c.id === item.categoryId) || null,
      };
    },

    async create(data: {
      name: string;
      description: string;
      price: number;
      categoryId: string;
      imageUrl: string;
      isVegetarian: boolean;
      isAvailable?: boolean;
      prepTimeMinutes?: number;
      isPopular?: boolean;
    }) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.menuItem.create({
          data: {
            ...data,
            isAvailable: data.isAvailable ?? true,
            prepTimeMinutes: data.prepTimeMinutes ?? 20,
            isPopular: data.isPopular ?? false,
            isArchived: false,
          },
        });
      }
      const store = getLocalStore();
      const newItem = {
        id: `item-${Date.now()}`,
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        isVegetarian: data.isVegetarian,
        isAvailable: data.isAvailable ?? true,
        prepTimeMinutes: data.prepTimeMinutes ?? 20,
        isPopular: data.isPopular ?? false,
        isArchived: false,
      };
      store.menuItems.push(newItem);
      saveLocalStore(store);
      return newItem;
    },

    async update(id: string, data: Partial<{
      name: string;
      description: string;
      price: number;
      categoryId: string;
      imageUrl: string;
      isVegetarian: boolean;
      isAvailable: boolean;
      prepTimeMinutes: number;
      isPopular: boolean;
      isArchived: boolean;
    }>) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.menuItem.update({
          where: { id },
          data,
        });
      }
      const store = getLocalStore();
      const idx = store.menuItems.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Menu item not found");
      store.menuItems[idx] = { ...store.menuItems[idx], ...data };
      saveLocalStore(store);
      return store.menuItems[idx];
    },

    async delete(id: string) {
      // Soft-delete to preserve order history
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.menuItem.update({
          where: { id },
          data: { isArchived: true, isAvailable: false },
        });
      }
      const store = getLocalStore();
      const idx = store.menuItems.findIndex((i) => i.id === id);
      if (idx !== -1) {
        store.menuItems[idx].isArchived = true;
        store.menuItems[idx].isAvailable = false;
        saveLocalStore(store);
      }
      return { success: true };
    },
  },

  table: {
    async findMany() {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.restaurantTable.findMany({
          where: { isActive: true },
          orderBy: { tableNumber: "asc" },
        });
      }
      const store = getLocalStore();
      return store.tables.filter((t) => t.isActive).sort((a, b) => a.tableNumber.localeCompare(b.tableNumber));
    },

    async findAvailable(date: string, timeSlot: string, guestCount: number) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        // Tables with adequate capacity
        const eligibleTables = await prisma.restaurantTable.findMany({
          where: {
            isActive: true,
            capacity: { gte: guestCount },
          },
          orderBy: { capacity: "asc" },
        });

        // Booked tables for this date and time slot
        const bookedReservations = await prisma.reservation.findMany({
          where: {
            reservationDate: date,
            timeSlot,
            status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
          },
          select: { tableId: true },
        });

        const bookedIds = new Set(bookedReservations.map((r) => r.tableId));
        return eligibleTables.filter((t) => !bookedIds.has(t.id));
      }

      const store = getLocalStore();
      const eligibleTables = store.tables
        .filter((t) => t.isActive && t.capacity >= guestCount)
        .sort((a, b) => a.capacity - b.capacity);

      const bookedIds = new Set(
        store.reservations
          .filter(
            (r) =>
              r.reservationDate === date &&
              r.timeSlot === timeSlot &&
              ["PENDING", "CONFIRMED", "SEATED"].includes(r.status)
          )
          .map((r) => r.tableId)
      );

      return eligibleTables.filter((t) => !bookedIds.has(t.id));
    },
  },

  reservation: {
    async findMany(params?: { userId?: string; status?: string; date?: string }) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        const where: Record<string, unknown> = {};
        if (params?.userId) where.userId = params.userId;
        if (params?.status && params.status !== "ALL") where.status = params.status;
        if (params?.date) where.reservationDate = params.date;

        return prisma.reservation.findMany({
          where,
          include: { table: true },
          orderBy: [{ reservationDate: "desc" }, { timeSlot: "asc" }],
        });
      }

      const store = getLocalStore();
      let resList = [...store.reservations];
      if (params?.userId) {
        resList = resList.filter((r) => r.userId === params.userId);
      }
      if (params?.status && params.status !== "ALL") {
        resList = resList.filter((r) => r.status === params.status);
      }
      if (params?.date) {
        resList = resList.filter((r) => r.reservationDate === params.date);
      }

      resList.sort((a, b) => {
        if (b.reservationDate !== a.reservationDate) {
          return b.reservationDate.localeCompare(a.reservationDate);
        }
        return a.timeSlot.localeCompare(b.timeSlot);
      });

      return resList.map((r) => ({
        ...r,
        table: store.tables.find((t) => t.id === r.tableId) || null,
      }));
    },

    async create(data: {
      userId?: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      tableId: string;
      reservationDate: string;
      timeSlot: string;
      guestCount: number;
      specialRequests?: string;
    }) {
      const reservationNumber = `RES-${data.reservationDate.replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

      const usePg = await checkPostgresConnection();
      if (usePg) {
        // Enforce concurrency lock / unique check
        const conflict = await prisma.reservation.findFirst({
          where: {
            tableId: data.tableId,
            reservationDate: data.reservationDate,
            timeSlot: data.timeSlot,
            status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
          },
        });
        if (conflict) {
          throw new Error("This table is already reserved for the selected time slot. Please choose another table or time.");
        }

        return prisma.reservation.create({
          data: {
            reservationNumber,
            userId: data.userId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            tableId: data.tableId,
            reservationDate: data.reservationDate,
            timeSlot: data.timeSlot,
            guestCount: data.guestCount,
            specialRequests: data.specialRequests,
            status: "CONFIRMED",
          },
          include: { table: true },
        });
      }

      const store = getLocalStore();
      const conflict = store.reservations.find(
        (r) =>
          r.tableId === data.tableId &&
          r.reservationDate === data.reservationDate &&
          r.timeSlot === data.timeSlot &&
          ["PENDING", "CONFIRMED", "SEATED"].includes(r.status)
      );

      if (conflict) {
        throw new Error("This table is already reserved for the selected time slot. Please choose another table or time.");
      }

      const newReservation = {
        id: `res-${Date.now()}`,
        reservationNumber,
        userId: data.userId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        tableId: data.tableId,
        reservationDate: data.reservationDate,
        timeSlot: data.timeSlot,
        guestCount: data.guestCount,
        specialRequests: data.specialRequests || null,
        status: "CONFIRMED" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      store.reservations.push(newReservation);
      saveLocalStore(store);

      return {
        ...newReservation,
        table: store.tables.find((t) => t.id === data.tableId) || null,
      };
    },

    async updateStatus(id: string, status: "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED", tableId?: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.reservation.update({
          where: { id },
          data: {
            status,
            ...(tableId ? { tableId } : {}),
          },
          include: { table: true },
        });
      }

      const store = getLocalStore();
      const idx = store.reservations.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Reservation not found");

      store.reservations[idx].status = status;
      if (tableId) store.reservations[idx].tableId = tableId;
      store.reservations[idx].updatedAt = new Date().toISOString();
      saveLocalStore(store);

      return {
        ...store.reservations[idx],
        table: store.tables.find((t) => t.id === store.reservations[idx].tableId) || null,
      };
    },

    async cancel(id: string, userId?: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        const res = await prisma.reservation.findUnique({ where: { id } });
        if (!res) throw new Error("Reservation not found");
        if (userId && res.userId && res.userId !== userId) {
          throw new Error("Unauthorized access to reservation");
        }
        if (res.status === "COMPLETED" || res.status === "SEATED") {
          throw new Error("Cannot cancel an active or completed reservation");
        }
        return prisma.reservation.update({
          where: { id },
          data: { status: "CANCELLED" },
        });
      }

      const store = getLocalStore();
      const res = store.reservations.find((r) => r.id === id);
      if (!res) throw new Error("Reservation not found");
      if (userId && res.userId && res.userId !== userId) {
        throw new Error("Unauthorized access to reservation");
      }
      if (res.status === "COMPLETED" || res.status === "SEATED") {
        throw new Error("Cannot cancel an active or completed reservation");
      }
      res.status = "CANCELLED";
      res.updatedAt = new Date().toISOString();
      saveLocalStore(store);
      return res;
    },
  },

  order: {
    async findMany(params?: { userId?: string; status?: string; orderType?: string }) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        const where: Record<string, unknown> = {};
        if (params?.userId) where.userId = params.userId;
        if (params?.status && params.status !== "ALL") where.status = params.status;
        if (params?.orderType && params.orderType !== "ALL") where.orderType = params.orderType;

        return prisma.order.findMany({
          where,
          include: { items: true },
          orderBy: { createdAt: "desc" },
        });
      }

      const store = getLocalStore();
      let ordList = [...store.orders];
      if (params?.userId) ordList = ordList.filter((o) => o.userId === params.userId);
      if (params?.status && params.status !== "ALL") ordList = ordList.filter((o) => o.status === params.status);
      if (params?.orderType && params.orderType !== "ALL") ordList = ordList.filter((o) => o.orderType === params.orderType);

      ordList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return ordList;
    },

    async findById(id: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.order.findUnique({
          where: { id },
          include: { items: true, payments: true },
        });
      }
      const store = getLocalStore();
      return store.orders.find((o) => o.id === id) || null;
    },

    async findByOrderNumber(orderNumber: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.order.findUnique({
          where: { orderNumber },
          include: { items: true, payments: true },
        });
      }
      const store = getLocalStore();
      return store.orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()) || null;
    },

    async create(data: {
      userId?: string;
      customerName: string;
      customerEmail?: string;
      contactNumber: string;
      orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
      paymentMethod: "CASH_ON_DELIVERY" | "PAY_AT_RESTAURANT" | "SIMULATED_ONLINE";
      deliveryAddress?: string;
      specialInstructions?: string;
      items: { menuItemId: string; quantity: number }[];
    }) {
      if (!data.items || data.items.length === 0) {
        throw new Error("Cannot place an empty order");
      }

      // Fetch menu items from DB to enforce authoritative pricing and availability
      const menuItems = await db.menuItem.findMany();
      const menuMap = new Map(menuItems.map((m) => [m.id, m]));

      let subtotal = 0;
      const orderItemsToCreate = [];

      for (const item of data.items) {
        const dish = menuMap.get(item.menuItemId);
        if (!dish) {
          throw new Error(`Menu item not found: ${item.menuItemId}`);
        }
        if (!dish.isAvailable) {
          throw new Error(`Dish "${dish.name}" is currently sold out.`);
        }
        if (item.quantity <= 0) {
          throw new Error(`Invalid quantity for dish: ${dish.name}`);
        }

        const lineTotal = dish.price * item.quantity;
        subtotal += lineTotal;
        orderItemsToCreate.push({
          id: `item-ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          menuItemId: dish.id,
          itemName: dish.name,
          itemPrice: dish.price,
          quantity: item.quantity,
          subtotal: lineTotal,
        });
      }

      const taxRate = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE || "0.05");
      const deliveryFee = data.orderType === "DELIVERY" ? parseFloat(process.env.NEXT_PUBLIC_DELIVERY_FEE || "40") : 0;
      const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
      const totalAmount = Math.round((subtotal + taxAmount + deliveryFee) * 100) / 100;

      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentStatus = data.paymentMethod === "SIMULATED_ONLINE" ? "PAID" : "PENDING";

      const usePg = await checkPostgresConnection();
      if (usePg) {
        return prisma.order.create({
          data: {
            orderNumber,
            userId: data.userId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            contactNumber: data.contactNumber,
            orderType: data.orderType,
            status: "PENDING",
            paymentMethod: data.paymentMethod,
            paymentStatus,
            deliveryAddress: data.deliveryAddress,
            specialInstructions: data.specialInstructions,
            subtotal,
            taxAmount,
            deliveryFee,
            totalAmount,
            items: {
              create: orderItemsToCreate.map((i) => ({
                menuItemId: i.menuItemId,
                itemName: i.itemName,
                itemPrice: i.itemPrice,
                quantity: i.quantity,
                subtotal: i.subtotal,
              })),
            },
            ...(data.paymentMethod === "SIMULATED_ONLINE"
              ? {
                  payments: {
                    create: {
                      amount: totalAmount,
                      paymentMethod: data.paymentMethod,
                      transactionRef: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      status: "PAID",
                    },
                  },
                }
              : {}),
          },
          include: { items: true, payments: true },
        });
      }

      const store = getLocalStore();
      const orderId = `ord-${Date.now()}`;
      const newOrder = {
        id: orderId,
        orderNumber,
        userId: data.userId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail || null,
        contactNumber: data.contactNumber,
        orderType: data.orderType,
        status: "PENDING" as const,
        paymentMethod: data.paymentMethod,
        paymentStatus: paymentStatus as "PENDING" | "PAID",
        deliveryAddress: data.deliveryAddress || null,
        specialInstructions: data.specialInstructions || null,
        subtotal,
        taxAmount,
        deliveryFee,
        totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: orderItemsToCreate.map((i) => ({ ...i, orderId })),
      };

      store.orders.unshift(newOrder);
      saveLocalStore(store);
      return newOrder;
    },

    async updateStatus(id: string, status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "READY_FOR_PICKUP" | "COMPLETED" | "CANCELLED") {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) throw new Error("Order not found");

        return prisma.order.update({
          where: { id },
          data: {
            status,
            ...(status === "COMPLETED" && order.paymentMethod !== "SIMULATED_ONLINE" ? { paymentStatus: "PAID" } : {}),
          },
          include: { items: true },
        });
      }

      const store = getLocalStore();
      const idx = store.orders.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error("Order not found");

      store.orders[idx].status = status;
      if (status === "COMPLETED" && store.orders[idx].paymentMethod !== "SIMULATED_ONLINE") {
        store.orders[idx].paymentStatus = "PAID";
      }
      store.orders[idx].updatedAt = new Date().toISOString();
      saveLocalStore(store);
      return store.orders[idx];
    },

    async cancel(id: string, userId?: string) {
      const usePg = await checkPostgresConnection();
      if (usePg) {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) throw new Error("Order not found");
        if (userId && order.userId && order.userId !== userId) {
          throw new Error("Unauthorized to cancel this order");
        }
        if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
          throw new Error("Orders already in kitchen preparation cannot be cancelled");
        }

        return prisma.order.update({
          where: { id },
          data: { status: "CANCELLED" },
        });
      }

      const store = getLocalStore();
      const order = store.orders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found");
      if (userId && order.userId && order.userId !== userId) {
        throw new Error("Unauthorized to cancel this order");
      }
      if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
        throw new Error("Orders already in kitchen preparation cannot be cancelled");
      }

      order.status = "CANCELLED";
      order.updatedAt = new Date().toISOString();
      saveLocalStore(store);
      return order;
    },
  },

  stats: {
    async getAdminDashboardStats() {
      const orders = await db.order.findMany();
      const reservations = await db.reservation.findMany();
      const menuItems = await db.menuItem.findMany();

      const todayStr = new Date().toISOString().slice(0, 10);
      const ordersToday = orders.filter((o) => o.createdAt.toString().slice(0, 10) === todayStr);

      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => ["PENDING", "CONFIRMED", "PREPARING"].includes(o.status)).length;
      const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;

      // Recorded Sales: sum of all completed or paid orders
      const recordedSales = orders
        .filter((o) => o.status === "COMPLETED" || o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      // Total booking requests
      const upcomingReservations = reservations.filter(
        (r) => ["PENDING", "CONFIRMED"].includes(r.status) && r.reservationDate >= todayStr
      ).length;

      // Item sales aggregator
      const dishSalesCount: Record<string, { name: string; count: number; revenue: number }> = {};
      for (const ord of orders) {
        if (ord.status !== "CANCELLED") {
          for (const it of ord.items) {
            if (!dishSalesCount[it.itemName]) {
              dishSalesCount[it.itemName] = { name: it.itemName, count: 0, revenue: 0 };
            }
            dishSalesCount[it.itemName].count += it.quantity;
            dishSalesCount[it.itemName].revenue += it.subtotal;
          }
        }
      }

      const popularDishes = Object.values(dishSalesCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Last 7 days orders & revenue trend
      const last7DaysMap: Record<string, { date: string; orders: number; revenue: number }> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        last7DaysMap[key] = { date: dayLabel, orders: 0, revenue: 0 };
      }

      for (const ord of orders) {
        const ordDate = ord.createdAt.toString().slice(0, 10);
        if (last7DaysMap[ordDate]) {
          last7DaysMap[ordDate].orders += 1;
          if (ord.status === "COMPLETED" || ord.paymentStatus === "PAID") {
            last7DaysMap[ordDate].revenue += ord.totalAmount;
          }
        }
      }

      const salesChartData = Object.values(last7DaysMap);

      return {
        totalOrders,
        ordersToday: ordersToday.length,
        pendingOrders,
        completedOrders,
        recordedSales: Math.round(recordedSales * 100) / 100,
        upcomingReservations,
        totalMenuItems: menuItems.length,
        popularDishes,
        salesChartData,
      };
    },
  },
};
