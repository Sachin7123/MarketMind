import {
  pgTable,
  serial,
  timestamp,
  integer,
  text,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";

// Views table to track content views
export const views = pgTable("views", {
  id: serial("id").primaryKey(),
  contentId: text("content_id").notNull(),
  userId: text("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// User activity table to track user actions
export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  contentId: text("content_id"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: text("metadata"),
});

// Transactions table to track revenue
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: decimal("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: text("metadata"),
});

// User interactions table to track engagement
export const userInteractions = pgTable("user_interactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  contentId: text("content_id").notNull(),
  interactionType: text("interaction_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: text("metadata"),
});

// Daily analytics table for aggregated data
export const analyticsDaily = pgTable("analytics_daily", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  views: integer("views").default(0),
  users: integer("users").default(0),
  revenue: decimal("revenue").default("0"),
  engagementRate: decimal("engagement_rate").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content table
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: text("metadata"),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  interests: text("interests").array(),
  notificationSettings: text("notification_settings"),
  theme: text("theme").default("light"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
