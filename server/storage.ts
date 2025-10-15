import { 
  type User, 
  type InsertUser,
  type Client,
  type InsertClient,
  type Product,
  type InsertProduct,
  type Budget,
  type InsertBudget,
  type BudgetItem,
  type InsertBudgetItem,
  type Deal,
  type InsertDeal,
  type Production,
  type InsertProduction,
  users,
  clients,
  products,
  budgets,
  budgetItems,
  deals,
  production
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Budgets
  getBudgets(): Promise<Budget[]>;
  getBudget(id: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget>;
  deleteBudget(id: string): Promise<void>;
  
  // Budget Items
  getBudgetItems(budgetId: string): Promise<BudgetItem[]>;
  createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem>;
  deleteBudgetItems(budgetId: string): Promise<void>;
  
  // Deals (Pipeline)
  getDeals(): Promise<Deal[]>;
  getDeal(id: string): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal>;
  deleteDeal(id: string): Promise<void>;
  
  // Production
  getProductions(): Promise<Production[]>;
  getProduction(id: string): Promise<Production | undefined>;
  createProduction(prod: InsertProduction): Promise<Production>;
  updateProduction(id: string, prod: Partial<InsertProduction>): Promise<Production>;
  deleteProduction(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.name));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set(updateData)
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.name));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    return await db.select().from(budgets).orderBy(desc(budgets.createdAt));
  }

  async getBudget(id: string): Promise<Budget | undefined> {
    const [budget] = await db.select().from(budgets).where(eq(budgets.id, id));
    return budget || undefined;
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const [budget] = await db.insert(budgets).values(insertBudget).returning();
    return budget;
  }

  async updateBudget(id: string, updateData: Partial<InsertBudget>): Promise<Budget> {
    const [budget] = await db
      .update(budgets)
      .set(updateData)
      .where(eq(budgets.id, id))
      .returning();
    return budget;
  }

  async deleteBudget(id: string): Promise<void> {
    await db.delete(budgets).where(eq(budgets.id, id));
  }

  // Budget Items
  async getBudgetItems(budgetId: string): Promise<BudgetItem[]> {
    return await db.select().from(budgetItems).where(eq(budgetItems.budgetId, budgetId));
  }

  async createBudgetItem(insertItem: InsertBudgetItem): Promise<BudgetItem> {
    const [item] = await db.insert(budgetItems).values(insertItem).returning();
    return item;
  }

  async deleteBudgetItems(budgetId: string): Promise<void> {
    await db.delete(budgetItems).where(eq(budgetItems.budgetId, budgetId));
  }

  // Deals
  async getDeals(): Promise<Deal[]> {
    const results = await db
      .select({
        deal: deals,
        client: clients,
      })
      .from(deals)
      .leftJoin(clients, eq(deals.clientId, clients.id))
      .orderBy(desc(deals.createdAt));
    
    return results.map(r => ({
      ...r.deal,
      assignedTo: r.client?.name || r.client?.company || r.deal.assignedTo,
    }));
  }

  async getDeal(id: string): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const [deal] = await db.insert(deals).values(insertDeal).returning();
    return deal;
  }

  async updateDeal(id: string, updateData: Partial<InsertDeal>): Promise<Deal> {
    const [deal] = await db
      .update(deals)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
    return deal;
  }

  async deleteDeal(id: string): Promise<void> {
    await db.delete(deals).where(eq(deals.id, id));
  }

  // Production
  async getProductions(): Promise<Production[]> {
    return await db.select().from(production).orderBy(desc(production.createdAt));
  }

  async getProduction(id: string): Promise<Production | undefined> {
    const [prod] = await db.select().from(production).where(eq(production.id, id));
    return prod || undefined;
  }

  async createProduction(insertProduction: InsertProduction): Promise<Production> {
    const [prod] = await db.insert(production).values(insertProduction).returning();
    return prod;
  }

  async updateProduction(id: string, updateData: Partial<InsertProduction>): Promise<Production> {
    const [prod] = await db
      .update(production)
      .set(updateData)
      .where(eq(production.id, id))
      .returning();
    return prod;
  }

  async deleteProduction(id: string): Promise<void> {
    await db.delete(production).where(eq(production.id, id));
  }
}

export const storage = new DatabaseStorage();
