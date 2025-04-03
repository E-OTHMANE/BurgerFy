import { create } from 'zustand';
import { Burger, BurgerIngredient } from '@shared/schema';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: string;
  burger: Burger;
  ingredients: BurgerIngredient[];
  quantity: number;
  price: number;
};

interface CartStore {
  items: CartItem[];
  addItem: (burger: Burger, ingredients: BurgerIngredient[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// Calculate burger price based on ingredients
const calculateBurgerPrice = (ingredients: BurgerIngredient[]): number => {
  // Base price + each ingredient adds to the cost
  const basePrice = 4.99;
  const ingredientCost = ingredients.length * 0.75;
  return basePrice + ingredientCost;
};

// Create cart store with persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (burger, ingredients) => {
        set((state) => {
          // Generate a unique id for the cart item
          const id = `${burger.id}-${Date.now()}`;
          const price = calculateBurgerPrice(ingredients);
          
          return {
            items: [...state.items, { id, burger, ingredients, quantity: 1, price }],
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);