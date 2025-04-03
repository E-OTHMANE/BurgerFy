import { useBurgerStore } from "@/stores/burgerStore";
import { BurgerIngredient } from "@shared/schema";
import { useState } from "react";
import { motion } from "framer-motion";

interface IngredientCardProps {
  ingredient: BurgerIngredient;
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const { addIngredient } = useBurgerStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddIngredient = () => {
    setIsAdding(true);
    
    // Add ingredient to burger store
    addIngredient(ingredient);
    
    // Reset animation state after a short delay
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  return (
    <motion.div 
      className="ingredient-card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isAdding ? { scale: [1, 0.9, 1] } : {}}
      onClick={handleAddIngredient}
    >
      <div className="relative">
        <img 
          src={ingredient.image} 
          alt={ingredient.name} 
          className="w-full h-24 object-cover" 
        />
        <div className="ingredient-overlay absolute inset-0 flex items-center justify-center">
          <button className="bg-primary text-white rounded-full p-2 hover:bg-primary/90">
            <i className="ri-add-line text-lg"></i>
          </button>
        </div>
      </div>
      <div className="p-2 text-center">
        <h3 className="font-medium text-sm">{ingredient.name}</h3>
      </div>
    </motion.div>
  );
}
