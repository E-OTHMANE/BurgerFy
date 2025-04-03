import { create } from 'zustand';
import { BurgerIngredient } from '@shared/schema';
import { defaultIngredients } from '@/data/ingredients';

interface BurgerStore {
  ingredients: BurgerIngredient[];
  availableIngredients: BurgerIngredient[];
  addIngredient: (ingredient: BurgerIngredient) => void;
  removeIngredient: (index: number) => void;
  clearIngredients: () => void;
  fetchIngredients: () => Promise<void>;
}

export const useBurgerStore = create<BurgerStore>((set, get) => ({
  ingredients: [],
  availableIngredients: defaultIngredients,
  
  addIngredient: (ingredient) => {
    set((state) => ({
      ingredients: [...state.ingredients, ingredient]
    }));
  },
  
  removeIngredient: (index) => {
    set((state) => ({
      ingredients: state.ingredients.filter((_, i) => i !== index)
    }));
  },
  
  clearIngredients: () => {
    set({ ingredients: [] });
  },
  
  fetchIngredients: async () => {
    try {
      // In a real app, we would fetch from API
      // For now, use the default ingredients
      set({ availableIngredients: defaultIngredients });
    } catch (error) {
      console.error("Failed to fetch ingredients:", error);
    }
  }
}));
