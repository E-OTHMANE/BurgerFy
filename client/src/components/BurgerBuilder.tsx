import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BurgerStack from "./BurgerStack";
import { useBurgerStore } from "@/stores/burgerStore";

interface BurgerBuilderProps {
  onFinish: () => void;
}

export default function BurgerBuilder({ onFinish }: BurgerBuilderProps) {
  const { ingredients, removeIngredient } = useBurgerStore();
  const [isEmpty, setIsEmpty] = useState(true);
  
  // Check if burger is empty
  useEffect(() => {
    setIsEmpty(ingredients.length === 0);
  }, [ingredients]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 bg-light">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-dark mb-2">Build Your Burger</h2>
          <p className="text-gray-600">Add ingredients from the left panel</p>
        </div>
        
        {/* Burger Preview Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 relative min-h-[400px] flex flex-col items-center justify-center">
          {/* Empty State */}
          {isEmpty && (
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                alt="Empty burger" 
                className="w-48 h-48 object-contain mx-auto opacity-30 mb-4" 
              />
              <p className="text-gray-400">Your burger is empty!</p>
              <p className="text-gray-400 text-sm">Start by adding a bun and ingredients</p>
            </div>
          )}
          
          {/* Burger Stack */}
          {!isEmpty && <BurgerStack />}
          
          {/* Selected Ingredients List */}
          {!isEmpty && (
            <div className="mt-6 w-full">
              <h3 className="text-dark font-medium mb-2">Selected Ingredients:</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <ul className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-sm">{ingredient.name}</span>
                      <button 
                        className="text-danger hover:text-danger/80"
                        onClick={() => removeIngredient(index)}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Finish Button */}
      <div className="mt-6 w-full max-w-lg flex justify-end">
        <Button 
          onClick={onFinish}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-md"
        >
          Finish <i className="ri-arrow-right-line ml-2"></i>
        </Button>
      </div>
    </div>
  );
}
