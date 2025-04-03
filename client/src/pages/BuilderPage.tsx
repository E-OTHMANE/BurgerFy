import { useState } from "react";
import { useLocation } from "wouter";
import IngredientsPanel from "@/components/IngredientsPanel";
import BurgerBuilder from "@/components/BurgerBuilder";
import { useBurgerStore } from "@/stores/burgerStore";
import { useToast } from "@/hooks/use-toast";

export default function BuilderPage() {
  const [_, setLocation] = useLocation();
  const { ingredients } = useBurgerStore();
  const { toast } = useToast();
  
  const handleFinish = () => {
    // Check if at least one ingredient is added
    if (ingredients.length === 0) {
      toast({
        title: "Empty Burger",
        description: "Please add at least one ingredient to your burger.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if bun is present (first and last ingredients should be buns)
    const hasBun = ingredients.some(ing => ing.category === "buns");
    if (!hasBun) {
      toast({
        title: "Missing Bun",
        description: "Your burger needs at least one bun.",
        variant: "destructive",
      });
      return;
    }
    
    setLocation("/summary");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-display text-2xl md:text-3xl">BurgerFy</h1>
          <div className="flex items-center gap-4">
            <button className="text-accent hover:text-accent/80 font-medium">
              <i className="ri-menu-line mr-1"></i> Menu
            </button>
            <button className="text-accent hover:text-accent/80 font-medium">
              <i className="ri-shopping-cart-2-line mr-1"></i> Cart
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Ingredients Panel (Left) */}
        <IngredientsPanel />
        
        {/* Burger Builder (Center) */}
        <BurgerBuilder onFinish={handleFinish} />
      </div>
    </div>
  );
}
