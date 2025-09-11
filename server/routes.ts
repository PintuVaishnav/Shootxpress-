import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema } from "@shared/schema";
import { sendBookingConfirmation, sendContactNotification } from "./services/email";
import { paymentService } from "./services/payment";

export async function registerRoutes(app: Express): Promise<Server> {
  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      
      // Send confirmation email
      await sendBookingConfirmation(booking);
      
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact routes
  app.post("/api/contacts", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(data);
      
      // Send notification email to admin
      await sendContactNotification(contact);
      
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      let portfolio;
      if (category && typeof category === 'string') {
        portfolio = await storage.getPortfolioByCategory(category);
      } else if (featured === 'true') {
        portfolio = await storage.getFeaturedPortfolio();
      } else {
        portfolio = await storage.getAllPortfolio();
      }
      
      res.json(portfolio);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Payment routes
  app.post("/api/payment/create-qr", async (req, res) => {
    try {
      const { amount, bookingId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      const qrResponse = await paymentService.createDynamicQR({
        amount,
        merchantOrderId: bookingId,
      });
      
      if (!qrResponse || !qrResponse.success) {
        return res.status(500).json({ message: "Failed to create payment QR" });
      }
      
      res.json(qrResponse);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { transactionId, bookingId } = req.body;
      
      const isValid = await paymentService.checkPaymentStatus(transactionId);
      
      if (isValid && bookingId) {
        // Update booking with payment details
        await storage.updateBooking(bookingId, {
          paymentStatus: "completed",
          paymentId: transactionId,
          phonepeTransactionId: transactionId,
          status: "confirmed",
        });
      }
      
      res.json({ success: isValid });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Simulate payment completion for demo purposes
  app.post("/api/payment/simulate-success", async (req, res) => {
    try {
      const { bookingId, transactionId } = req.body;
      
      // Update booking with payment details
      await storage.updateBooking(bookingId, {
        paymentStatus: "completed",
        paymentId: transactionId,
        phonepeTransactionId: transactionId,
        status: "confirmed",
      });
      
      res.json({ success: true, message: "Payment simulated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
