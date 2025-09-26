
import { db } from "./db";
import { users, drivers, vehicles, trips, maintenanceRecords } from "@shared/schema";
import { sql } from "drizzle-orm";

async function migrate() {
  try {
    console.log("Creating database tables...");
    
    // Create tables using raw SQL to ensure they exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS drivers (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        license_number TEXT NOT NULL UNIQUE,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        license_plate TEXT NOT NULL UNIQUE,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        last_latitude DECIMAL(10, 7),
        last_longitude DECIMAL(10, 7),
        last_location_update TIMESTAMP,
        current_driver_id VARCHAR REFERENCES drivers(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trips (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id VARCHAR NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
        driver_id VARCHAR NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
        start_latitude DECIMAL(10, 7) NOT NULL,
        start_longitude DECIMAL(10, 7) NOT NULL,
        end_latitude DECIMAL(10, 7),
        end_longitude DECIMAL(10, 7),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        distance DECIMAL(8, 2),
        status TEXT NOT NULL DEFAULT 'in_progress',
        purpose TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS maintenance_records (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id VARCHAR NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        cost DECIMAL(10, 2),
        performed_at TIMESTAMP NOT NULL,
        next_due_date TIMESTAMP,
        performed_by TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Database tables created successfully!");

    // Insert sample data
    console.log("Inserting sample data...");

    // Insert sample drivers
    await db.execute(sql`
      INSERT INTO drivers (id, first_name, last_name, email, phone, license_number)
      VALUES 
        ('drv-001', 'John', 'Mukamba', 'john.mukamba@fleet.com', '+263712345678', 'DL001234'),
        ('drv-002', 'Sarah', 'Moyo', 'sarah.moyo@fleet.com', '+263712345679', 'DL001235')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert sample vehicles
    await db.execute(sql`
      INSERT INTO vehicles (id, name, type, license_plate, make, model, year, status, last_latitude, last_longitude, current_driver_id)
      VALUES 
        ('veh-001', 'Fleet Truck 1', 'truck', 'TRK-001-ZW', 'Mercedes', 'Actros', 2022, 'active', -17.8292, 31.0522, 'drv-001'),
        ('veh-002', 'Fleet Truck 2', 'truck', 'TRK-002-ZW', 'Volvo', 'FH16', 2021, 'maintenance', -20.1569, 28.5903, 'drv-002')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert sample trips
    await db.execute(sql`
      INSERT INTO trips (id, vehicle_id, driver_id, start_latitude, start_longitude, end_latitude, end_longitude, start_time, distance, status, purpose)
      VALUES 
        ('trip-001', 'veh-001', 'drv-001', -17.8292, 31.0522, -33.9249, 18.4241, NOW(), 1247.5, 'in_progress', 'delivery')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Sample data inserted successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log("Migration completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { migrate };
