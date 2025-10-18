import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, 
  insertProductSchema, 
  insertBudgetSchema,
  insertBudgetItemSchema,
  insertDealSchema,
  insertProductionSchema,
  insertActivitySchema,
  insertTaskSchema,
  insertDealBudgetSchema,
  insertDealProductSchema,
  insertCompanySettingsSchema
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
    } catch (error: any) {
      console.error('Deal creation error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Invalid deal data", 
          details: error.errors,
          received: req.body 
        });
      }
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

  // ==================== ACTIVITIES ====================
  app.get("/api/activities/:entityType/:entityId", async (req, res) => {
    try {
      const { entityType, entityId } = req.params;
      const activities = await storage.getActivities(entityType, entityId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const data = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(data);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      await storage.deleteActivity(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete activity" });
    }
  });

  // ==================== TASKS ====================
  app.get("/api/tasks/:dealId", async (req, res) => {
    try {
      const tasks = await storage.getTasks(req.params.dealId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const existing = await storage.getTask(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      const data = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, data);
      res.json(task);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid task data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // ==================== DEAL-BUDGETS ====================
  app.get("/api/deal-budgets/:dealId", async (req, res) => {
    try {
      const dealBudgets = await storage.getDealBudgets(req.params.dealId);
      res.json(dealBudgets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deal budgets" });
    }
  });

  app.post("/api/deal-budgets", async (req, res) => {
    try {
      const data = insertDealBudgetSchema.parse(req.body);
      const dealBudget = await storage.createDealBudget(data);
      res.status(201).json(dealBudget);
    } catch (error) {
      res.status(400).json({ error: "Invalid deal-budget data" });
    }
  });

  app.delete("/api/deal-budgets/:id", async (req, res) => {
    try {
      await storage.deleteDealBudget(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete deal-budget" });
    }
  });

  // ==================== DEAL-PRODUCTS ====================
  app.get("/api/deal-products/:dealId", async (req, res) => {
    try {
      const dealProducts = await storage.getDealProducts(req.params.dealId);
      res.json(dealProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deal products" });
    }
  });

  app.post("/api/deal-products", async (req, res) => {
    try {
      const data = insertDealProductSchema.parse(req.body);
      const dealProduct = await storage.createDealProduct(data);
      res.status(201).json(dealProduct);
    } catch (error) {
      res.status(400).json({ error: "Invalid deal-product data" });
    }
  });

  app.delete("/api/deal-products/:id", async (req, res) => {
    try {
      await storage.deleteDealProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete deal-product" });
    }
  });

  // ==================== COMPOSITE WORKFLOWS ====================
  
  // Create budget from deal - Pre-fills budget with deal information
  app.post("/api/deals/:dealId/create-budget", async (req, res) => {
    try {
      const deal = await storage.getDeal(req.params.dealId);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }

      // Create budget with deal's client and value
      const budgetData = {
        clientId: deal.clientId,
        total: deal.value.toString(),
        status: "draft",
        deliveryTime: deal.deliveryDeadline ? `${deal.deliveryDeadline} dias` : undefined,
      };
      
      const budget = await storage.createBudget(budgetData);
      
      // Link budget to deal
      await storage.createDealBudget({
        dealId: deal.id,
        budgetId: budget.id,
        isPrimary: 1,
      });

      // Log activity
      await storage.createActivity({
        entityType: 'deal',
        entityId: deal.id,
        type: 'created',
        title: 'Orçamento criado',
        description: `Orçamento #${budget.id} criado a partir do negócio`,
      });

      res.status(201).json({ budget, dealBudget: { dealId: deal.id, budgetId: budget.id } });
    } catch (error) {
      console.error('Error creating budget from deal:', error);
      res.status(500).json({ error: "Failed to create budget from deal" });
    }
  });

  // Approve budget - Updates deal to won and creates production
  app.post("/api/budgets/:budgetId/approve", async (req, res) => {
    try {
      const budget = await storage.getBudget(req.params.budgetId);
      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }

      // Update budget status
      const updatedBudget = await storage.updateBudget(req.params.budgetId, { status: 'approved' });

      // Try to find associated deal (budget might not have a deal)
      const allDealBudgets = await storage.getDealBudgets('');
      const dealBudget = allDealBudgets.find(db => db.budgetId === budget.id);
      
      let dealId = null;
      
      if (dealBudget) {
        dealId = dealBudget.dealId;
        
        // Update deal to won
        await storage.updateDeal(dealId, { 
          status: 'won',
          stage: 'closed'
        });

        // Log deal activity
        await storage.createActivity({
          entityType: 'deal',
          entityId: dealId,
          type: 'status_change',
          title: 'Negócio ganho',
          description: 'Orçamento aprovado - negócio marcado como ganho',
        });
      }

      // Always create production when budget is approved
      const production = await storage.createProduction({
        dealId: dealId,
        budgetId: budget.id,
        status: 'awaiting',
        assignedTo: null,
        deadline: null,
      });

      // Log budget approval activity
      await storage.createActivity({
        entityType: 'budget',
          entityId: budget.id,
          type: 'status_change',
          title: 'Orçamento aprovado',
          description: 'Orçamento aprovado pelo cliente',
        });

      await storage.createActivity({
        entityType: 'production',
        entityId: production.id,
        type: 'created',
        title: 'Produção criada',
        description: `Produção criada automaticamente após aprovação do orçamento`,
      });

      res.json({ budget: updatedBudget, production });
    } catch (error) {
      console.error('Error approving budget:', error);
      res.status(500).json({ error: "Failed to approve budget" });
    }
  });

  // Move deal to next stage with activity log
  app.post("/api/deals/:dealId/move-stage", async (req, res) => {
    try {
      const { stage } = req.body;
      const deal = await storage.getDeal(req.params.dealId);
      
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }

      const stageNames: Record<string, string> = {
        contact: "Contato",
        collection: "Coleta",
        qualification: "Qualificação",
        costing: "Custo",
        sent: "Enviado",
        followup: "Follow-up",
        closed: "Fechado",
      };

      // Update stage AND updatedAt to reflect activity
      const updatedDeal = await storage.updateDeal(req.params.dealId, { 
        stage,
      });

      // Log stage change activity
      await storage.createActivity({
        entityType: 'deal',
        entityId: deal.id,
        type: 'stage_change',
        title: 'Estágio alterado',
        description: `Negócio movido de "${stageNames[deal.stage] || deal.stage}" para "${stageNames[stage] || stage}"`,
      });

      res.json(updatedDeal);
    } catch (error) {
      console.error('Error moving deal stage:', error);
      res.status(500).json({ error: "Failed to move deal stage" });
    }
  });

  // ==================== COMPANY SETTINGS ====================
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings || {
        companyName: "Zoom Comunicação Visual",
        cnpj: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        website: "",
        logo: ""
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const data = insertCompanySettingsSchema.parse(req.body);
      const settings = await storage.updateCompanySettings(data);
      res.json(settings);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid settings data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
