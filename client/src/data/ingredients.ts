import { BurgerIngredient } from "@shared/schema";

// Categories for ingredient filtering
export const categories = [
  { id: "buns", name: "Buns" },
  { id: "meats", name: "Meats" },
  { id: "cheeses", name: "Cheese" },
  { id: "veggies", name: "Veggies" },
  { id: "sauces", name: "Sauces" },
  { id: "extras", name: "Extras" }
];

// Default ingredients data for the application
// In a real app, this would come from the API
export const defaultIngredients: BurgerIngredient[] = [
  // Buns
  {
    id: 1,
    name: "Sesame Bun (Top)",
    category: "buns",
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: 0
  },
  {
    id: 2,
    name: "Sesame Bun (Bottom)",
    category: "buns",
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: 100
  },
  {
    id: 3,
    name: "Brioche Bun (Top)",
    category: "buns",
    image: "https://images.unsplash.com/photo-1598182198343-9a07b5886af9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 0
  },
  {
    id: 4,
    name: "Brioche Bun (Bottom)",
    category: "buns",
    image: "https://images.unsplash.com/photo-1598182198343-9a07b5886af9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 100
  },
  {
    id: 5,
    name: "Pretzel Bun (Top)",
    category: "buns",
    image: "https://images.unsplash.com/photo-1600688640154-9619e002df30?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 0
  },
  {
    id: 6,
    name: "Pretzel Bun (Bottom)",
    category: "buns",
    image: "https://images.unsplash.com/photo-1600688640154-9619e002df30?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 100
  },
  {
    id: 7,
    name: "Lettuce Wrap",
    category: "buns",
    image: "https://images.unsplash.com/photo-1622205313162-be1d5712a43b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 0
  },
  
  // Meats
  {
    id: 10,
    name: "Beef Patty",
    category: "meats",
    image: "https://images.unsplash.com/photo-1607198179219-10943d355695?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 50
  },
  {
    id: 11,
    name: "Chicken Patty",
    category: "meats",
    image: "https://images.unsplash.com/photo-1615557960916-c697fe7b4d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 50
  },
  {
    id: 12,
    name: "Veggie Patty",
    category: "meats",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 50
  },
  {
    id: 13,
    name: "Bacon",
    category: "meats",
    image: "https://images.unsplash.com/photo-1590534247854-e97d5e3feef6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 40
  },
  
  // Cheeses
  {
    id: 20,
    name: "Cheddar Cheese",
    category: "cheeses",
    image: "https://images.unsplash.com/photo-1589057687126-10a802c42a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: 30
  },
  {
    id: 21,
    name: "American Cheese",
    category: "cheeses",
    image: "https://images.unsplash.com/photo-1625084560853-1a5efe359abd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 30
  },
  {
    id: 22,
    name: "Swiss Cheese",
    category: "cheeses",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 30
  },
  
  // Veggies
  {
    id: 30,
    name: "Lettuce",
    category: "veggies",
    image: "https://images.unsplash.com/photo-1622205313162-be1d5712a43b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    position: 20
  },
  {
    id: 31,
    name: "Tomato",
    category: "veggies",
    image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 25
  },
  {
    id: 32,
    name: "Onion",
    category: "veggies",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 28
  },
  {
    id: 33,
    name: "Pickles",
    category: "veggies",
    image: "https://images.unsplash.com/photo-1603102796108-32000aa72dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 27
  },
  
  // Sauces
  {
    id: 40,
    name: "Ketchup",
    category: "sauces",
    image: "https://images.unsplash.com/photo-1632349514143-28baeafee91f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 10
  },
  {
    id: 41,
    name: "Mustard",
    category: "sauces",
    image: "https://images.unsplash.com/photo-1613991900539-d11f47207a36?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 10
  },
  {
    id: 42,
    name: "Mayo",
    category: "sauces",
    image: "https://images.unsplash.com/photo-1575226717269-0c607a48d416?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 10
  },
  {
    id: 43,
    name: "BBQ Sauce",
    category: "sauces",
    image: "https://images.unsplash.com/photo-1593198302640-43229e89369e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", 
    position: 10
  },
  
  // Extras
  {
    id: 50,
    name: "Fried Egg",
    category: "extras",
    image: "https://images.unsplash.com/photo-1607372696355-bfc0d9b90f54?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 35
  },
  {
    id: 51,
    name: "Avocado",
    category: "extras",
    image: "https://images.unsplash.com/photo-1592430702451-736eae313585?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 33
  },
  {
    id: 52,
    name: "Jalapeños",
    category: "extras",
    image: "https://images.unsplash.com/photo-1591300673311-8756f6e88e36?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    position: 32
  }
];
