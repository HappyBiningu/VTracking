import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use REPLIT_DB_URL as fallback for DATABASE_URL in Replit environment
const databaseUrl = process.env.DATABASE_URL || process.env.REPLIT_DB_URL;

if (!databaseUrl) {
  console.error("Database-related environment variables:", Object.keys(process.env).filter(key => 
    key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('PG') || key.includes('DB')
  ));
  console.error("DATABASE_URL is:", process.env.DATABASE_URL);
  console.error("REPLIT_DB_URL is:", process.env.REPLIT_DB_URL);
  throw new Error(
    "DATABASE_URL or REPLIT_DB_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
