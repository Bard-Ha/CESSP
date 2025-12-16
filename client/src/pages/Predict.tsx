import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { PredictionDashboard } from "@/components/PredictionDashboard";
import { MoleculeScene } from "@/components/3d/MoleculeScene";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Play, Loader2, RefreshCw } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Material, PredictionResult } from "@shared/schema";

export default function Predict() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const { data: materials = [], isLoading: materialsLoading } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
  });

  const predictMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const response = await apiRequest("POST", "/api/predict", { materialId });
      return response.json();
    },
    onSuccess: (data) => {
      setPrediction(data);
      toast({
        title: "Prediction complete",
        description: "Energy storage properties have been predicted.",
      });
    },
    onError: () => {
      toast({
        title: "Prediction failed",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePredict = () => {
    if (!selectedMaterialId) {
      toast({
        title: "No material selected",
        description: "Please select a material to predict.",
        variant: "destructive",
      });
      return;
    }
    predictMutation.mutate(selectedMaterialId);
  };

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Prediction Dashboard
              </h1>
              {predictMutation.isPending && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Predicting
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              Run physics-informed GNN predictions on uploaded materials
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <Card className="lg:col-span-3">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle>Select Material</CardTitle>
                    <CardDescription>
                      Choose a material from your uploads to run prediction
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select 
                      value={selectedMaterialId} 
                      onValueChange={setSelectedMaterialId}
                      disabled={materialsLoading}
                    >
                      <SelectTrigger className="w-[280px]" data-testid="select-material">
                        <SelectValue placeholder="Select a material..." />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            <div className="flex items-center gap-2">
                              <span>{material.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {material.format}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      onClick={handlePredict}
                      disabled={!selectedMaterialId || predictMutation.isPending}
                      className="gap-2"
                      data-testid="button-run-prediction"
                    >
                      {predictMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Prediction
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Structure View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
                  <MoleculeScene 
                    showParticles={false} 
                    rotating={true}
                  />
                </div>
                {selectedMaterial && (
                  <div className="mt-3 text-center">
                    <p className="font-mono text-sm font-medium" data-testid="text-selected-material">
                      {selectedMaterial.formula || selectedMaterial.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <PredictionDashboard 
            prediction={prediction}
            isLoading={predictMutation.isPending}
          />

          {materials.length === 0 && !materialsLoading && (
            <Card className="mt-8">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-6">
                  <BarChart3 className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">
                  No Materials Available
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Upload a material structure first to run predictions on energy storage properties.
                </p>
                <Button variant="outline" asChild>
                  <a href="/upload">Upload Material</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
