import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Burger, BurgerIngredient } from "@shared/schema";
import { Loader2, ChevronLeft, User, Clock, Star, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
// Import framer-motion for animations

export default function BurgerDetailsPage() {
  const params = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [burgerIngredients, setBurgerIngredients] = useState<BurgerIngredient[]>([]);

  // Fetch the burger details
  const {
    data: burger,
    isLoading,
    error,
  } = useQuery<Burger>({
    queryKey: [`/api/burgers/${params.id}`],
    enabled: !!params.id,
  });

  // Parse ingredients when burger data is available
  useEffect(() => {
    if (burger?.ingredients) {
      try {
        // Handle both string and object formats
        if (typeof burger.ingredients === 'string') {
          const parsed = JSON.parse(burger.ingredients);
          if (Array.isArray(parsed)) {
            // Validate that each ingredient has required properties
            const validIngredients = parsed.filter((item): item is BurgerIngredient => 
              item && 
              typeof item === 'object' && 
              'id' in item && 
              'name' in item && 
              'category' in item &&
              'image' in item &&
              'position' in item
            );
            setBurgerIngredients(validIngredients);
          }
        } else if (Array.isArray(burger.ingredients)) {
          // Validate that each ingredient has required properties
          const validIngredients = burger.ingredients.filter((item): item is BurgerIngredient => 
            item && 
            typeof item === 'object' && 
            'id' in item && 
            'name' in item && 
            'category' in item &&
            'image' in item &&
            'position' in item
          );
          setBurgerIngredients(validIngredients);
        } else if (burger.ingredients && typeof burger.ingredients === 'object') {
          // Validate that the object has required properties
          const item = burger.ingredients;
          if ('id' in item && 
              'name' in item && 
              'category' in item && 
              'image' in item && 
              'position' in item) {
            setBurgerIngredients([burger.ingredients as BurgerIngredient]);
          }
        }
      } catch (err) {
        console.error("Error parsing burger ingredients:", err);
        setBurgerIngredients([]);
      }
    }
  }, [burger]);

  // Import cart store
  const { addItem } = useCartStore();
  
  // Handler for adding burger to cart
  const handleAddToCart = () => {
    if (burger && burgerIngredients.length > 0) {
      addItem(burger, burgerIngredients);
      toast({
        title: "Added to Cart",
        description: `${burger.name} has been added to your cart.`,
      });
      // Optional: navigate to cart
      // navigate("/cart");
    } else {
      toast({
        title: "Cannot add to cart",
        description: "This burger has no ingredients",
        variant: "destructive",
      });
    }
  };

  // Handler for creating a similar burger
  const handleCreateSimilar = () => {
    // Logic to pre-populate burger builder with these ingredients
    // For now, just navigate to builder
    navigate("/builder");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !burger) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Burger</h1>
        <p className="mb-6 text-muted-foreground">
          Sorry, we couldn't find the burger you're looking for.
        </p>
        <Button onClick={() => navigate("/explore")}>
          Back to Explore
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => navigate("/explore")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>
        <h1 className="text-3xl font-bold">Burger Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Burger image */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="relative h-64 md:h-80 flex items-center justify-center bg-muted rounded-lg">
              {burgerIngredients.length > 0 ? (
                <div className="w-full h-full relative">
                  {burgerIngredients.map((ingredient, index) => (
                    <motion.img 
                      key={index}
                      src={ingredient.image} 
                      alt={ingredient.name} 
                      className="w-full h-full object-contain absolute top-0 left-0"
                      style={{ 
                        zIndex: burgerIngredients.length - index,
                      }}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: index * -5, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-6xl">🍔</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right column - Burger details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{burger.name}</CardTitle>
            <CardDescription>
              Created on {format(new Date(burger.createdAt), "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Created by User #{burger.userId}
              </span>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Ingredients</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {burgerIngredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md">
                    <img 
                      src={ingredient.image} 
                      alt={ingredient.name}
                      className="h-6 w-6 object-contain" 
                    />
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                {burgerIngredients.length} ingredients
              </div>

              {burgerIngredients.some(i => i && i.category === "Meat") && (
                <div className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm">
                  Contains meat
                </div>
              )}

              {burgerIngredients.some(i => i && i.category === "Cheese") && (
                <div className="bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-sm">
                  Contains cheese
                </div>
              )}

              {burgerIngredients.some(i => i && i.category === "Vegetables") && (
                <div className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm">
                  Contains veggies
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={handleCreateSimilar}
              className="flex-1"
            >
              Create Similar
            </Button>
            <Button 
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* User reviews section - can be expanded later */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Community Comments</CardTitle>
          <CardDescription>
            What others are saying about this burger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center text-muted-foreground">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}