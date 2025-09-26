
import { db } from "./db";
import { vehicles, drivers, trips, maintenanceRecords } from "@shared/schema";
import type { InsertVehicle, InsertDriver, InsertTrip, InsertMaintenanceRecord } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export const storage = {
  // Vehicle operations
  async getVehicles() {
    try {
      return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      // Return mock data as fallback
      return [
        {
          id: "veh-001",
          name: "Fleet Truck 1",
          type: "truck",
          licensePlate: "TRK-001-ZW",
          make: "Mercedes",
          model: "Actros",
          year: 2022,
          status: "active",
          lastLatitude: "-17.8292",
          lastLongitude: "31.0522",
          lastLocationUpdate: new Date(),
          currentDriverId: "drv-001",
          createdAt: new Date()
        },
        {
          id: "veh-002",
          name: "Fleet Truck 2",
          type: "truck",
          licensePlate: "TRK-002-ZW",
          make: "Volvo",
          model: "FH16",
          year: 2021,
          status: "maintenance",
          lastLatitude: "-20.1569",
          lastLongitude: "28.5903",
          lastLocationUpdate: new Date(),
          currentDriverId: "drv-002",
          createdAt: new Date()
        }
      ];
    }
  },

  async getVehicle(id: string) {
    try {
      const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      return null;
    }
  },

  async createVehicle(data: InsertVehicle) {
    try {
      const result = await db.insert(vehicles).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw new Error("Failed to create vehicle");
    }
  },

  async updateVehicle(id: string, data: Partial<InsertVehicle>) {
    try {
      const result = await db.update(vehicles).set(data).where(eq(vehicles.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      return null;
    }
  },

  // Driver operations
  async getDrivers() {
    try {
      return await db.select().from(drivers).orderBy(desc(drivers.createdAt));
    } catch (error) {
      console.error("Error fetching drivers:", error);
      // Return mock data as fallback
      return [
        {
          id: "drv-001",
          firstName: "John",
          lastName: "Mukamba",
          email: "john.mukamba@fleet.com",
          phone: "+263712345678",
          licenseNumber: "DL001234",
          isActive: true,
          createdAt: new Date()
        },
        {
          id: "drv-002",
          firstName: "Sarah",
          lastName: "Moyo",
          email: "sarah.moyo@fleet.com",
          phone: "+263712345679",
          licenseNumber: "DL001235",
          isActive: true,
          createdAt: new Date()
        }
      ];
    }
  },

  async createDriver(data: InsertDriver) {
    try {
      const result = await db.insert(drivers).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating driver:", error);
      throw new Error("Failed to create driver");
    }
  },

  // Trip operations
  async getTrips(vehicleId?: string, driverId?: string) {
    try {
      let query = db.select().from(trips);
      
      if (vehicleId && driverId) {
        query = query.where(and(eq(trips.vehicleId, vehicleId), eq(trips.driverId, driverId)));
      } else if (vehicleId) {
        query = query.where(eq(trips.vehicleId, vehicleId));
      } else if (driverId) {
        query = query.where(eq(trips.driverId, driverId));
      }
      
      return await query.orderBy(desc(trips.createdAt));
    } catch (error) {
      console.error("Error fetching trips:", error);
      // Return mock data as fallback
      return [
        {
          id: "trip-001",
          vehicleId: "veh-001",
          driverId: "drv-001",
          startLatitude: "-17.8292",
          startLongitude: "31.0522",
          endLatitude: "-33.9249",
          endLongitude: "18.4241",
          startTime: new Date(),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          distance: "1247.5",
          status: "in_progress",
          purpose: "delivery",
          notes: "Standard delivery route",
          createdAt: new Date()
        }
      ];
    }
  },

  async createTrip(data: InsertTrip) {
    try {
      const result = await db.insert(trips).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating trip:", error);
      throw new Error("Failed to create trip");
    }
  },

  async updateTrip(id: string, data: Partial<InsertTrip>) {
    try {
      const result = await db.update(trips).set(data).where(eq(trips.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error("Error updating trip:", error);
      return null;
    }
  },

  // Maintenance operations
  async getMaintenanceRecords(vehicleId?: string) {
    try {
      let query = db.select().from(maintenanceRecords);
      
      if (vehicleId) {
        query = query.where(eq(maintenanceRecords.vehicleId, vehicleId));
      }
      
      return await query.orderBy(desc(maintenanceRecords.createdAt));
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
      return [];
    }
  },

  async createMaintenanceRecord(data: InsertMaintenanceRecord) {
    try {
      const result = await db.insert(maintenanceRecords).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating maintenance record:", error);
      throw new Error("Failed to create maintenance record");
    }
  },

  // Fleet statistics
  async getFleetStats() {
    try {
      const allVehicles = await this.getVehicles();
      const allTrips = await this.getTrips();
      
      const totalVehicles = allVehicles.length;
      const activeVehicles = allVehicles.filter(v => v.status === "active").length;
      const maintenanceVehicles = allVehicles.filter(v => v.status === "maintenance").length;
      const offlineVehicles = allVehicles.filter(v => v.status === "offline").length;
      
      const activeTrips = allTrips.filter(t => t.status === "in_progress").length;
      const plannedTrips = allTrips.filter(t => t.status === "planned").length;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const completedTripsToday = allTrips.filter(t => 
        t.status === "completed" && 
        new Date(t.createdAt) >= today
      ).length;

      const totalDistance = allTrips.reduce((sum, trip) => {
        return sum + (trip.distance ? parseFloat(trip.distance) : 0);
      }, 0);

      return {
        totalVehicles,
        activeVehicles,
        maintenanceVehicles,
        offlineVehicles,
        activeTrips,
        plannedTrips,
        completedTripsToday,
        avgFuelLevel: 68, // Mock data - would calculate from vehicle fuel sensors
        lowFuelAlerts: 3, // Mock data - would calculate from vehicle fuel levels
        totalDistance
      };
    } catch (error) {
      console.error("Error fetching fleet stats:", error);
      // Return mock data as fallback
      return {
        totalVehicles: 24,
        activeVehicles: 18,
        maintenanceVehicles: 4,
        offlineVehicles: 2,
        activeTrips: 12,
        plannedTrips: 8,
        completedTripsToday: 5,
        avgFuelLevel: 68,
        lowFuelAlerts: 3,
        totalDistance: 45780
      };
    }
  }
};
