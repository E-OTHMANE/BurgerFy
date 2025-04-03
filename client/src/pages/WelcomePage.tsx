import { useLocation } from "wouter";

export default function WelcomePage() {
  const [_, setLocation] = useLocation();

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
        <button 
          onClick={() => setLocation("/builder")}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105 animate-bounce-slow">
          Welcome to BurgerFy
        </button>
      </div>
    </div>
  );
}
