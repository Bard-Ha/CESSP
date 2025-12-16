import { Link } from "wouter";
import { ArrowRight, Zap, Cpu, Database, Target, Search, Lightbulb, FlaskConical, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoleculeScene } from "./3d/MoleculeScene";
import { ParticleBackground } from "./3d/ParticleBackground";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-40 pointer-events-none">
        <MoleculeScene showParticles={false} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Physics-Informed AI for Materials Discovery
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block">Discover Next-Gen</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent animate-gradient">
              Energy Materials
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Discover the perfect battery materials with AI-powered predictions.
            <span className="block mt-2 font-medium text-foreground">
              No chemistry expertise required - just tell us what you need!
            </span>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/material-predictor">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-rose-500/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                    <Target className="w-8 h-8 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-rose-500/20 text-rose-600 hover:bg-rose-500/30">Forward Prediction</Badge>
                    <h3 className="text-xl font-bold mb-2">Material → Best Function</h3>
                    <p className="text-muted-foreground text-sm">
                      Enter any material and discover if it's best suited as a cathode, anode, electrolyte, or interface material.
                    </p>
                    <Button variant="ghost" className="mt-3 gap-2 text-rose-500 hover:text-rose-600 p-0">
                      Try it now <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/material-finder">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-cyan-500/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                    <Search className="w-8 h-8 text-cyan-500" />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-cyan-500/20 text-cyan-600 hover:bg-cyan-500/30">Reverse Engineering</Badge>
                    <h3 className="text-xl font-bold mb-2">Properties → Find Materials</h3>
                    <p className="text-muted-foreground text-sm">
                      Tell us the properties you need (energy, safety, cost) and we'll recommend the best materials for your application.
                    </p>
                    <Button variant="ghost" className="mt-3 gap-2 text-cyan-500 hover:text-cyan-600 p-0">
                      Find materials <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Or explore our advanced tools:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/upload">
              <Button size="sm" variant="outline" className="gap-2">
                <Zap className="w-4 h-4" />
                Upload Structure
              </Button>
            </Link>
            <Link href="/dataset">
              <Button size="sm" variant="outline" className="gap-2">
                <Database className="w-4 h-4" />
                Browse Dataset
              </Button>
            </Link>
            <Link href="/generate">
              <Button size="sm" variant="outline" className="gap-2">
                <FlaskConical className="w-4 h-4" />
                Generate Candidates
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Lightbulb}
            title="Beginner Friendly"
            description="Designed for everyone - no chemistry degree needed. Plain language explanations for all technical terms."
          />
          <FeatureCard
            icon={ArrowLeftRight}
            title="Bidirectional Prediction"
            description="Work both ways: find materials from properties or predict functions from materials."
          />
          <FeatureCard
            icon={Database}
            title="Curated Knowledge"
            description="Access validated data on cathodes, anodes, electrolytes, and interface materials."
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: typeof Zap; 
  title: string; 
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-xl glass border border-border/50 hover-elevate transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative space-y-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default HeroSection;
