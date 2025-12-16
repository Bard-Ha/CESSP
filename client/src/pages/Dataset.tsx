import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { DatasetExplorer } from "@/components/DatasetExplorer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Atom, Zap, Activity } from "lucide-react";
import type { DatasetEntry } from "@shared/schema";

export default function Dataset() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{ entries: DatasetEntry[]; total: number }>({
    queryKey: ["/api/dataset", page],
  });

  const entries = data?.entries || [];
  const totalCount = data?.total || 0;

  const stats = {
    total: totalCount,
    categories: new Set(entries.map(e => e.category)).size,
    avgEnergy: entries.length > 0 
      ? entries.reduce((sum, e) => sum + (e.energyDensity || 0), 0) / entries.length 
      : 0,
    avgVoltage: entries.length > 0 
      ? entries.reduce((sum, e) => sum + (e.voltageWindow || 0), 0) / entries.length 
      : 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Materials Dataset
              </h1>
              <Badge variant="secondary" className="gap-1">
                <Database className="w-3 h-3" />
                {totalCount} entries
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              Explore our curated database of energy storage materials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Materials"
              value={stats.total.toString()}
              icon={Atom}
              color="text-chart-1"
            />
            <StatCard
              label="Categories"
              value={stats.categories.toString()}
              icon={Database}
              color="text-chart-2"
            />
            <StatCard
              label="Avg. Energy Density"
              value={`${stats.avgEnergy.toFixed(0)} Wh/kg`}
              icon={Zap}
              color="text-chart-3"
            />
            <StatCard
              label="Avg. Voltage"
              value={`${stats.avgVoltage.toFixed(2)} V`}
              icon={Activity}
              color="text-chart-4"
            />
          </div>

          <DatasetExplorer
            entries={entries}
            isLoading={isLoading}
            totalCount={totalCount}
            page={page}
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: typeof Database;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="font-mono text-xl font-bold" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
