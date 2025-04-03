import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import IngredientCard from "./IngredientCard";
import { categories } from "@/data/ingredients";
import { Skeleton } from "@/components/ui/skeleton";

export default function IngredientsPanel() {
  const [activeCategory, setActiveCategory] = useState("buns");
  
  // Fetch ingredients from API
  const { data: ingredients, isLoading } = useQuery({
    queryKey: ["/api/ingredients"],
    staleTime: Infinity,
  });
  
  // Filter ingredients by active category
  const filteredIngredients = ingredients?.filter(
    (ingredient) => ingredient.category === activeCategory
  ) || [];

  return (
    <div className="bg-white w-full md:w-80 md:min-h-screen border-r border-gray-200 shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-display text-xl text-dark">Ingredients</h2>
        <p className="text-sm text-gray-500">Select items to build your burger</p>
      </div>
      
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-1 p-2 border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab px-4 py-2 whitespace-nowrap rounded-lg border-2 text-sm font-medium transition-colors flex-shrink-0 ${
              activeCategory === category.id
                ? "active border-primary bg-primary/10 text-primary"
                : "border-transparent hover:bg-gray-50"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Ingredients List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          // Loading skeletons
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="w-full h-24" />
                <div className="p-2">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredIngredients.map((ingredient) => (
              <IngredientCard key={ingredient.id} ingredient={ingredient} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
