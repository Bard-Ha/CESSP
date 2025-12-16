import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { CandidateGenerator } from "@/components/CandidateGenerator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@shared/schema";

interface GeneratorParams {
  baseFormula?: string;
  targetEnergyDensity?: number;
  targetVoltage?: number;
  count?: number;
  elements: string[];
  excludeElements: string[];
}

export default function Generate() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (params: GeneratorParams) => {
      const response = await apiRequest("POST", "/api/generate", {
        baseFormula: params.baseFormula,
        targetEnergyDensity: params.targetEnergyDensity,
        targetVoltage: params.targetVoltage,
        count: params.count || 10,
        constraints: {
          elements: params.elements,
          excludeElements: params.excludeElements,
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCandidates(data.candidates || []);
      toast({
        title: "Generation complete",
        description: `Generated ${data.candidates?.length || 0} candidate materials.`,
      });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Failed to generate candidates. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (params: GeneratorParams) => {
    generateMutation.mutate(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Candidate Generator
              </h1>
              {generateMutation.isPending && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              Generate novel materials optimized for target energy storage properties
            </p>
          </div>

          <CandidateGenerator
            onGenerate={handleGenerate}
            candidates={candidates}
            isGenerating={generateMutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}
