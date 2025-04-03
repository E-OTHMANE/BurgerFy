import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBurgerSchema, insertOrderSchema, insertIngredientSchema } from "@shared/schema";
import { z } from "zod";
import { defaultIngredients } from "../client/src/data/ingredients";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  // Get all ingredients
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  // Get ingredients by category
  app.get("/api/ingredients/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const ingredients = await storage.getIngredientsByCategory(category);
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredients by category" });
    }
  });

  // Save custom burger - protected route
  app.post("/api/burgers", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to save a burger" });
      }

      const parsedBody = insertBurgerSchema.parse({
        ...req.body,
        userId: req.user!.id, // Associate burger with the authenticated user
      });
      
      const burger = await storage.saveBurger(parsedBody);
      res.status(201).json(burger);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid burger data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save burger" });
      }
    }
  });

  // Get all saved burgers
  app.get("/api/burgers", async (req, res) => {
    try {
      const burgers = await storage.getAllBurgers();
      res.json(burgers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch burgers" });
    }
  });
  
  // Get burgers for the current user - protected route
  app.get("/api/my-burgers", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to access your burgers" });
      }
      
      const burgers = await storage.getBurgersByUserId(req.user!.id);
      res.json(burgers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your burgers" });
    }
  });

  // Get burger by ID
  app.get("/api/burgers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const burger = await storage.getBurgerById(parseInt(id));
      if (!burger) {
        return res.status(404).json({ message: "Burger not found" });
      }
      res.json(burger);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch burger" });
    }
  });

  // Create new order - protected route
  app.post("/api/orders", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to place an order" });
      }

      const parsedBody = insertOrderSchema.parse({
        ...req.body,
        userId: req.user!.id, // Associate order with the authenticated user
      });
      
      const order = await storage.createOrder(parsedBody);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  // Seed initial ingredients (for development)
  app.post("/api/seed", async (req, res) => {
    try {
      await storage.seedIngredients();
      res.json({ message: "Ingredients seeded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed ingredients" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
