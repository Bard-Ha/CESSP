import { Link, useLocation } from "wouter";
import { 
  Home, 
  Upload, 
  BarChart3, 
  Database, 
  Sparkles, 
  Menu,
  X,
  Atom,
  FlaskConical,
  Target,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/material-predictor", label: "Material→Function", icon: Target, highlight: true },
  { path: "/material-finder", label: "Properties→Material", icon: Search, highlight: true },
  { path: "/upload", label: "Upload", icon: Upload },
  { path: "/predict", label: "Advanced", icon: BarChart3 },
  { path: "/dataset", label: "Dataset", icon: Database },
  { path: "/generate", label: "Generate", icon: Sparkles },
];

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          data-testid="link-home"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Atom className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-tight">
              CESSP
            </span>
            <span className="text-xs text-muted-foreground leading-none mt-0.5">
              Energy Storage Predictor
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            const highlight = (item as any).highlight;
            return (
              <Link key={item.path} href={item.path} asChild>
                <Button
                  variant={isActive ? "secondary" : highlight ? "outline" : "ghost"}
                  className={`gap-2 ${isActive ? "bg-secondary/80" : ""} ${highlight && !isActive ? "border-primary/30 hover:border-primary/50" : ""}`}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                >
                  <Icon className={`w-4 h-4 ${highlight ? "text-primary" : ""}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.label.split("→")[0]}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 glass-strong border-t border-border/50">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
