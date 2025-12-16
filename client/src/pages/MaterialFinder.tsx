import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { categories } from "@/components/MaterialCategories";
import { 
  Battery, 
  Zap, 
  Droplets, 
  Layers,
  ArrowRight,
  Sparkles,
  Search,
  HelpCircle,
  CheckCircle,
  Loader2,
  Settings,
  Target,
  FlaskConical,
  Lightbulb,
  Star
} from "lucide-react";

interface MaterialRecommendation {
  formula: string;
  name: string;
  category: string;
  matchScore: number;
  properties: {
    energyDensity?: number;
    voltage?: number;
    conductivity?: number;
    stability?: number;
    cycleLife?: number;
    cost?: string;
  };
  advantages: string[];
  considerations: string[];
  applications: string[];
}

interface PropertyRequirements {
  targetCategory: string;
  energyDensity: number;
  voltage: number;
  prioritizeSafety: boolean;
  prioritizeCost: boolean;
  prioritizeCycleLife: boolean;
}

const materialDatabase: MaterialRecommendation[] = [
  {
    formula: "LiCoO₂",
    name: "Lithium Cobalt Oxide",
    category: "cathode",
    matchScore: 0,
    properties: { energyDensity: 274, voltage: 3.9, cycleLife: 500, cost: "High" },
    advantages: ["High energy density", "Well-established", "Good capacity"],
    considerations: ["Expensive cobalt", "Limited cycle life", "Thermal sensitivity"],
    applications: ["Smartphones", "Laptops", "Tablets"]
  },
  {
    formula: "LiFePO₄",
    name: "Lithium Iron Phosphate",
    category: "cathode",
    matchScore: 0,
    properties: { energyDensity: 170, voltage: 3.4, cycleLife: 2000, cost: "Low" },
    advantages: ["Very safe", "Long cycle life", "Low cost", "Environmentally friendly"],
    considerations: ["Lower energy density", "Lower voltage"],
    applications: ["Electric vehicles", "Power tools", "Solar storage"]
  },
  {
    formula: "NMC 811",
    name: "Nickel Manganese Cobalt",
    category: "cathode",
    matchScore: 0,
    properties: { energyDensity: 280, voltage: 3.8, cycleLife: 800, cost: "Medium" },
    advantages: ["High energy density", "Balanced properties", "Good power"],
    considerations: ["Requires careful thermal management", "Some cobalt needed"],
    applications: ["Electric vehicles", "E-bikes", "Premium electronics"]
  },
  {
    formula: "Graphite",
    name: "Graphite Anode",
    category: "anode",
    matchScore: 0,
    properties: { energyDensity: 372, voltage: 0.1, cycleLife: 1000, cost: "Low" },
    advantages: ["Very stable", "Low cost", "Proven technology"],
    considerations: ["Limited capacity ceiling", "Lithium plating risk at low temps"],
    applications: ["All lithium-ion batteries", "Consumer electronics", "EVs"]
  },
  {
    formula: "Si-C Composite",
    name: "Silicon-Carbon Anode",
    category: "anode",
    matchScore: 0,
    properties: { energyDensity: 1000, voltage: 0.4, cycleLife: 500, cost: "Medium" },
    advantages: ["Very high capacity", "Next-generation tech"],
    considerations: ["Expansion during cycling", "Shorter life than graphite"],
    applications: ["High-energy batteries", "Premium EVs", "Advanced electronics"]
  },
  {
    formula: "Li₇La₃Zr₂O₁₂",
    name: "LLZO Garnet",
    category: "electrolyte",
    matchScore: 0,
    properties: { conductivity: 0.001, stability: 5.0, cost: "High" },
    advantages: ["Solid-state (no fire risk)", "Wide voltage window", "Enables lithium metal"],
    considerations: ["Brittle", "Interface challenges", "Higher cost"],
    applications: ["Solid-state batteries", "High-safety applications"]
  },
  {
    formula: "LiPF₆ in EC/DMC",
    name: "Standard Liquid Electrolyte",
    category: "electrolyte",
    matchScore: 0,
    properties: { conductivity: 0.01, stability: 4.5, cost: "Low" },
    advantages: ["High conductivity", "Well-understood", "Low cost"],
    considerations: ["Flammable", "Limited voltage window"],
    applications: ["Most commercial Li-ion batteries"]
  },
  {
    formula: "Al₂O₃ Coating",
    name: "Aluminum Oxide Interface",
    category: "interface",
    matchScore: 0,
    properties: { stability: 600, cost: "Low" },
    advantages: ["Stabilizes cathode", "Prevents side reactions", "Thin and effective"],
    considerations: ["Adds processing step", "May increase resistance slightly"],
    applications: ["Cathode coatings", "Life extension"]
  }
];

function PropertySlider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  unit,
  tooltip 
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void; 
  min: number; 
  max: number; 
  unit: string;
  tooltip: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label>{label}</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="font-mono text-sm text-primary">
          {value} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={(max - min) / 100}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function MaterialCard({ material, rank }: { material: MaterialRecommendation; rank: number }) {
  const category = categories.find(c => c.id === material.category);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
              rank === 1 ? "bg-amber-500 text-white" :
              rank === 2 ? "bg-zinc-400 text-white" :
              rank === 3 ? "bg-amber-700 text-white" :
              "bg-muted text-muted-foreground"
            }`}>
              {rank}
            </div>
            <div className="text-center">
              <div className="font-mono text-lg font-bold text-primary">
                {Math.round(material.matchScore)}%
              </div>
              <div className="text-xs text-muted-foreground">match</div>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-mono font-semibold text-lg">{material.formula}</h3>
                <p className="text-sm text-muted-foreground">{material.name}</p>
              </div>
              <Badge className={category?.bgColor + " " + category?.color}>
                {category?.name.replace(" Materials", "")}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm">
              {material.properties.energyDensity && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{material.properties.energyDensity} Wh/kg</span>
                </div>
              )}
              {material.properties.voltage && (
                <div className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-green-500" />
                  <span>{material.properties.voltage}V</span>
                </div>
              )}
              {material.properties.cycleLife && (
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  <span>{material.properties.cycleLife} cycles</span>
                </div>
              )}
              {material.properties.cost && (
                <Badge variant="outline" className="text-xs">
                  {material.properties.cost} cost
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {material.advantages.slice(0, 3).map((adv, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {adv}
                  </Badge>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                <strong>Used in:</strong> {material.applications.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MaterialFinder() {
  const [requirements, setRequirements] = useState<PropertyRequirements>({
    targetCategory: "any",
    energyDensity: 200,
    voltage: 3.5,
    prioritizeSafety: false,
    prioritizeCost: false,
    prioritizeCycleLife: false
  });
  const [recommendations, setRecommendations] = useState<MaterialRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const findMaterials = useCallback(async () => {
    setIsSearching(true);
    setHasSearched(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const scored = materialDatabase.map(mat => {
      let score = 50;
      
      if (requirements.targetCategory !== "any" && mat.category === requirements.targetCategory) {
        score += 20;
      } else if (requirements.targetCategory !== "any" && mat.category !== requirements.targetCategory) {
        score -= 30;
      }
      
      if (mat.properties.energyDensity) {
        const energyDiff = Math.abs(mat.properties.energyDensity - requirements.energyDensity);
        score += Math.max(0, 20 - energyDiff / 10);
      }
      
      if (mat.properties.voltage) {
        const voltageDiff = Math.abs(mat.properties.voltage - requirements.voltage);
        score += Math.max(0, 15 - voltageDiff * 5);
      }
      
      if (requirements.prioritizeSafety && mat.advantages.some(a => 
        a.toLowerCase().includes("safe") || a.toLowerCase().includes("stable"))) {
        score += 15;
      }
      
      if (requirements.prioritizeCost && mat.properties.cost === "Low") {
        score += 15;
      } else if (requirements.prioritizeCost && mat.properties.cost === "High") {
        score -= 10;
      }
      
      if (requirements.prioritizeCycleLife && mat.properties.cycleLife && mat.properties.cycleLife > 1000) {
        score += 15;
      }
      
      return {
        ...mat,
        matchScore: Math.min(99, Math.max(10, score + Math.random() * 10))
      };
    });
    
    scored.sort((a, b) => b.matchScore - a.matchScore);
    setRecommendations(scored.slice(0, 5));
    setIsSearching(false);
  }, [requirements]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <Badge className="mb-2" variant="secondary">
              <FlaskConical className="w-3 h-3 mr-1" />
              Reverse Engineering
            </Badge>
            <h1 className="text-3xl font-bold">Properties → Material Finder</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us what you need, and we'll recommend the best materials.
              No chemistry knowledge required - just select your priorities!
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    What are you looking for?
                  </CardTitle>
                  <CardDescription>
                    Set your requirements and priorities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Material type (optional)</Label>
                    <RadioGroup 
                      value={requirements.targetCategory}
                      onValueChange={(v) => setRequirements(r => ({...r, targetCategory: v}))}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50">
                        <RadioGroupItem value="any" id="any" />
                        <Label htmlFor="any" className="cursor-pointer text-sm">Any type</Label>
                      </div>
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50">
                          <RadioGroupItem value={cat.id} id={cat.id} />
                          <Label htmlFor={cat.id} className="cursor-pointer text-sm flex items-center gap-1">
                            <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                            {cat.name.replace(" Materials", "")}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <PropertySlider
                    label="Target Energy Density"
                    value={requirements.energyDensity}
                    onChange={(v) => setRequirements(r => ({...r, energyDensity: v}))}
                    min={50}
                    max={500}
                    unit="Wh/kg"
                    tooltip="How much energy the material can store per kilogram. Higher = more power in smaller size."
                  />

                  <PropertySlider
                    label="Target Voltage"
                    value={requirements.voltage}
                    onChange={(v) => setRequirements(r => ({...r, voltage: v}))}
                    min={1}
                    max={5}
                    unit="V"
                    tooltip="The electrical potential of the material. Higher voltage often means more energy per cell."
                  />

                  <div className="space-y-4 pt-2 border-t">
                    <Label className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Priorities
                    </Label>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="safety" className="cursor-pointer">Prioritize Safety</Label>
                        <p className="text-xs text-muted-foreground">Prefer stable, non-flammable options</p>
                      </div>
                      <Switch 
                        id="safety"
                        checked={requirements.prioritizeSafety}
                        onCheckedChange={(v) => setRequirements(r => ({...r, prioritizeSafety: v}))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="cost" className="cursor-pointer">Prioritize Low Cost</Label>
                        <p className="text-xs text-muted-foreground">Prefer affordable materials</p>
                      </div>
                      <Switch 
                        id="cost"
                        checked={requirements.prioritizeCost}
                        onCheckedChange={(v) => setRequirements(r => ({...r, prioritizeCost: v}))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="cycle" className="cursor-pointer">Prioritize Long Life</Label>
                        <p className="text-xs text-muted-foreground">Prefer materials with many charge cycles</p>
                      </div>
                      <Switch 
                        id="cycle"
                        checked={requirements.prioritizeCycleLife}
                        onCheckedChange={(v) => setRequirements(r => ({...r, prioritizeCycleLife: v}))}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={findMaterials} 
                    className="w-full"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finding best matches...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find Materials
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {!hasSearched ? (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Set your requirements</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Adjust the sliders and preferences on the left,<br />
                        then click "Find Materials" to get recommendations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : isSearching ? (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing material database...</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      Top Recommendations
                    </h2>
                    <Badge variant="outline">{recommendations.length} matches</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {recommendations.map((mat, i) => (
                      <MaterialCard key={mat.formula} material={mat} rank={i + 1} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
