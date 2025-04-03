import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";

export default function WelcomePage() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <div className="welcome-container min-h-screen flex items-center justify-center text-white p-4 bg-cover bg-center"
         style={{
           backgroundImage: "url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')"
         }}>
      <div className="max-w-md w-full bg-dark bg-opacity-80 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-4 text-accent">BurgerFy</h1>
        <p className="mb-8 text-lg">Create your perfect burger with our interactive builder</p>
        <img 
          src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
          alt="Delicious burger" 
          className="rounded-xl w-64 h-64 object-cover mb-8 shadow-lg" 
        />
        <div className="flex flex-col w-full gap-4">
          <button 
            onClick={() => setLocation("/builder")}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105 animate-bounce-slow">
            Build Your Burger
          </button>
          
          <Separator className="my-2" />
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setLocation("/explore")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
              Explore Creations
            </button>
            
            <button 
              onClick={() => setLocation(user ? "/profile" : "/auth")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
              {user ? "My Profile" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
