import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, 
  insertProductSchema, 
  insertBudgetSchema,
  insertBudgetItemSchema,
  insertDealSchema,
  insertProductionSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==================== CLIENTS ====================
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      const client = await storage.createClient(data);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const existing = await storage.getClient(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      const data = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, data);
      res.json(client);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      await storage.deleteClient(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // ==================== PRODUCTS ====================
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const existing = await storage.getProduct(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, data);
      res.json(product);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ==================== BUDGETS ====================
  app.get("/api/budgets", async (req, res) => {
    try {
      const budgets = await storage.getBudgets();
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  app.get("/api/budgets/:id", async (req, res) => {
    try {
      const budget = await storage.getBudget(req.params.id);
      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budget" });
    }
  });

  app.get("/api/budgets/:id/items", async (req, res) => {
    try {
      const items = await storage.getBudgetItems(req.params.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budget items" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const { items, ...budgetData } = req.body;
      const budgetParsed = insertBudgetSchema.parse(budgetData);
      
      // Validate all items first
      const validatedItems = items && Array.isArray(items) 
        ? items.map(item => insertBudgetItemSchema.parse(item))
        : [];
      
      const budget = await storage.createBudget(budgetParsed);
      
      // Create all items with the budget ID
      for (const item of validatedItems) {
        await storage.createBudgetItem({
          ...item,
          budgetId: budget.id
        });
      }
      
      res.status(201).json(budget);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid budget data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create budget" });
    }
  });

  app.patch("/api/budgets/:id", async (req, res) => {
    try {
      const existing = await storage.getBudget(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Budget not found" });
      }
      
      const data = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(req.params.id, data);
      res.json(budget);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid budget data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update budget" });
    }
  });

  app.delete("/api/budgets/:id", async (req, res) => {
    try {
      await storage.deleteBudgetItems(req.params.id);
      await storage.deleteBudget(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete budget" });
    }
  });

  // ==================== DEALS (Pipeline) ====================
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const data = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(data);
      res.status(201).json(deal);
    } catch (error) {
      res.status(400).json({ error: "Invalid deal data" });
    }
  });

  app.patch("/api/deals/:id", async (req, res) => {
    try {
      const existing = await storage.getDeal(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Deal not found" });
      }
      
      const data = insertDealSchema.partial().parse(req.body);
      const deal = await storage.updateDeal(req.params.id, data);
      res.json(deal);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid deal data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      await storage.deleteDeal(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete deal" });
    }
  });

  // ==================== PRODUCTION ====================
  app.get("/api/production", async (req, res) => {
    try {
      const productions = await storage.getProductions();
      res.json(productions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch production items" });
    }
  });

  app.get("/api/production/:id", async (req, res) => {
    try {
      const production = await storage.getProduction(req.params.id);
      if (!production) {
        return res.status(404).json({ error: "Production item not found" });
      }
      res.json(production);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch production item" });
    }
  });

  app.post("/api/production", async (req, res) => {
    try {
      const data = insertProductionSchema.parse(req.body);
      const production = await storage.createProduction(data);
      res.status(201).json(production);
    } catch (error) {
      res.status(400).json({ error: "Invalid production data" });
    }
  });

  app.patch("/api/production/:id", async (req, res) => {
    try {
      const existing = await storage.getProduction(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Production item not found" });
      }
      
      const data = insertProductionSchema.partial().parse(req.body);
      const production = await storage.updateProduction(req.params.id, data);
      res.json(production);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid production data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update production item" });
    }
  });

  app.delete("/api/production/:id", async (req, res) => {
    try {
      await storage.deleteProduction(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete production item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
