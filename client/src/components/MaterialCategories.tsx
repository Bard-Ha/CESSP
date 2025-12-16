import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Battery, 
  Zap, 
  Droplets, 
  Layers, 
  Info,
  ArrowRight,
  Sparkles,
  HelpCircle
} from "lucide-react";

interface MaterialCategory {
  id: string;
  name: string;
  icon: typeof Battery;
  color: string;
  bgColor: string;
  simpleDescription: string;
  detailedDescription: string;
  keyProperties: string[];
  examples: string[];
  analogy: string;
}

const categories: MaterialCategory[] = [
  {
    id: "cathode",
    name: "Cathode Materials",
    icon: Battery,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    simpleDescription: "The positive side of your battery - where energy is stored",
    detailedDescription: "Cathode materials accept and release charged particles (ions) during battery operation. Think of it as a sponge that absorbs and releases electrons.",
    keyProperties: ["High energy storage", "Good cycle life", "Fast charging capability"],
    examples: ["LiCoO₂ (phone batteries)", "LiFePO₄ (electric cars)", "NMC (laptops)"],
    analogy: "Like a hotel that houses guests (ions) - the more rooms and easier check-in, the better!"
  },
  {
    id: "anode",
    name: "Anode Materials",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    simpleDescription: "The negative side - releases energy when needed",
    detailedDescription: "Anode materials store ions when charging and release them when the battery powers your device. They work as a partner to the cathode.",
    keyProperties: ["High capacity", "Long lifespan", "Safe operation"],
    examples: ["Graphite (most common)", "Silicon (next-gen)", "Lithium metal (advanced)"],
    analogy: "Like a parking garage for ions - more spots and faster in/out means better performance!"
  },
  {
    id: "electrolyte",
    name: "Electrolyte Materials",
    icon: Droplets,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    simpleDescription: "The highway that ions travel through between electrodes",
    detailedDescription: "Electrolytes allow ions to move freely between cathode and anode while blocking electrons. They can be liquid, gel, or solid.",
    keyProperties: ["High ionic conductivity", "Wide voltage stability", "Temperature tolerance"],
    examples: ["LiPF₆ in organic solvent", "Solid-state ceramics", "Gel polymers"],
    analogy: "Like a toll-free expressway for ions - smooth, fast, and safe travel!"
  },
  {
    id: "interface",
    name: "Interface Materials",
    icon: Layers,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    simpleDescription: "Protective coatings where different parts meet",
    detailedDescription: "Interface materials form at boundaries between electrodes and electrolyte. They protect components and enable stable long-term operation.",
    keyProperties: ["Chemical stability", "Low resistance", "Self-healing ability"],
    examples: ["SEI layer (natural)", "Artificial coatings", "Ceramic barriers"],
    analogy: "Like the immune system of a battery - protecting and maintaining health!"
  }
];

const glossaryTerms: Record<string, string> = {
  "intercalation": "The process of inserting ions between layers of a material, like sliding cards into a deck. This is how most batteries store energy.",
  "structure-property": "How the arrangement of atoms (structure) determines what the material can do (properties). Like how brick arrangement affects a building's strength.",
  "ionic conductivity": "How easily charged particles can move through a material. Higher = faster charging. Measured in S/cm.",
  "cycle life": "How many times a battery can be charged and discharged before significant degradation. More cycles = longer-lasting battery.",
  "voltage window": "The safe operating voltage range. Wider window means more energy can be stored safely.",
  "thermal stability": "How well a material maintains its properties when heated. Important for safety and performance.",
  "capacity": "How much energy a material can store per unit weight. Higher capacity = longer battery life.",
  "diffusion": "How ions spread and move through materials. Faster diffusion = faster charging/discharging."
};

interface MaterialCategoriesProps {
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
  showGlossary?: boolean;
}

export function MaterialCategories({ 
  onCategorySelect, 
  selectedCategory,
  showGlossary = true 
}: MaterialCategoriesProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAllTerms, setShowAllTerms] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Battery Material Types</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every battery has four key parts. Click on each to learn more about what they do 
          and how they affect battery performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedCategory === category.id 
                ? "ring-2 ring-primary" 
                : ""
            }`}
            onClick={() => {
              onCategorySelect?.(category.id);
              setExpandedCategory(expandedCategory === category.id ? null : category.id);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className={`p-3 rounded-xl ${category.bgColor}`}>
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {category.examples.length} examples
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">{category.name}</CardTitle>
              <CardDescription className="text-base">
                {category.simpleDescription}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              {expandedCategory === category.id ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm italic text-muted-foreground">
                      💡 {category.analogy}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Key Properties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.keyProperties.map((prop, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {prop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Common Examples</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {category.examples.map((example, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-primary" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {category.detailedDescription}
                  </p>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  <Info className="w-4 h-4 mr-2" />
                  Learn more
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showGlossary && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Quick Glossary
            </CardTitle>
            <CardDescription>
              Hover over terms throughout the app for explanations, or browse common terms here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(glossaryTerms)
                .slice(0, showAllTerms ? undefined : 4)
                .map(([term, definition]) => (
                  <div 
                    key={term}
                    className="p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h4 className="font-medium text-sm capitalize cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2">
                          {term.replace("-", " ")}
                        </h4>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>{definition}</p>
                      </TooltipContent>
                    </Tooltip>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {definition}
                    </p>
                  </div>
                ))}
            </div>
            {Object.keys(glossaryTerms).length > 4 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => setShowAllTerms(!showAllTerms)}
              >
                {showAllTerms ? "Show less" : `Show all ${Object.keys(glossaryTerms).length} terms`}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { categories, glossaryTerms };
export type { MaterialCategory };
