import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Initialize the database connection
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL!);
export const db = drizzle(sql, { schema });

// Export types
export type DbClient = typeof db;
