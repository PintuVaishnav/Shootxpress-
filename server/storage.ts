import { type Booking, type InsertBooking, type Contact, type InsertContact, type Portfolio, type InsertPortfolio } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Booking methods
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingByEmail(email: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;

  // Contact methods
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;

  // Portfolio methods
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getAllPortfolio(): Promise<Portfolio[]>;
  getPortfolioByCategory(category: string): Promise<Portfolio[]>;
  getFeaturedPortfolio(): Promise<Portfolio[]>;
}

export class MemStorage implements IStorage {
  private bookings: Map<string, Booking>;
  private contacts: Map<string, Contact>;
  private portfolio: Map<string, Portfolio>;

  constructor() {
    this.bookings = new Map();
    this.contacts = new Map();
    this.portfolio = new Map();
    
    // Initialize with some sample portfolio items
    this.initializePortfolio();
  }

  private initializePortfolio() {
    const samplePortfolio: Portfolio[] = [
      {
        id: randomUUID(),
        title: "Wedding Ceremony Setup",
        description: "Professional event photography showing wedding ceremony setup",
        category: "Events",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        isVideo: false,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Portrait Session",
        description: "Portrait photography session with natural lighting",
        category: "Portraits",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        isVideo: false,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Corporate Conference",
        description: "Corporate event photography showing business conference",
        category: "Corporate",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        isVideo: false,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Creative Lifestyle",
        description: "Creative lifestyle photography showing young professional",
        category: "Portraits",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        isVideo: false,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Video Production",
        description: "Video production setup with professional camera equipment",
        category: "Reels",
        imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        isVideo: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Team Photography",
        description: "Creative group photography showing dynamic team shoot",
        category: "Corporate",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        isVideo: false,
        featured: false,
        createdAt: new Date(),
      },
    ];

    samplePortfolio.forEach(item => {
      this.portfolio.set(item.id, item);
    });
  }

  // Booking methods
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByEmail(email: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.email === email,
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date(),
      paymentId: null,
      razorpayOrderId: null,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const existing = this.bookings.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.bookings.set(id, updated);
    return updated;
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  // Contact methods
  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id,
      status: "new",
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // Portfolio methods
  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolio.get(id);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolioItem: Portfolio = { 
      ...insertPortfolio, 
      id,
      createdAt: new Date(),
    };
    this.portfolio.set(id, portfolioItem);
    return portfolioItem;
  }

  async getAllPortfolio(): Promise<Portfolio[]> {
    return Array.from(this.portfolio.values());
  }

  async getPortfolioByCategory(category: string): Promise<Portfolio[]> {
    return Array.from(this.portfolio.values()).filter(
      (item) => item.category.toLowerCase() === category.toLowerCase(),
    );
  }

  async getFeaturedPortfolio(): Promise<Portfolio[]> {
    return Array.from(this.portfolio.values()).filter(
      (item) => item.featured,
    );
  }
}

export const storage = new MemStorage();
