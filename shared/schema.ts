import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Ingredient schema
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  position: integer("position").notNull(), // For burger layer positioning
});

export const insertIngredientSchema = createInsertSchema(ingredients).pick({
  name: true,
  category: true,
  image: true,
  position: true,
});

// Custom burger schema
export const burgers = pgTable("burgers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("userId").notNull(),
  ingredients: jsonb("ingredients").notNull(), // Array of ingredient IDs
  createdAt: text("createdAt").notNull(), // ISO date string
});

export const insertBurgerSchema = createInsertSchema(burgers).pick({
  name: true,
  userId: true,
  ingredients: true,
  createdAt: true,
});

// Set order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  burgerId: integer("burgerId").notNull(),
  status: text("status").notNull(), // pending, completed, cancelled
  createdAt: text("createdAt").notNull(), // ISO date string
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  burgerId: true,
  status: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

export type InsertBurger = z.infer<typeof insertBurgerSchema>;
export type Burger = typeof burgers.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Define burger ingredient interface for frontend use
export interface BurgerIngredient {
  id: number;
  name: string;
  category: string;
  image: string;
  position: number;
}

// Define custom burger interface for frontend use
export interface CustomBurger {
  id?: number;
  name: string;
  ingredients: BurgerIngredient[];
  createdAt?: string;
}
