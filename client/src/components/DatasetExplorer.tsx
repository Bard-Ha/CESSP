import { useState } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Eye,
  Download,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import type { DatasetEntry } from "@shared/schema";

interface DatasetExplorerProps {
  entries: DatasetEntry[];
  isLoading?: boolean;
  onEntrySelect?: (entry: DatasetEntry) => void;
  totalCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
}

const categoryColors: Record<string, string> = {
  "Lithium-ion": "bg-chart-1/20 text-chart-1",
  "Sodium-ion": "bg-chart-2/20 text-chart-2",
  "Solid-state": "bg-chart-3/20 text-chart-3",
  "Supercapacitor": "bg-chart-4/20 text-chart-4",
  "Flow Battery": "bg-chart-5/20 text-chart-5",
};

function FilterDialog({ 
  onApply 
}: { 
  onApply: (filters: { category?: string; minEnergy?: number; maxEnergy?: number }) => void;
}) {
  const [category, setCategory] = useState<string>("");
  const [energyRange, setEnergyRange] = useState<[number, number]>([0, 500]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-filter">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Dataset</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Lithium-ion">Lithium-ion</SelectItem>
                <SelectItem value="Sodium-ion">Sodium-ion</SelectItem>
                <SelectItem value="Solid-state">Solid-state</SelectItem>
                <SelectItem value="Supercapacitor">Supercapacitor</SelectItem>
                <SelectItem value="Flow Battery">Flow Battery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium">Energy Density Range (Wh/kg)</label>
            <div className="px-2">
              <Slider
                value={energyRange}
                onValueChange={(value) => setEnergyRange(value as [number, number])}
                min={0}
                max={500}
                step={10}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{energyRange[0]} Wh/kg</span>
              <span>{energyRange[1]} Wh/kg</span>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={() => onApply({ 
              category: category === "all" ? undefined : category, 
              minEnergy: energyRange[0], 
              maxEnergy: energyRange[1] 
            })}
            data-testid="button-apply-filters"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MaterialDetailDialog({ entry }: { entry: DatasetEntry }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          data-testid={`button-view-${entry.materialId}`}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {entry.name}
            <Badge className={categoryColors[entry.category || ""] || "bg-muted"}>
              {entry.category}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Formula</span>
              <p className="font-mono font-medium">{entry.formula}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Space Group</span>
              <p className="font-mono">{entry.spaceGroup || "N/A"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-mono font-bold text-chart-1">
                  {entry.energyDensity?.toFixed(1) || "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Wh/kg</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-mono font-bold text-chart-2">
                  {entry.voltageWindow?.toFixed(2) || "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Voltage (V)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-mono font-bold text-chart-3">
                  {entry.ionicConductivity?.toExponential(2) || "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">S/cm</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="w-4 h-4" />
            <span>Source: {entry.source || "CESSP Database"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <Database className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-xl mb-2">No Materials Found</h3>
      <p className="text-muted-foreground max-w-md">
        Try adjusting your search criteria or filters to find materials.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-muted rounded-lg" />
      ))}
    </div>
  );
}

export function DatasetExplorer({ 
  entries, 
  isLoading,
  onEntrySelect,
  totalCount = 0,
  page = 1,
  onPageChange,
}: DatasetExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("energyDensity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  const filteredEntries = entries.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.formula.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const aVal = a[sortField as keyof DatasetEntry] as number || 0;
    const bVal = b[sortField as keyof DatasetEntry] as number || 0;
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search materials by name or formula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-dataset"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <FilterDialog onApply={(filters) => console.log(filters)} />
          
          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-40" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="energyDensity">Energy Density</SelectItem>
              <SelectItem value="voltageWindow">Voltage</SelectItem>
              <SelectItem value="ionicConductivity">Conductivity</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            data-testid="button-toggle-sort"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : sortedEntries.length === 0 ? (
            <EmptyState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleSort("energyDensity")}
                  >
                    <div className="flex items-center gap-1">
                      Energy (Wh/kg)
                      {sortField === "energyDensity" && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleSort("voltageWindow")}
                  >
                    <div className="flex items-center gap-1">
                      Voltage (V)
                      {sortField === "voltageWindow" && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEntries.map((entry) => (
                  <TableRow 
                    key={entry.id}
                    className="cursor-pointer hover-elevate"
                    onClick={() => onEntrySelect?.(entry)}
                    data-testid={`row-material-${entry.materialId}`}
                  >
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell className="font-mono text-sm">{entry.formula}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={categoryColors[entry.category || ""] || "bg-muted"}
                      >
                        {entry.category || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {entry.energyDensity?.toFixed(1) || "—"}
                    </TableCell>
                    <TableCell className="font-mono">
                      {entry.voltageWindow?.toFixed(2) || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <MaterialDetailDialog entry={entry} />
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} materials
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              data-testid="button-next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatasetExplorer;
