import { 
  type User, 
  type InsertUser,
  type Vehicle,
  type InsertVehicle,
  type Trip,
  type InsertTrip,
  type Driver,
  type InsertDriver,
  type MaintenanceRecord,
  type InsertMaintenanceRecord,
  users,
  vehicles,
  trips,
  drivers,
  maintenanceRecords
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vehicle operations
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, updates: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;

  // Driver operations
  getDriver(id: string): Promise<Driver | undefined>;
  getDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: string, updates: Partial<InsertDriver>): Promise<Driver | undefined>;
  deleteDriver(id: string): Promise<boolean>;

  // Trip operations
  getTrip(id: string): Promise<Trip | undefined>;
  getTrips(vehicleId?: string, driverId?: string): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: string, updates: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: string): Promise<boolean>;

  // Maintenance operations
  getMaintenanceRecord(id: string): Promise<MaintenanceRecord | undefined>;
  getMaintenanceRecords(vehicleId?: string): Promise<MaintenanceRecord[]>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  updateMaintenanceRecord(id: string, updates: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined>;
  deleteMaintenanceRecord(id: string): Promise<boolean>;

  // Fleet statistics
  getFleetStats(): Promise<{
    totalVehicles: number;
    activeVehicles: number;
    totalTrips: number;
    activeTrips: number;
    totalDrivers: number;
    activeDrivers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Vehicle operations
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    return result[0];
  }

  async getVehicles(): Promise<Vehicle[]> {
    return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const result = await db.insert(vehicles).values(vehicle).returning();
    return result[0];
  }

  async updateVehicle(id: string, updates: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const result = await db.update(vehicles).set(updates).where(eq(vehicles.id, id)).returning();
    return result[0];
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Driver operations
  async getDriver(id: string): Promise<Driver | undefined> {
    const result = await db.select().from(drivers).where(eq(drivers.id, id)).limit(1);
    return result[0];
  }

  async getDrivers(): Promise<Driver[]> {
    return db.select().from(drivers).orderBy(desc(drivers.createdAt));
  }

  async createDriver(driver: InsertDriver): Promise<Driver> {
    const result = await db.insert(drivers).values(driver).returning();
    return result[0];
  }

  async updateDriver(id: string, updates: Partial<InsertDriver>): Promise<Driver | undefined> {
    const result = await db.update(drivers).set(updates).where(eq(drivers.id, id)).returning();
    return result[0];
  }

  async deleteDriver(id: string): Promise<boolean> {
    const result = await db.delete(drivers).where(eq(drivers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Trip operations
  async getTrip(id: string): Promise<Trip | undefined> {
    const result = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
    return result[0];
  }

  async getTrips(vehicleId?: string, driverId?: string): Promise<Trip[]> {
    let query = db.select().from(trips);
    
    if (vehicleId && driverId) {
      query = query.where(and(eq(trips.vehicleId, vehicleId), eq(trips.driverId, driverId)));
    } else if (vehicleId) {
      query = query.where(eq(trips.vehicleId, vehicleId));
    } else if (driverId) {
      query = query.where(eq(trips.driverId, driverId));
    }
    
    return query.orderBy(desc(trips.createdAt));
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const result = await db.insert(trips).values(trip).returning();
    return result[0];
  }

  async updateTrip(id: string, updates: Partial<InsertTrip>): Promise<Trip | undefined> {
    const result = await db.update(trips).set(updates).where(eq(trips.id, id)).returning();
    return result[0];
  }

  async deleteTrip(id: string): Promise<boolean> {
    const result = await db.delete(trips).where(eq(trips.id, id));
    return result.rowCount > 0;
  }

  // Maintenance operations
  async getMaintenanceRecord(id: string): Promise<MaintenanceRecord | undefined> {
    const result = await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.id, id)).limit(1);
    return result[0];
  }

  async getMaintenanceRecords(vehicleId?: string): Promise<MaintenanceRecord[]> {
    let query = db.select().from(maintenanceRecords);
    
    if (vehicleId) {
      query = query.where(eq(maintenanceRecords.vehicleId, vehicleId));
    }
    
    return query.orderBy(desc(maintenanceRecords.createdAt));
  }

  async createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const result = await db.insert(maintenanceRecords).values(record).returning();
    return result[0];
  }

  async updateMaintenanceRecord(id: string, updates: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const result = await db.update(maintenanceRecords).set(updates).where(eq(maintenanceRecords.id, id)).returning();
    return result[0];
  }

  async deleteMaintenanceRecord(id: string): Promise<boolean> {
    const result = await db.delete(maintenanceRecords).where(eq(maintenanceRecords.id, id));
    return result.rowCount > 0;
  }

  // Fleet statistics
  async getFleetStats(): Promise<{
    totalVehicles: number;
    activeVehicles: number;
    totalTrips: number;
    activeTrips: number;
    totalDrivers: number;
    activeDrivers: number;
  }> {
    const [vehicleStats, tripStats, driverStats] = await Promise.all([
      db.select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where status = 'active')::int`
      }).from(vehicles),
      db.select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where status = 'in_progress')::int`
      }).from(trips),
      db.select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where is_active = true)::int`
      }).from(drivers)
    ]);

    return {
      totalVehicles: vehicleStats[0].total,
      activeVehicles: vehicleStats[0].active,
      totalTrips: tripStats[0].total,
      activeTrips: tripStats[0].active,
      totalDrivers: driverStats[0].total,
      activeDrivers: driverStats[0].active,
    };
  }
}

export const storage = new DatabaseStorage();
