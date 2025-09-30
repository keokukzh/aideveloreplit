import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set. See .env.example");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export async function ensureDbConnected(): Promise<void> {
  // Pool connects lazily per query; nothing to do.
}
// Cast to any to avoid type mismatches due to differing @types/pg versions
export const db = drizzle(pool as any);


