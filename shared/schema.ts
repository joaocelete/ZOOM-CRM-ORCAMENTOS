import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city"),
  state: text("state"),
  notes: text("notes"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  pricePerM2: decimal("price_per_m2", { precision: 10, scale: 2 }),
  fixedPrice: decimal("fixed_price", { precision: 10, scale: 2 }),
  type: text("type").notNull(), // 'm2', 'fixed', 'service'
  category: text("category"),
  productionTime: integer("production_time"), // days
});

export const budgetItems = pgTable("budget_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  budgetId: varchar("budget_id").notNull(),
  productName: text("product_name").notNull(),
  type: text("type").notNull(),
  width: decimal("width", { precision: 10, scale: 2 }),
  height: decimal("height", { precision: 10, scale: 2 }),
  pricePerM2: decimal("price_per_m2", { precision: 10, scale: 2 }),
  fixedPrice: decimal("fixed_price", { precision: 10, scale: 2 }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'draft', 'sent', 'approved', 'rejected'
  deliveryTime: text("delivery_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  budgetId: varchar("budget_id"),
  title: text("title").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  stage: text("stage").notNull(), // 'contact', 'collection', 'qualification', 'costing', 'sent', 'followup', 'closed'
  status: text("status").notNull(), // 'active', 'won', 'lost'
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const production = pgTable("production", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull(),
  budgetId: varchar("budget_id").notNull(),
  status: text("status").notNull(), // 'awaiting', 'production', 'installation', 'completed'
  assignedTo: text("assigned_to"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true });
export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true, createdAt: true });
export const insertDealSchema = createInsertSchema(deals).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProductionSchema = createInsertSchema(production).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

export type InsertProduction = z.infer<typeof insertProductionSchema>;
export type Production = typeof production.$inferSelect;
