import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean as pgBoolean,
} from "drizzle-orm/pg-core";

export const AIOutput = pgTable("aiOutput", {
  id: serial("id").primaryKey(),
  formData: varchar("formData").notNull(),
  aiResponse: text("aiResponse"),
  templateSlug: varchar("templateSlug").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
});

export const UserPlan = pgTable("userPlan", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  planName: varchar("planName").notNull(),
  planPrice: integer("planPrice").notNull(),
  credits: integer("credits").notNull(),
  startDate: timestamp("startDate").notNull().defaultNow(),
  endDate: timestamp("endDate").notNull(),
  isActive: pgBoolean("isActive").notNull().default(true),
  paymentId: varchar("paymentId"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
