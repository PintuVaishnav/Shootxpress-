import { z } from "zod";

// Booking Type
export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventDate: Date;
  eventTime: string;
  eventType: string;
  eventLocation: string;
  packageType: string;
  addOns: string[];
  specialRequirements: string | null;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: string;
  paymentId: string | null;
  orderId: string | null;  // Razorpay order ID
  phonepeTransactionId: string | null;
  status: string;
  termsAccepted: boolean;
  createdAt: Date | null;
}

// Insert Booking Schema (for validation)
export const insertBookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  eventDate: z.string().transform((str) => new Date(str)),
  eventTime: z.string().min(1, "Event time is required"),
  eventType: z.string().min(1, "Event type is required"),
  eventLocation: z.string().min(1, "Event location is required"),
  packageType: z.string().min(1, "Package type is required"),
  addOns: z.array(z.string()).default([]),
  specialRequirements: z.string().optional().nullable(),
  totalAmount: z.number().min(0),
  advanceAmount: z.number().min(0),
  paymentStatus: z.string().optional().default("pending"),
  paymentId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  phonepeTransactionId: z.string().optional().nullable(),
  status: z.string().optional().default("pending"),
  termsAccepted: z.boolean(),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Contact Type
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  eventType: string | null;
  message: string;
  status: string;
  createdAt: Date | null;
}

// Insert Contact Schema
export const insertContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional().nullable(),
  eventType: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;

// Portfolio Type
export interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  isVideo: boolean;
  videoUrl: string;
  featured: boolean;
  createdAt: Date | null;
}

// Insert Portfolio Schema
export const insertPortfolioSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.string().min(1),
  imageUrl: z.string().url(),
  isVideo: z.boolean().default(false),
  videoUrl: z.string().default(""),
  featured: z.boolean().default(false),
});

export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;