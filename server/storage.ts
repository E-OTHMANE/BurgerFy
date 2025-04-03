import { 
  users, type User, type InsertUser,
  ingredients, burgers, orders,
  type BurgerIngredient, type CustomBurger, type InsertBurger, type Burger,
  type InsertOrder, type Order, type InsertIngredient
} from "@shared/schema";
import { defaultIngredients } from "../client/src/data/ingredients";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

// Storage interface with all CRUD methods needed for the app
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ingredient methods
  getAllIngredients(): Promise<BurgerIngredient[]>;
  getIngredientsByCategory(category: string): Promise<BurgerIngredient[]>;
  seedIngredients(): Promise<void>;
  
  // Burger methods
  saveBurger(burger: InsertBurger): Promise<Burger>;
  getAllBurgers(): Promise<Burger[]>;
  getBurgerById(id: number): Promise<Burger | undefined>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Seed initial ingredients
    this.seedIngredients();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Ingredient methods
  async getAllIngredients(): Promise<BurgerIngredient[]> {
    const dbIngredients = await db
      .select()
      .from(ingredients)
      .orderBy(asc(ingredients.id));
    
    return dbIngredients.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      image: ingredient.image,
      position: ingredient.position
    }));
  }
  
  async getIngredientsByCategory(category: string): Promise<BurgerIngredient[]> {
    const dbIngredients = await db
      .select()
      .from(ingredients)
      .where(eq(ingredients.category, category))
      .orderBy(asc(ingredients.id));
    
    return dbIngredients.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      image: ingredient.image,
      position: ingredient.position
    }));
  }
  
  async seedIngredients(): Promise<void> {
    try {
      // Check if ingredients already exist
      const existingIngredients = await db.select().from(ingredients).limit(1);
      if (existingIngredients.length > 0) {
        console.log("Ingredients already seeded");
        return;
      }
      
      // Prepare ingredients without IDs (they will be auto-generated)
      const ingredientsToInsert = defaultIngredients.map(ingredient => ({
        name: ingredient.name,
        category: ingredient.category,
        image: ingredient.image,
        position: ingredient.position
      }));
      
      // Insert all ingredients
      await db.insert(ingredients).values(ingredientsToInsert);
      console.log("Ingredients seeded successfully");
    } catch (error) {
      console.error("Failed to seed ingredients:", error);
    }
  }
  
  // Burger methods
  async saveBurger(insertBurger: InsertBurger): Promise<Burger> {
    const [burger] = await db
      .insert(burgers)
      .values(insertBurger)
      .returning();
    return burger;
  }
  
  async getAllBurgers(): Promise<Burger[]> {
    return db.select().from(burgers);
  }
  
  async getBurgerById(id: number): Promise<Burger | undefined> {
    const [burger] = await db.select().from(burgers).where(eq(burgers.id, id));
    return burger || undefined;
  }
  
  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }
}

export const storage = new DatabaseStorage();
