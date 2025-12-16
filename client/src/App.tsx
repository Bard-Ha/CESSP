import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Upload from "@/pages/Upload";
import Predict from "@/pages/Predict";
import Dataset from "@/pages/Dataset";
import Generate from "@/pages/Generate";
import MaterialPredictor from "@/pages/MaterialPredictor";
import MaterialFinder from "@/pages/MaterialFinder";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/material-predictor" component={MaterialPredictor} />
      <Route path="/material-finder" component={MaterialFinder} />
      <Route path="/upload" component={Upload} />
      <Route path="/predict" component={Predict} />
      <Route path="/dataset" component={Dataset} />
      <Route path="/generate" component={Generate} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
