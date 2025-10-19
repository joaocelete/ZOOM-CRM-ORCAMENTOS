import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("employee"), // 'admin', 'salesperson', 'employee'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
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
  isFavorite: boolean("is_favorite").notNull().default(false),
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
  
  // Additional configuration fields
  observations: text("observations"), // Observações gerais do orçamento
  paymentTerms: text("payment_terms"), // Condições de pagamento customizadas
  warranty: text("warranty"), // Garantia customizada
  installationIncluded: text("installation_included"), // 'yes', 'no', 'optional'
  material: text("material"), // Material principal (lona, vinil, ACM, etc.)
  finishing: text("finishing"), // Acabamento (ilhoses, laminação, etc.)
  installationDeadline: text("installation_deadline"), // Prazo para instalação
  validityDays: integer("validity_days"), // Validade do orçamento em dias
  
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
  
  // Deal details
  category: text("category"), // 'sinalização', 'adesivos', 'banners', etc.
  origin: text("origin"), // 'website', 'instagram', 'indicação', 'whatsapp', etc.
  
  // Service information
  description: text("description"),
  quantity: integer("quantity"),
  dimensions: text("dimensions"), // ex: "3m x 2m"
  material: text("material"), // 'lona', 'vinil', 'acm', 'acrílico', etc.
  finishing: text("finishing"), // 'ilhós', 'bastão', 'moldura', 'laminação', etc.
  deliveryDeadline: integer("delivery_deadline"), // days
  installationRequired: text("installation_required"), // 'yes', 'no', 'evaluate'
  
  // Observations
  observations: text("observations"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const production = pgTable("production", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id"),
  budgetId: varchar("budget_id").notNull(),
  status: text("status").notNull(), // 'awaiting', 'production', 'installation', 'completed'
  assignedTo: text("assigned_to"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activities - Log de todas interações e mudanças
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // 'deal', 'client', 'budget', 'production'
  entityId: varchar("entity_id").notNull(),
  type: text("type").notNull(), // 'note', 'call', 'email', 'whatsapp', 'meeting', 'stage_change', 'status_change', 'created', 'updated'
  title: text("title").notNull(),
  description: text("description"),
  userId: varchar("user_id"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
});

// Tasks - Tarefas vinculadas a deals
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(), // 'pending', 'completed', 'cancelled'
  priority: text("priority"), // 'low', 'medium', 'high'
  dueDate: timestamp("due_date"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Deal-Budget Junction (many-to-many)
export const dealBudgets = pgTable("deal_budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull(),
  budgetId: varchar("budget_id").notNull(),
  isPrimary: integer("is_primary").default(0), // 1 for primary budget, 0 for alternatives
  createdAt: timestamp("created_at").defaultNow(),
});

// Deal Products - Produtos específicos do deal
export const dealProducts = pgTable("deal_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull(),
  productId: varchar("product_id"),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  dimensions: text("dimensions"), // ex: "3m x 2m"
  material: text("material"),
  finishing: text("finishing"),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

// Company Settings (singleton table)
export const companySettings = pgTable("company_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull().default("Zoom Comunicação Visual"),
  cnpj: text("cnpj"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  logo: text("logo"), // base64 encoded image
  pdfTemplate: text("pdf_template"), // HTML template for PDF generation
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, lastLoginAt: true, passwordHash: true })
  .extend({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    role: z.enum(["admin", "salesperson", "employee"]).default("employee"),
  });

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  remember: z.boolean().optional().default(false),
});

export const insertClientSchema = createInsertSchema(clients).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertBudgetItemSchema = createInsertSchema(budgetItems)
  .omit({ id: true })
  .extend({
    // budgetId is set by backend after budget creation
    budgetId: z.string().optional(),
    // subtotal can be auto-calculated from quantity * value
    subtotal: z.coerce.string().optional(),
    quantity: z.coerce.number().optional(),
  });
export const insertBudgetSchema = createInsertSchema(budgets)
  .omit({ id: true, createdAt: true })
  .extend({
    status: z.string().default('draft'),
    total: z.coerce.string().default('0'),
  });
export const insertDealSchema = createInsertSchema(deals)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    stage: z.string().default('contact'),
    status: z.string().default('active'),
    // Coerce numeric values from form strings
    value: z.coerce.string(),
    quantity: z.coerce.number().int().optional().nullable(),
    deliveryDeadline: z.coerce.number().int().optional().nullable(),
  });
export const insertProductionSchema = createInsertSchema(production).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true, completedAt: true });
export const insertDealBudgetSchema = createInsertSchema(dealBudgets).omit({ id: true, createdAt: true });
export const insertDealProductSchema = createInsertSchema(dealProducts).omit({ id: true });
export const insertCompanySettingsSchema = createInsertSchema(companySettings).omit({ id: true, updatedAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;

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

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertDealBudget = z.infer<typeof insertDealBudgetSchema>;
export type DealBudget = typeof dealBudgets.$inferSelect;

export type InsertDealProduct = z.infer<typeof insertDealProductSchema>;
export type DealProduct = typeof dealProducts.$inferSelect;

export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;
export type CompanySettings = typeof companySettings.$inferSelect;
