import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add custom CSS to the page
export function addCustomCSSToHead() {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@300;400;500;600;700&display=swap');
    @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');
    
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #FEF9EF;
      color: #33312E;
    }
    
    .burger-layer {
      transition: all 0.3s ease;
    }
    
    .category-tab.active {
      border-color: #FF6B35;
      background-color: #FFF0E8;
      color: #FF6B35;
    }
    
    .welcome-container {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .ingredient-overlay {
      background-color: rgba(0,0,0,0.4);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .ingredient-card:hover .ingredient-overlay {
      opacity: 1;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .animate-bounce-slow {
      animation: bounce 2s infinite;
    }
    
    :root {
      --background: 43 31% 97%;
      --foreground: 35 7% 19%;
      
      --card: 0 0% 100%;
      --card-foreground: 35 7% 19%;
      
      --popover: 0 0% 100%;
      --popover-foreground: 35 7% 19%;
      
      --primary: 17 100% 61%;
      --primary-foreground: 0 0% 100%;
      
      --secondary: 107 47% 53%;
      --secondary-foreground: 0 0% 100%;
      
      --muted: 43 31% 92%;
      --muted-foreground: 35 7% 40%;
      
      --accent: 45 100% 58%;
      --accent-foreground: 35 7% 19%;
      
      --destructive: 8 86% 54%;
      --destructive-foreground: 0 0% 100%;
      
      --border: 43 31% 90%;
      --input: 43 31% 90%;
      --ring: 17 100% 61%;
      
      --radius: 0.5rem;
    }
  `;
  document.head.appendChild(style);
}

// Initialize the app with required setup
export function initApp() {
  addCustomCSSToHead();
  
  // Set the title
  document.title = "BurgerFy - Create Your Perfect Burger";
}

// Call initApp when this module is imported
initApp();
