import { useAuth } from "@/hooks/use-auth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Burger } from "@shared/schema";
import { Loader2, ChevronLeft, User, Calendar, Mail } from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [_, navigate] = useLocation();

  // Fetch user's burgers
  const {
    data: userBurgers,
    isLoading: loadingBurgers,
    error: burgersError,
  } = useQuery<Burger[]>({
    queryKey: ["/api/my-burgers"],
    enabled: !!user,
  });

  // Handle user not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="burgers">My Burgers</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profile Details</CardTitle>
              <CardDescription>
                Your personal information and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center mb-6">
                <div className="bg-primary/10 text-primary rounded-full p-6 mb-4 md:mb-0 md:mr-6">
                  <User className="h-12 w-12" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.fullName}</h2>
                  <p className="text-muted-foreground">BurgerFy Member</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p>{format(new Date(user.createdAt), "MMMM d, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-5 w-5 mr-2 flex items-center justify-center text-muted-foreground">
                    <span className="text-sm font-bold">21+</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p>{user.age} years old</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="burgers">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">My Burger Collection</CardTitle>
              <CardDescription>
                All the custom burgers you've created and saved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBurgers ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : burgersError ? (
                <div className="text-center py-8 text-destructive">
                  <p>Error loading your burgers. Please try again.</p>
                </div>
              ) : userBurgers?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">You haven't created any burgers yet.</p>
                  <Button onClick={() => navigate("/builder")}>Create Your First Burger</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userBurgers?.map((burger) => {
                    // Parse ingredients safely
                    let burgerIngredients = [];
                    try {
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
                    
                    // Get first ingredient for display
                    const firstIngredient = Array.isArray(burgerIngredients) && burgerIngredients.length > 0 
                      ? burgerIngredients[0] 
                      : null;
                    
                    return (
                      <Card key={burger.id} className="overflow-hidden">
                        <div className="bg-muted h-32 flex items-center justify-center">
                          {firstIngredient && firstIngredient.image ? (
                            <img 
                              src={firstIngredient.image} 
                              alt={firstIngredient.name || 'Burger ingredient'} 
                              className="h-24 w-24 object-contain"
                            />
                          ) : (
                            <div className="text-2xl">🍔</div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-1">{burger.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            Created on {format(new Date(burger.createdAt), "MMM d, yyyy")}
                          </p>
                          <p className="text-sm mt-2">
                            {Array.isArray(burgerIngredients) ? burgerIngredients.length : 0} ingredients
                          </p>
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}