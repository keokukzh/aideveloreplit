import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MotionProvider from "@/components/MotionProvider";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionProvider>
          <Toaster />
          <Router />
        </MotionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
