import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import WelcomePage from "@/pages/WelcomePage";
import BuilderPage from "@/pages/BuilderPage";
import SummaryPage from "@/pages/SummaryPage";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/ProfilePage";
import ExplorePage from "@/pages/ExplorePage";
import BurgerDetailsPage from "@/pages/BurgerDetailsPage";
import CartPage from "@/pages/CartPage";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <ProtectedRoute path="/builder" component={BuilderPage} />
      <ProtectedRoute path="/summary" component={SummaryPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/burgers/:id" component={BurgerDetailsPage} />
      <Route path="/cart" component={CartPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
