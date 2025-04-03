import { create } from 'zustand';
import { BurgerIngredient } from '@shared/schema';
import { defaultIngredients } from '@/data/ingredients';
import { apiRequest } from '@/lib/queryClient';

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
      // Try to fetch from API
      const response = await apiRequest("GET", "/api/ingredients");
      if (response && Array.isArray(response)) {
        set({ availableIngredients: response });
      } else {
        // Fallback to default ingredients if API call fails
        set({ availableIngredients: defaultIngredients });
      }
    } catch (error) {
      console.error("Failed to fetch ingredients:", error);
      // Fallback to default ingredients
      set({ availableIngredients: defaultIngredients });
    }
  }
}));
