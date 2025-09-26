import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVehicleSchema, 
  insertTripSchema, 
  insertDriverSchema, 
  insertMaintenanceRecordSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple in-memory authentication for demo purposes
  let authenticatedUser: any = null;
  
  // Mock user for demo
  const mockUser = {
    id: "demo-user-1",
    username: "fleetmanager",
    password: "demo123"
  };

  // Login endpoint
  app.get("/api/login", async (req, res) => {
    try {
      // For demo purposes, use the mock user
      authenticatedUser = mockUser;
      
      // Redirect to dashboard
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Signup endpoint
  app.post("/api/signup", async (req, res) => {
    try {
      const { username, email, password, companyName } = req.body;
      
      // For demo purposes, just return success
      // In a real app, this would create a user in the database
      res.json({ 
        success: true, 
        message: "Account created successfully",
        user: {
          id: "new-user-" + Date.now(),
          username,
          email,
          companyName
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", async (req, res) => {
    authenticatedUser = null;
    res.json({ success: true });
  });

  // Authentication routes
  app.get("/api/auth/user", async (req, res) => {
    // Return the authenticated user or null
    res.json(authenticatedUser);
  });

  // Vehicle routes
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const vehicleData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: "Invalid vehicle data" });
    }
  });

  app.put("/api/vehicles/:id", async (req, res) => {
    try {
      const updates = insertVehicleSchema.partial().parse(req.body);
      const vehicle = await storage.updateVehicle(req.params.id, updates);
      if (!vehicle) {
        res.status(404).json({ error: "Vehicle not found" });
        return;
      }
      res.json(vehicle);
    } catch (error) {
      res.status(400).json({ error: "Invalid vehicle data" });
    }
  });

  // Driver routes
  app.get("/api/drivers", async (req, res) => {
    try {
      const drivers = await storage.getDrivers();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  });

  app.post("/api/drivers", async (req, res) => {
    try {
      const driverData = insertDriverSchema.parse(req.body);
      const driver = await storage.createDriver(driverData);
      res.status(201).json(driver);
    } catch (error) {
      res.status(400).json({ error: "Invalid driver data" });
    }
  });

  // Trip routes
  app.get("/api/trips", async (req, res) => {
    try {
      const { vehicleId, driverId } = req.query;
      const trips = await storage.getTrips(
        vehicleId as string, 
        driverId as string
      );
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(tripData);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ error: "Invalid trip data" });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const updates = insertTripSchema.partial().parse(req.body);
      const trip = await storage.updateTrip(req.params.id, updates);
      if (!trip) {
        res.status(404).json({ error: "Trip not found" });
        return;
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Invalid trip data" });
    }
  });

  // Maintenance routes
  app.get("/api/maintenance", async (req, res) => {
    try {
      const { vehicleId } = req.query;
      const records = await storage.getMaintenanceRecords(vehicleId as string);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance records" });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const recordData = insertMaintenanceRecordSchema.parse(req.body);
      const record = await storage.createMaintenanceRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance record data" });
    }
  });

  // Fleet statistics
  app.get("/api/fleet/stats", async (req, res) => {
    try {
      const stats = await storage.getFleetStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fleet statistics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
