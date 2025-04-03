import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Burger } from "@shared/schema";
import { Loader2, ChevronLeft, Search } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function ExplorePage() {
  const [_, navigate] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const PAGE_SIZE = 9; // 9 burgers per page

  // Fetch all burgers
  const {
    data: burgers,
    isLoading,
    error,
  } = useQuery<Burger[]>({
    queryKey: ["/api/burgers"],
  });

  // Filter burgers based on search query
  const filteredBurgers = burgers?.filter(burger => 
    burger.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil((filteredBurgers?.length || 0) / PAGE_SIZE);
  const displayedBurgers = filteredBurgers.slice(
    (currentPage - 1) * PAGE_SIZE, 
    currentPage * PAGE_SIZE
  );

  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Explore Burger Creations</h1>
        </div>
        
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search burgers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Community Burger Gallery</CardTitle>
          <CardDescription>
            Browse burgers created by the BurgerFy community. Get inspired for your next creation!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">
              <p>Error loading burgers. Please try again.</p>
            </div>
          ) : filteredBurgers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No burgers match your search." : "No burgers found in the gallery."}
              </p>
              <Button onClick={() => navigate("/builder")}>Create the First Burger</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBurgers.map((burger) => {
                // Parse ingredients from JSON string safely
                let burgerIngredients = [];
                try {
                  // Handle both string and object format
                  if (typeof burger.ingredients === 'string') {
                    burgerIngredients = JSON.parse(burger.ingredients);
                  } else if (Array.isArray(burger.ingredients)) {
                    burgerIngredients = burger.ingredients;
                  } else if (burger.ingredients && typeof burger.ingredients === 'object') {
                    burgerIngredients = [burger.ingredients];
                  }
                } catch (err) {
                  console.error("Error parsing burger ingredients:", err);
                }
                
                // Display first ingredient image or fallback
                const firstIngredient = Array.isArray(burgerIngredients) && burgerIngredients.length > 0 
                  ? burgerIngredients[0] 
                  : null;
                
                return (
                  <Card key={burger.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-secondary/30 h-40 flex items-center justify-center">
                      {firstIngredient && firstIngredient.image ? (
                        <img 
                          src={firstIngredient.image} 
                          alt={firstIngredient.name || 'Burger ingredient'} 
                          className="h-32 w-32 object-contain"
                        />
                      ) : (
                        <div className="text-4xl">🍔</div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-1 truncate">{burger.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        Created on {format(new Date(burger.createdAt), "MMM d, yyyy")}
                      </p>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center">
                        <p className="text-sm">
                          <span className="font-medium">{Array.isArray(burgerIngredients) ? burgerIngredients.length : 0}</span> ingredients
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Creator ID: {burger.userId}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/burgers/${burger.id}`)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    isActive={currentPage > 1}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    
                    return (
                      <div key={page} className="flex">
                        {showEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </div>
                    );
                  })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    isActive={currentPage < totalPages}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}