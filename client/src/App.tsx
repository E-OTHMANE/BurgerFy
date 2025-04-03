import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import WelcomePage from "@/pages/WelcomePage";
import BuilderPage from "@/pages/BuilderPage";
import SummaryPage from "@/pages/SummaryPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/builder" component={BuilderPage} />
      <Route path="/summary" component={SummaryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
