import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { MaterialCategories, categories } from "@/components/MaterialCategories";
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
  XCircle,
  Loader2,
  Info,
  Beaker,
  Target
} from "lucide-react";

interface PredictionResult {
  category: string;
  confidence: number;
  reasoning: string;
  keyFactors: string[];
  suitability: Record<string, number>;
}

const exampleMaterials = [
  { formula: "LiCoO₂", name: "Lithium Cobalt Oxide", hint: "Common in phones" },
  { formula: "LiFePO₄", name: "Lithium Iron Phosphate", hint: "Safe for EVs" },
  { formula: "Li₇La₃Zr₂O₁₂", name: "LLZO", hint: "Solid electrolyte" },
  { formula: "Graphite", name: "Carbon layers", hint: "Most used anode" },
];

function ConfidenceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function MaterialPredictor() {
  const [materialInput, setMaterialInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [inputMode, setInputMode] = useState<"simple" | "formula">("simple");

  const analyzeMaterial = useCallback(async () => {
    if (!materialInput.trim()) return;
    
    setIsAnalyzing(true);
    setPrediction(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const input = materialInput.toLowerCase();
    let result: PredictionResult;

    if (input.includes("li") && (input.includes("co") || input.includes("ni") || input.includes("mn"))) {
      result = {
        category: "cathode",
        confidence: 92,
        reasoning: "Contains lithium with transition metals (Co, Ni, Mn) in layered oxide structure - characteristic of cathode materials.",
        keyFactors: ["Layered crystal structure", "Contains lithium ions", "Transition metal presence"],
        suitability: { cathode: 92, anode: 15, electrolyte: 5, interface: 25 }
      };
    } else if (input.includes("graphite") || input.includes("carbon") || input.includes("silicon") || input.includes("si")) {
      result = {
        category: "anode",
        confidence: 88,
        reasoning: "Materials like graphite and silicon are excellent for hosting lithium ions between their layers or in their structure.",
        keyFactors: ["High capacity structure", "Good electronic conductivity", "Stable intercalation"],
        suitability: { cathode: 8, anode: 88, electrolyte: 5, interface: 20 }
      };
    } else if (input.includes("pf6") || input.includes("electrolyte") || input.includes("llzo") || input.includes("li7")) {
      result = {
        category: "electrolyte",
        confidence: 85,
        reasoning: "Shows characteristics of ionic conductors - allows ion transport while being electronically insulating.",
        keyFactors: ["High ionic conductivity", "Electronic insulation", "Wide voltage window"],
        suitability: { cathode: 5, anode: 8, electrolyte: 85, interface: 30 }
      };
    } else if (input.includes("coating") || input.includes("sei") || input.includes("interface")) {
      result = {
        category: "interface",
        confidence: 80,
        reasoning: "Functions as a protective layer between electrode and electrolyte, stabilizing the interface.",
        keyFactors: ["Chemical stability", "Low thickness", "Protective properties"],
        suitability: { cathode: 15, anode: 20, electrolyte: 25, interface: 80 }
      };
    } else {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      result = {
        category: randomCategory.id,
        confidence: 45 + Math.floor(Math.random() * 30),
        reasoning: "Based on elemental composition and typical structures. More specific input would improve prediction accuracy.",
        keyFactors: ["General material analysis", "Composition-based prediction"],
        suitability: { 
          cathode: 20 + Math.floor(Math.random() * 50), 
          anode: 20 + Math.floor(Math.random() * 50), 
          electrolyte: 20 + Math.floor(Math.random() * 50), 
          interface: 20 + Math.floor(Math.random() * 50) 
        }
      };
    }

    setPrediction(result);
    setIsAnalyzing(false);
  }, [materialInput]);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <Badge className="mb-2" variant="secondary">
              <Target className="w-3 h-3 mr-1" />
              Forward Prediction
            </Badge>
            <h1 className="text-3xl font-bold">Material → Function Predictor</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter a material name or formula, and we'll predict its best use in a battery system.
              No technical knowledge required!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-primary" />
                Enter Your Material
              </CardTitle>
              <CardDescription>
                Type a chemical formula (like LiCoO₂) or just describe the material in plain words
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="simple">Simple Description</TabsTrigger>
                  <TabsTrigger value="formula">Chemical Formula</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simple" className="space-y-3">
                  <Label>Describe the material</Label>
                  <Input
                    placeholder="e.g., 'lithium with cobalt oxide' or 'carbon graphite layers'"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && analyzeMaterial()}
                  />
                  <p className="text-xs text-muted-foreground">
                    Just type what you know - material name, elements, or description
                  </p>
                </TabsContent>
                
                <TabsContent value="formula" className="space-y-3">
                  <Label>Chemical formula</Label>
                  <Input
                    placeholder="e.g., LiCoO2, LiFePO4, Li7La3Zr2O12"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && analyzeMaterial()}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the chemical formula - subscripts are optional
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-muted-foreground">Try an example:</span>
                {exampleMaterials.map((mat) => (
                  <Tooltip key={mat.formula}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMaterialInput(mat.formula)}
                        className="text-xs"
                      >
                        {mat.formula}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{mat.name}</p>
                      <p className="text-xs text-muted-foreground">{mat.hint}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              <Button 
                onClick={analyzeMaterial} 
                className="w-full"
                disabled={!materialInput.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing material...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Predict Best Function
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {prediction && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Prediction Results
                  </CardTitle>
                  <Badge 
                    className={
                      prediction.confidence >= 80 
                        ? "bg-green-500/20 text-green-600" 
                        : prediction.confidence >= 60 
                          ? "bg-amber-500/20 text-amber-600"
                          : "bg-muted text-muted-foreground"
                    }
                  >
                    {prediction.confidence}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  {(() => {
                    const cat = getCategoryInfo(prediction.category);
                    if (!cat) return null;
                    return (
                      <>
                        <div className={`p-4 rounded-xl ${cat.bgColor}`}>
                          <cat.icon className={`w-8 h-8 ${cat.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Best suited as</p>
                          <h3 className="text-xl font-bold">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {cat.simpleDescription}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Why this prediction?
                  </h4>
                  <p className="text-muted-foreground">{prediction.reasoning}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {prediction.keyFactors.map((factor, i) => (
                      <Badge key={i} variant="outline">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Suitability for each role</h4>
                  <div className="space-y-3">
                    {Object.entries(prediction.suitability)
                      .sort((a, b) => b[1] - a[1])
                      .map(([role, value]) => {
                        const cat = getCategoryInfo(role);
                        return (
                          <ConfidenceBar
                            key={role}
                            label={cat?.name || role}
                            value={value}
                            color={
                              value >= 70 ? "bg-green-500" :
                              value >= 40 ? "bg-amber-500" :
                              "bg-muted-foreground"
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="pt-8">
            <MaterialCategories showGlossary={false} />
          </div>
        </div>
      </main>
    </div>
  );
}
