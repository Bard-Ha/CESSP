import { useMemo } from "react";
import Plot from "react-plotly.js";
import { 
  Zap, 
  Battery, 
  Thermometer, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { PredictionResult } from "@shared/schema";

interface PredictionDashboardProps {
  prediction: PredictionResult | null;
  isLoading?: boolean;
}

function MetricCard({
  label,
  value,
  unit,
  uncertainty,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  uncertainty?: number;
  icon: typeof Zap;
  color: string;
}) {
  const uncertaintyPercent = uncertainty ? (uncertainty / value) * 100 : 0;
  
  return (
    <Card className="overflow-visible">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-bold">{value.toFixed(2)}</span>
              <span className="text-muted-foreground text-sm">{unit}</span>
            </div>
            {uncertainty !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  ± {uncertainty.toFixed(3)}
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        uncertaintyPercent < 5 
                          ? "bg-chart-3/20 text-chart-3" 
                          : uncertaintyPercent < 15 
                            ? "bg-chart-4/20 text-chart-4" 
                            : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {uncertaintyPercent.toFixed(1)}%
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Model uncertainty: {uncertaintyPercent < 5 ? "Low" : uncertaintyPercent < 15 ? "Moderate" : "High"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color.replace('text-', 'from-')}/20 to-transparent`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ValidationStatus({ validation }: { validation: PredictionResult["physicsValidation"] }) {
  const items = [
    { key: "chargeNeutrality", label: "Charge Neutrality", passed: validation.chargeNeutrality },
    { key: "energyConservation", label: "Energy Conservation", passed: validation.energyConservation },
    { key: "thermodynamicStability", label: "Thermodynamic Stability", passed: validation.thermodynamicStability },
    { key: "structuralIntegrity", label: "Structural Integrity", passed: validation.structuralIntegrity },
  ];
  
  const passedCount = items.filter(i => i.passed).length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Physics Validation</CardTitle>
          <Badge 
            variant={passedCount === 4 ? "default" : passedCount >= 2 ? "secondary" : "destructive"}
            className="gap-1"
          >
            {passedCount}/4 Passed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.key}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <span className="text-sm font-medium">{item.label}</span>
            {item.passed ? (
              <CheckCircle2 className="w-5 h-5 text-chart-3" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DescriptorChart({ descriptors }: { descriptors: PredictionResult["descriptors"] }) {
  const data = useMemo(() => {
    const labels = Object.keys(descriptors);
    const values = Object.values(descriptors) as number[];
    const maxVal = Math.max(...values);
    const normalizedValues = values.map(v => (v / maxVal) * 100);
    
    return [{
      type: 'scatterpolar' as const,
      r: normalizedValues,
      theta: labels.map(l => l.replace(/([A-Z])/g, ' $1').trim()),
      fill: 'toself' as const,
      fillcolor: 'rgba(52, 211, 153, 0.2)',
      line: { color: 'rgb(52, 211, 153)', width: 2 },
      marker: { color: 'rgb(52, 211, 153)', size: 8 },
    }];
  }, [descriptors]);

  const layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100],
        tickfont: { color: 'rgba(148, 163, 184, 0.7)', size: 10 },
        gridcolor: 'rgba(148, 163, 184, 0.1)',
      },
      angularaxis: {
        tickfont: { color: 'rgba(148, 163, 184, 0.9)', size: 11 },
        gridcolor: 'rgba(148, 163, 184, 0.1)',
      },
      bgcolor: 'transparent',
    },
    showlegend: false,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 60, r: 60, t: 40, b: 40 },
    font: { family: 'Inter, system-ui, sans-serif' },
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Material Descriptors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Plot
            data={data}
            layout={layout}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function UncertaintyVisualization({ prediction }: { prediction: PredictionResult }) {
  const metrics = [
    { label: "Energy Density", value: prediction.energyDensity, uncertainty: prediction.uncertainty.energyDensity },
    { label: "Voltage Window", value: prediction.voltageWindow, uncertainty: prediction.uncertainty.voltageWindow },
    { label: "Ionic Conductivity", value: prediction.ionicConductivity, uncertainty: prediction.uncertainty.ionicConductivity },
    { label: "Thermal Stability", value: prediction.thermalStability, uncertainty: prediction.uncertainty.thermalStability },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Uncertainty Analysis</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Uncertainty estimates from Monte Carlo dropout. Lower values indicate higher model confidence.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const percent = (metric.uncertainty / metric.value) * 100;
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">{percent.toFixed(1)}%</span>
              </div>
              <Progress 
                value={Math.min(percent, 100)} 
                className={`h-2 ${
                  percent < 5 ? "[&>div]:bg-chart-3" : 
                  percent < 15 ? "[&>div]:bg-chart-4" : 
                  "[&>div]:bg-destructive"
                }`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-32 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 h-[350px] flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 h-[350px] flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <Activity className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-xl mb-2">No Predictions Yet</h3>
      <p className="text-muted-foreground max-w-md">
        Upload a material structure file to generate predictions for energy storage properties.
      </p>
    </div>
  );
}

export function PredictionDashboard({ prediction, isLoading }: PredictionDashboardProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (!prediction) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-2xl">
            {prediction.materialName}
          </h2>
          <p className="text-muted-foreground text-sm">
            Material ID: {prediction.materialId}
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <Activity className="w-3 h-3" />
          Prediction Complete
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Energy Density"
          value={prediction.energyDensity}
          unit="Wh/kg"
          uncertainty={prediction.uncertainty.energyDensity}
          icon={Zap}
          color="text-chart-1"
        />
        <MetricCard
          label="Voltage Window"
          value={prediction.voltageWindow}
          unit="V"
          uncertainty={prediction.uncertainty.voltageWindow}
          icon={Battery}
          color="text-chart-2"
        />
        <MetricCard
          label="Ionic Conductivity"
          value={prediction.ionicConductivity}
          unit="S/cm"
          uncertainty={prediction.uncertainty.ionicConductivity}
          icon={Activity}
          color="text-chart-3"
        />
        <MetricCard
          label="Thermal Stability"
          value={prediction.thermalStability}
          unit="K"
          uncertainty={prediction.uncertainty.thermalStability}
          icon={Thermometer}
          color="text-chart-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DescriptorChart descriptors={prediction.descriptors} />
        <ValidationStatus validation={prediction.physicsValidation} />
      </div>

      <UncertaintyVisualization prediction={prediction} />
    </div>
  );
}

export default PredictionDashboard;
