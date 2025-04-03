import { 
  users, type User, type InsertUser,
  type BurgerIngredient, type CustomBurger, type InsertBurger, type Burger,
  type InsertOrder, type Order
} from "@shared/schema";
import { defaultIngredients } from "../client/src/data/ingredients";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ingredients: Map<number, BurgerIngredient>;
  private burgers: Map<number, Burger>;
  private orders: Map<number, Order>;
  private userCurrentId: number;
  private burgerCurrentId: number;
  private orderCurrentId: number;

  constructor() {
    this.users = new Map();
    this.ingredients = new Map();
    this.burgers = new Map();
    this.orders = new Map();
    
    this.userCurrentId = 1;
    this.burgerCurrentId = 1;
    this.orderCurrentId = 1;
    
    // Seed initial ingredients
    this.seedIngredients();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Ingredient methods
  async getAllIngredients(): Promise<BurgerIngredient[]> {
    return Array.from(this.ingredients.values());
  }
  
  async getIngredientsByCategory(category: string): Promise<BurgerIngredient[]> {
    return Array.from(this.ingredients.values()).filter(
      (ingredient) => ingredient.category === category
    );
  }
  
  async seedIngredients(): Promise<void> {
    // Clear existing ingredients
    this.ingredients.clear();
    
    // Add all default ingredients
    for (const ingredient of defaultIngredients) {
      this.ingredients.set(ingredient.id, ingredient);
    }
  }
  
  // Burger methods
  async saveBurger(insertBurger: InsertBurger): Promise<Burger> {
    const id = this.burgerCurrentId++;
    const burger: Burger = { ...insertBurger, id };
    this.burgers.set(id, burger);
    return burger;
  }
  
  async getAllBurgers(): Promise<Burger[]> {
    return Array.from(this.burgers.values());
  }
  
  async getBurgerById(id: number): Promise<Burger | undefined> {
    return this.burgers.get(id);
  }
  
  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const order: Order = { ...insertOrder, id };
    this.orders.set(id, order);
    return order;
  }
}

export const storage = new MemStorage();
