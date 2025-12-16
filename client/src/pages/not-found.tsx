import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className="relative">
              <div className="text-[180px] font-display font-bold text-muted/20 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center">
                  <Home className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-display text-3xl font-bold">Page Not Found</h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back to exploring energy materials.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Link href="/">
                <Button className="gap-2" data-testid="button-go-home">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="gap-2"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
