import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema } from "@shared/schema";
import { sendBookingConfirmation, sendContactNotification } from "./services/email";
import { createRazorpayOrder, verifyRazorpayPayment } from "./services/payment";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============================================
  // BOOKING ROUTES
  // ============================================
  
  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      
      // Send confirmation email if payment is completed
      if (data.paymentStatus === "completed") {
        await sendBookingConfirmation(booking);
      }
      
      res.json(booking);
    } catch (error: any) {
      console.error("Booking creation error:", error);
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

  // ============================================
  // CONTACT ROUTES
  // ============================================
  
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

  // ============================================
  // PORTFOLIO ROUTES
  // ============================================
  
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

  // ============================================
  // RAZORPAY PAYMENT ROUTES
  // ============================================
  
  // Create Razorpay Order
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { amount, currency, receipt, notes } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid amount" 
        });
      }
      
      const order = await createRazorpayOrder({
        amount,
        currency: currency || "INR",
        receipt: receipt || `booking_${Date.now()}`,
        notes: notes || {},
      });
      
      res.json(order);
    } catch (error: any) {
      console.error("Create order error:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message || "Failed to create order" 
      });
    }
  });

  // Verify Razorpay Payment
  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing payment verification parameters" 
        });
      }
      
      const result = verifyRazorpayPayment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      
      res.json(result);
    } catch (error: any) {
      console.error("Payment verification error:", error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Payment verification failed" 
      });
    }
  });

  // Razorpay Webhook (optional - for automated payment updates)
  app.post("/api/payments/webhook", async (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.warn("Webhook secret not configured");
        return res.status(400).json({ error: "Webhook not configured" });
      }
      
      // Verify webhook signature
      const crypto = await import("crypto");
      const body = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");
      
      if (expectedSignature !== signature) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }
      
      const event = req.body;
      
      switch (event.event) {
        case "payment.captured":
          console.log("✅ Payment captured:", event.payload.payment.entity.id);
          // Update booking if needed
          const paymentNotes = event.payload.payment.entity.notes;
          if (paymentNotes?.bookingId) {
            await storage.updateBooking(paymentNotes.bookingId, {
              paymentStatus: "completed",
              status: "confirmed",
            });
          }
          break;
          
        case "payment.failed":
          console.log("❌ Payment failed:", event.payload.payment.entity.id);
          break;
          
        default:
          console.log("Webhook event:", event.event);
      }
      
      res.json({ status: "ok" });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // ============================================
  // HEALTH CHECK
  // ============================================
  
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      razorpay: !!process.env.RAZORPAY_KEY_ID,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}