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
        title: "The ATAL Basic Offline FDP",
        description: "Professional event photography showing wedding ceremony setup",
        category: "Events",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/IMG_2999.PNG",
        isVideo: true,
        videoUrl: "https://www.instagram.com/shootxpress_/reel/DOnGiBPk2gF/",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Birthday Party",
        description: "Corporate event photography showing business conference",
        category: "Portraits",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/IMG_2996.PNG",
        isVideo: false,
        videoUrl: "",
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Bappa Visarjan",
        description: "Creative lifestyle photography showing young professional",
        category: "Portraits",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/IMG_0503.JPG",
        isVideo: false,
        videoUrl: "",
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Wedding",
        description: "Wedding event photography capturing heartfelt moments",
        category: "Portraits",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/potrait.jpg",
        isVideo: false,
        videoUrl: "",
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Bathukamma celebrations",
        description: "Bathukamma celebrations capturing vibrant floral arrangements, traditional rituals, cultural pride",
        category: "Events",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/event%203.jpeg",
        isVideo: true,
        videoUrl: "https://www.instagram.com/reel/DPMl_DEEzlv/?igsh=NTlwdW41eWxzNHI3",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Wedding",
        description: "Wedding photo and video coverage capturing timeless moments, heartfelt emotions and the joy of two families coming together in a beautiful celebration.",
        category: "Events",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/Event%202.jpg",
        isVideo: true,
        videoUrl: "https://www.instagram.com/vijaysatya_?igsh=MThzbDU5a296dWp6dw=",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Video Production",
        description: "Video production setup with professional camera equipment",
        category: "Reels",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/god%20reel.jpeg",
        isVideo: true,
        videoUrl: "https://www.instagram.com/reel/DQ4hVqfE1kt/?igsh=aTNxN2FucXZrMmN5",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Video Production",
        description: "Video production setup with professional camera equipment",
        category: "Reels",
        imageUrl: "https://github.com/PintuVaishanv/shootxpress/blob/main/IMG_1564.JPG?raw=true",
        isVideo: true,
        videoUrl: "https://www.instagram.com/reel/DRli9DEk53E/?igsh=MXJlcHc3bTk3ZGdzaw==",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Video Production",
        description: "Video production setup with professional camera equipment",
        category: "Reels",
        imageUrl: "https://raw.githubusercontent.com/PintuVaishanv/shootxpress/refs/heads/main/mahesh%20babu%20reel.PNG",
        isVideo: true,
        videoUrl: "https://www.instagram.com/reel/DRG1g2qkzte/?igsh=c3Izc3RsaXViYmc5",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Video Production",
        description: "Video production setup with professional camera equipment",
        category: "Reels",
        imageUrl: "https://github.com/PintuVaishanv/shootxpress/blob/main/IMG_1566.JPG?raw=true",
        isVideo: true,
        videoUrl: "https://www.instagram.com/reel/DP1z6dkkxRh/?igsh=amtsYXk4eHg1OG8y",
        featured: true,
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
      id,
      firstName: insertBooking.firstName,
      lastName: insertBooking.lastName,
      email: insertBooking.email,
      phone: insertBooking.phone,
      eventDate: insertBooking.eventDate,
      eventTime: insertBooking.eventTime,
      eventType: insertBooking.eventType,
      eventLocation: insertBooking.eventLocation,
      packageType: insertBooking.packageType,
      addOns: insertBooking.addOns || [],
      specialRequirements: insertBooking.specialRequirements || null,
      totalAmount: insertBooking.totalAmount,
      advanceAmount: insertBooking.advanceAmount,
      paymentStatus: insertBooking.paymentStatus || "pending",
      paymentId: insertBooking.paymentId || null,
      orderId: insertBooking.orderId || null,
      phonepeTransactionId: insertBooking.phonepeTransactionId || null,
      status: insertBooking.status || "pending",
      termsAccepted: insertBooking.termsAccepted,
      createdAt: new Date(),
    };
    
    this.bookings.set(id, booking);
    console.log("📝 Booking created:", id, booking.email);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const existing = this.bookings.get(id);
    if (!existing) {
      console.log("❌ Booking not found:", id);
      return undefined;
    }
    
    const updated = { ...existing, ...updates };
    this.bookings.set(id, updated);
    console.log("✅ Booking updated:", id);
    return updated;
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  // Contact methods
  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      id,
      firstName: insertContact.firstName,
      lastName: insertContact.lastName,
      email: insertContact.email,
      phone: insertContact.phone || null,
      eventType: insertContact.eventType || null,
      message: insertContact.message,
      status: "new",
      createdAt: new Date(),
    };
    
    this.contacts.set(id, contact);
    console.log("📧 Contact created:", id);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  // Portfolio methods
  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolio.get(id);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolioItem: Portfolio = {
      id,
      ...insertPortfolio,
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