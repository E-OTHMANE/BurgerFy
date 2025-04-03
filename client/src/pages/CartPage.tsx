import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Trash2, Minus, Plus, ChevronLeft, CreditCard, Truck, MapPin } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export default function CartPage() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">("credit-card");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get cart data from store
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems 
  } = useCartStore();
  
  // Delivery details form state
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    saveDetails: false,
  });
  
  // Handle input changes for delivery details
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  // Handle checkout
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    if (deliveryMethod === "delivery" && (!deliveryDetails.address || !deliveryDetails.city || !deliveryDetails.zipCode || !deliveryDetails.phone)) {
      toast({
        title: "Missing delivery information",
        description: "Please fill in all required delivery fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call for order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Order placed successfully!",
        description: `Your order has been placed and will be ${deliveryMethod === "delivery" ? "delivered soon" : "ready for pickup shortly"}`,
      });
      
      clearCart();
      navigate("/");
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === "delivery" ? 2.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="container py-10 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {getTotalItems() > 0 && (
          <div className="ml-2 bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex flex-col items-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any burgers to your cart yet.
              </p>
              <Button onClick={() => navigate("/explore")} className="px-8">
                Browse Burgers
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
                <CardDescription>
                  Review the burgers in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  // Parse ingredients if needed
                  let ingredients = item.ingredients;
                  const firstIngredient = ingredients && ingredients.length > 0 
                    ? ingredients[0] 
                    : null;
                
                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                      {/* Burger Image */}
                      <div className="w-full sm:w-24 h-24 bg-muted rounded flex items-center justify-center">
                        {firstIngredient && firstIngredient.image ? (
                          <img 
                            src={firstIngredient.image} 
                            alt={firstIngredient.name || 'Burger ingredient'} 
                            className="h-20 w-20 object-contain"
                          />
                        ) : (
                          <div className="text-2xl">🍔</div>
                        )}
                      </div>
                      
                      {/* Burger Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{item.burger.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.ingredients.length} ingredients
                          </p>
                        </div>
                        <div className="text-sm mt-1">
                          {formatPrice(item.price)} each
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center">
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Subtotal and Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <div className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/explore")}>
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Order Summary and Checkout Section */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryMethod === "delivery" ? formatPrice(deliveryFee) : "Free"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Delivery Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={deliveryMethod} 
                    onValueChange={(value) => setDeliveryMethod(value as "delivery" | "pickup")}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex items-center cursor-pointer">
                        <Truck className="h-4 w-4 mr-2" />
                        Delivery (+{formatPrice(deliveryFee)})
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                        <MapPin className="h-4 w-4 mr-2" />
                        Pickup (Free)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              {/* Delivery Details (if delivery selected) */}
              {deliveryMethod === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address"
                        placeholder="123 Main St" 
                        value={deliveryDetails.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city"
                          placeholder="New York" 
                          value={deliveryDetails.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode"
                          placeholder="10001" 
                          value={deliveryDetails.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        placeholder="(123) 456-7890" 
                        value={deliveryDetails.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="saveDetails" 
                        name="saveDetails"
                        checked={deliveryDetails.saveDetails}
                        onCheckedChange={(checked) => 
                          setDeliveryDetails(prev => ({...prev, saveDetails: !!checked}))
                        }
                      />
                      <Label htmlFor="saveDetails" className="text-sm cursor-pointer">
                        Save delivery details for future orders
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as "credit-card" | "paypal")}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer flex items-center">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-1.378-1.012-3.494-1.18-6.34-1.18h-1.93L12.333 5.1h.002c.124-.791.49-1.079 1.224-1.079h1.418c.164 0 .303.12.328.283.238-.166.515-.283.814-.283h.005c.21 0 .333.12.333.382 0 .784-.549 1.098-1.313 1.098H14.5c-.099 0-.192-.012-.284-.03a.324.324 0 0 0-.068.03h-.01c-.308 0-.476.152-.527.443l-.064.416a1.81 1.81 0 0 1-.9.115c.246-.602.435-1.28.567-2.026.176-.965.32-2.046.433-3.206l.042-.41c.059-.547.546-.739 1.133-.739h2.096c2.208 0 3.85.309 4.773 1.037.3.236.517.498.67.78.153.284.238.581.257.881a1.21 1.21 0 0 1-.023.336c-.05-.062-.103-.122-.158-.181a5.693 5.693 0 0 0-.546-.523 3.164 3.164 0 0 0-.881-.523c-.714-.284-1.635-.284-2.768-.284h-1.498c-.682 0-1.06.284-1.133.88L16.52 2.17l-.023.15c.29.224.497.503.616.828.12.325.149.682.095 1.058a4.32 4.32 0 0 1-.131.593c-.839 2.706-3.607 3.618-7.188 3.618.036-.035 0 .035-.036.035h-2.57c-.682 0-1.06.284-1.133.88l-1.24 7.86v.036c-.024.177.071.355.25.414.058.023.13.035.202.035h3.146c.683 0 1.085-.272 1.169-.857l.793-5.036c.095-.593.462-.892 1.145-.892h.727c3.58 0 6.35-.915 7.188-3.62.416-1.358.238-2.495-.534-3.264z" />
                        </svg>
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" placeholder="John Doe" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Checkout Button */}
              <Button 
                className="w-full h-12 text-lg" 
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>Place Order - {formatPrice(total)}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}