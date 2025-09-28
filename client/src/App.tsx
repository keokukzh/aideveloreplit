import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ModularLandingPage from "@/pages/ModularLandingPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import PhoneOnboardingPage from "@/pages/onboarding/PhoneOnboardingPage";
import ChatOnboardingPage from "@/pages/onboarding/ChatOnboardingPage";
import SocialOnboardingPage from "@/pages/onboarding/SocialOnboardingPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ModularLandingPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/payment-success" component={PaymentSuccessPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/onboarding/phone" component={PhoneOnboardingPage} />
      <Route path="/onboarding/chat" component={ChatOnboardingPage} />
      <Route path="/onboarding/social" component={SocialOnboardingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
