import { motion, AnimatePresence } from "framer-motion";
import { useBurgerStore } from "@/stores/burgerStore";

export default function BurgerStack() {
  const { ingredients } = useBurgerStore();
  
  // Sort ingredients by position for proper stacking
  const sortedIngredients = [...ingredients].sort((a, b) => a.position - b.position);

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence>
        {sortedIngredients.map((ingredient, index) => (
          <motion.div 
            key={`${ingredient.id}-${index}`}
            className={`burger-layer w-64 ${index < sortedIngredients.length - 1 ? '-mb-4' : ''} z-${50 - index}`}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={ingredient.image} 
              alt={ingredient.name} 
              className="w-full" 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
