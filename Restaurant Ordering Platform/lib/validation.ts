import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const orderCheckoutSchema = z.object({
  customerName: z.string().min(2, "Please enter your name"),
  contactNumber: z.string().min(10, "Please enter a valid phone number"),
  customerEmail: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  orderType: z.enum(["DELIVERY", "PICKUP", "DINE_IN"]),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "PAY_AT_RESTAURANT", "SIMULATED_ONLINE"]),
  deliveryAddress: z.string().optional(),
  specialInstructions: z.string().max(250).optional(),
  items: z.array(
    z.object({
      menuItemId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  ).min(1, "Your cart is empty"),
}).refine(
  (data) => {
    if (data.orderType === "DELIVERY") {
      return !!data.deliveryAddress && data.deliveryAddress.trim().length >= 5;
    }
    return true;
  },
  {
    message: "Delivery address is required for home delivery (min 5 characters)",
    path: ["deliveryAddress"],
  }
);

export const reservationSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  tableId: z.string().min(1, "Please select an available dining table"),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  timeSlot: z.string().min(4, "Time slot is required"),
  guestCount: z.number().int().min(1).max(20, "Party size up to 20 guests"),
  specialRequests: z.string().max(250).optional(),
});

export const menuItemSchema = z.object({
  name: z.string().min(2, "Dish name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Please select a category"),
  imageUrl: z.string().url("Please provide a valid image URL"),
  isVegetarian: z.boolean(),
  isAvailable: z.boolean().default(true),
  prepTimeMinutes: z.number().int().min(1).max(120).default(20),
  isPopular: z.boolean().default(false),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "CANCELLED",
  ]),
});
