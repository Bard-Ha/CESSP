import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Sparkles, 
  Plus, 
  X, 
  Loader2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Atom,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Candidate } from "@shared/schema";

const generatorSchema = z.object({
  baseFormula: z.string().optional(),
  targetEnergyDensity: z.number().min(0).max(1000).optional(),
  targetVoltage: z.number().min(0).max(10).optional(),
  count: z.number().min(1).max(50).default(10),
});

type GeneratorFormData = z.infer<typeof generatorSchema>;

interface CandidateGeneratorProps {
  onGenerate?: (params: GeneratorFormData & { elements: string[]; excludeElements: string[] }) => void;
  candidates?: Candidate[];
  isGenerating?: boolean;
}

const commonElements = [
  "Li", "Na", "K", "Mg", "Ca", "Al", "Si", "P", "S", "Cl",
  "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "O"
];

function CandidateCard({ candidate, index }: { candidate: Candidate; index: number }) {
  const properties = candidate.predictedProperties as Record<string, number> | null;
  
  return (
    <Card className="overflow-visible hover-elevate transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                #{index + 1}
              </Badge>
              <span className="font-mono font-semibold text-lg" data-testid={`text-candidate-formula-${index}`}>
                {candidate.formula}
              </span>
            </div>
            
            {properties && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-chart-1" />
                  <span className="text-muted-foreground">Energy:</span>
                  <span className="font-mono font-medium">
                    {properties.energyDensity?.toFixed(1) || "—"} Wh/kg
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5 text-chart-2" />
                  <span className="text-muted-foreground">Voltage:</span>
                  <span className="font-mono font-medium">
                    {properties.voltage?.toFixed(2) || "—"} V
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-primary">
                {((candidate.score || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Match Score</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-6">
        <FlaskConical className="w-10 h-10 text-accent" />
      </div>
      <h3 className="font-display font-semibold text-xl mb-2">Generate Candidates</h3>
      <p className="text-muted-foreground max-w-md">
        Configure target properties and constraints to discover new materials 
        optimized for your energy storage requirements.
      </p>
    </div>
  );
}

export function CandidateGenerator({ 
  onGenerate, 
  candidates = [], 
  isGenerating 
}: CandidateGeneratorProps) {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [excludedElements, setExcludedElements] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const form = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      baseFormula: "",
      targetEnergyDensity: 300,
      targetVoltage: 3.5,
      count: 10,
    },
  });

  const toggleElement = (element: string, list: "include" | "exclude") => {
    if (list === "include") {
      if (selectedElements.includes(element)) {
        setSelectedElements(selectedElements.filter(e => e !== element));
      } else {
        setSelectedElements([...selectedElements, element]);
        setExcludedElements(excludedElements.filter(e => e !== element));
      }
    } else {
      if (excludedElements.includes(element)) {
        setExcludedElements(excludedElements.filter(e => e !== element));
      } else {
        setExcludedElements([...excludedElements, element]);
        setSelectedElements(selectedElements.filter(e => e !== element));
      }
    }
  };

  const onSubmit = (data: GeneratorFormData) => {
    onGenerate?.({
      ...data,
      elements: selectedElements,
      excludeElements: excludedElements,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Generation Parameters
            </CardTitle>
            <CardDescription>
              Define target properties for candidate material generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="baseFormula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Formula (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., LiCoO2" 
                          {...field}
                          data-testid="input-base-formula"
                        />
                      </FormControl>
                      <FormDescription>
                        Start from an existing material structure
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetEnergyDensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Energy Density</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            value={[field.value || 300]}
                            onValueChange={([value]) => field.onChange(value)}
                            min={50}
                            max={500}
                            step={10}
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">50 Wh/kg</span>
                            <span className="font-mono font-medium">{field.value} Wh/kg</span>
                            <span className="text-muted-foreground">500 Wh/kg</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetVoltage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Voltage Window</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            value={[field.value || 3.5]}
                            onValueChange={([value]) => field.onChange(value)}
                            min={1}
                            max={6}
                            step={0.1}
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">1 V</span>
                            <span className="font-mono font-medium">{field.value?.toFixed(1)} V</span>
                            <span className="text-muted-foreground">6 V</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Candidates</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            value={[field.value || 10]}
                            onValueChange={([value]) => field.onChange(value)}
                            min={1}
                            max={50}
                            step={1}
                          />
                          <div className="text-center text-sm font-mono font-medium">
                            {field.value} candidates
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      Element Constraints
                      {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Include Elements</span>
                        {selectedElements.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedElements([])}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {commonElements.map((el) => (
                          <Badge
                            key={`include-${el}`}
                            variant={selectedElements.includes(el) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleElement(el, "include")}
                          >
                            {selectedElements.includes(el) && <Plus className="w-3 h-3 mr-1" />}
                            {el}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Exclude Elements</span>
                        {excludedElements.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setExcludedElements([])}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {commonElements.map((el) => (
                          <Badge
                            key={`exclude-${el}`}
                            variant={excludedElements.includes(el) ? "destructive" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleElement(el, "exclude")}
                          >
                            {excludedElements.includes(el) && <X className="w-3 h-3 mr-1" />}
                            {el}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button 
                  type="submit" 
                  className="w-full gap-2"
                  disabled={isGenerating}
                  data-testid="button-generate-candidates"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Candidates
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-xl">
            Generated Candidates
          </h3>
          {candidates.length > 0 && (
            <Badge variant="secondary">
              {candidates.length} results
            </Badge>
          )}
        </div>

        {candidates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateGenerator;
