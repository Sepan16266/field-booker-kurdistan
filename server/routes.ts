import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, loginSchema, signUpSchema } from "@shared/schema";
import { z } from "zod";
import { whatsappService } from "./whatsapp-service";
import { loginUser, createUser, authenticateToken, getCurrentUser } from "./simple-auth";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        scriptSrcAttr: ["'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      },
    },
  }));

  // Rate limiting for security (disabled for testing)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // increased limit for testing
    message: { message: "محاولات تسجيل دخول كثيرة، حاول مرة أخرى لاحقاً" },
  });

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // increased limit for testing
    message: { message: "طلبات كثيرة، حاول مرة أخرى لاحقاً" },
  });

  app.use("/api/auth", authLimiter);
  app.use("/api", generalLimiter);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Test route to generate password hash
  app.get("/api/test/hash/:password", (req, res) => {
    const password = req.params.password;
    const hash = bcrypt.hashSync(password, 10);
    res.json({ password, hash });
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await loginUser(validatedData.username, validatedData.password);

      if (result) {
        res.json({ token: result.token, user: { id: result.user.id, username: result.user.username, role: result.user.role } });
      } else {
        res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      }
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      console.log("Signup request received:", req.body);
      const validatedData = signUpSchema.parse(req.body);
      console.log("Data validated successfully:", validatedData);

      const result = await createUser(validatedData.firstName, validatedData.fatherName, validatedData.phone, validatedData.password);
      console.log("User created successfully:", result.user.username);

      const response = { token: result.token, user: { id: result.user.id, username: result.user.username, role: result.user.role } };
      console.log("Sending response:", response);
      res.json(response);
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        console.log("Validation error:", error.errors);
        return res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      }
      if (error instanceof Error && error.message === 'المستخدم موجود بالفعل') {
        console.log("User already exists");
        return res.status(400).json({ message: error.message });
      }
      console.log("Unknown error:", error);
      res.status(500).json({ message: "خطأ في إنشاء الحساب" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const user = (req as any).user;
    res.json({ id: user.userId, username: user.username, role: user.role });
  });

  // Protected routes
  app.get("/api/bookings", authenticateToken, async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "فشل في تحميل الحجوزات" });
    }
  });

  // Get bookings for a specific day
  app.get("/api/bookings/day/:day/:date", async (req, res) => {
    try {
      const { day, date } = req.params;
      const bookings = await storage.getBookingsByDay(day, date);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "فشل في تحميل الحجوزات لهذا اليوم" });
    }
  });

  // Get booking statistics
  app.get("/api/stats", authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getBookingStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if time slot is already booked
      const existingBookings = await storage.getBookingsByDay(validatedData.day, validatedData.date);
      const isTimeSlotTaken = existingBookings.some(booking => 
        booking.time === validatedData.time && booking.status === "confirmed"
      );
      
      if (isTimeSlotTaken) {
        return res.status(400).json({ message: "هذا الوقت محجوز بالفعل" });
      }
      
      const booking = await storage.createBooking(validatedData);
      
      // Send WhatsApp notification
      whatsappService.sendBookingNotification(booking).catch(error => {
        console.error('Failed to send WhatsApp notification:', error);
      });
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "بيانات غير صحيحة",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "فشل في إنشاء الحجز" });
    }
  });

  // Delete a booking
  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBooking(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "الحجز غير موجود" });
      }
      
      res.json({ message: "تم حذف الحجز بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "فشل في حذف الحجز" });
    }
  });

  // Get booking statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getBookingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "فشل في تحميل الإحصائيات" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
