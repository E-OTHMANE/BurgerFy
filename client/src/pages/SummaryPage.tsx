import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBurgerStore } from "@/stores/burgerStore";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { UserIcon, ShoppingCartIcon, HomeIcon } from "lucide-react";

export default function SummaryPage() {
  const [_, setLocation] = useLocation();
  const { ingredients, clearIngredients } = useBurgerStore();
  const [burgerName, setBurgerName] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleEditBurger = () => {
    setLocation("/builder");
  };
  
  const handleAddToCart = async () => {
    if (!burgerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please name your burger creation.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if user is logged in
      if (user) {
        // Save burger to database
        await apiRequest("POST", "/api/burgers", {
          name: burgerName,
          ingredients: JSON.stringify(ingredients),
          createdAt: new Date().toISOString(),
        });
        
        // Invalidate burger queries
        queryClient.invalidateQueries({ queryKey: ["/api/my-burgers"] });
        queryClient.invalidateQueries({ queryKey: ["/api/burgers"] });
        
        toast({
          title: "Burger Saved!",
          description: `Your "${burgerName}" has been saved and added to cart.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Success!",
          description: `Your "${burgerName}" has been added to cart.`,
          variant: "default",
        });
      }
      
      // Clear ingredients and go back to welcome page
      clearIngredients();
      setLocation("/");
    } catch (error) {
      console.error('Burger save error:', error);
      
      // Show more specific error message if available
      let errorMessage = "Failed to add burger to cart. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract error details from response
        try {
          const errorObj = error as any;
          if (errorObj.errors && Array.isArray(errorObj.errors)) {
            errorMessage = errorObj.errors[0]?.message || errorMessage;
          } else if (errorObj.message) {
            errorMessage = errorObj.message;
          }
        } catch (e) {
          // Fall back to generic message
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent/80 p-2"
              onClick={() => setLocation("/")}
            >
              <HomeIcon className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-2xl md:text-3xl">BurgerFy</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent/80 font-medium flex items-center gap-1"
              onClick={() => setLocation(user ? "/profile" : "/auth")}
            >
              <UserIcon className="h-5 w-5" />
              {user ? "Profile" : "Sign In"}
            </Button>
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent/80 font-medium flex items-center gap-1"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Cart
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-light">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-dark mb-2">Your Burger is Ready!</h2>
            <p className="text-gray-600">Name your creation and proceed to order</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
            {/* Completed Burger Image */}
            <div className="mb-6 text-center">
              {ingredients.length > 0 ? (
                <div className="w-64 h-64 mx-auto relative">
                  {ingredients.map((ingredient, index) => (
                    <img 
                      key={index}
                      src={ingredient.image} 
                      alt={ingredient.name} 
                      className="w-full h-full object-contain absolute top-0 left-0"
                      style={{ 
                        zIndex: ingredients.length - index,
                        transform: `translateY(${index * -5}px)` 
                      }}
                    />
                  ))}
                </div>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Completed burger" 
                  className="w-64 h-64 object-contain mx-auto rounded-lg" 
                />
              )}
            </div>
            
            {/* Ingredients Summary */}
            <div className="mb-6">
              <h3 className="text-dark font-medium mb-2">Ingredients:</h3>
              <ul className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">✓ {ingredient.name}</li>
                ))}
              </ul>
            </div>
            
            {/* Burger Name Form */}
            <div className="mb-6">
              <label htmlFor="burger-name" className="block text-dark font-medium mb-2">
                Name Your Creation:
              </label>
              <Input
                id="burger-name"
                placeholder="e.g., The Ultimate Cheeseburger"
                value={burgerName}
                onChange={(e) => setBurgerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <Button
                onClick={handleEditBurger}
                variant="outline"
                className="order-2 md:order-1 bg-white border-2 border-primary text-primary hover:bg-primary/5 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i> Edit Burger
              </Button>
              <Button
                onClick={handleAddToCart}
                className="order-1 md:order-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Add to Cart <i className="ri-shopping-cart-2-line ml-2"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
