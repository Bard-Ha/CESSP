import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { 
  Code, 
  Play, 
  Copy, 
  Check,
  FileText,
  Atom,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const exampleCIF = `data_LiCoO2
_cell_length_a   2.8156
_cell_length_b   2.8156
_cell_length_c   14.0516
_cell_angle_alpha   90.000
_cell_angle_beta    90.000
_cell_angle_gamma   120.000
_symmetry_space_group_name_H-M   'R -3 m'

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Li1 Li 0.00000 0.00000 0.50000
Co1 Co 0.00000 0.00000 0.00000
O1  O  0.00000 0.00000 0.23960`;

const examplePOSCAR = `LiCoO2 R-3m
1.0
2.8156 0.0000 0.0000
-1.4078 2.4383 0.0000
0.0000 0.0000 14.0516
Li Co O
1 1 2
Direct
0.00000 0.00000 0.50000 Li
0.00000 0.00000 0.00000 Co
0.00000 0.00000 0.23960 O
0.00000 0.00000 0.76040 O`;

const exampleSMILES = `[Li+].[O-]C([O-])=O
[Li]OC(=O)[O-].[Li+]
[Li].[Li].[O]=[Mn]([O-])([O-])[O-]`;

const exampleJSON = JSON.stringify({
  nodes: [
    { id: 0, element: "Li", position: [0, 0, 7.026] },
    { id: 1, element: "Co", position: [0, 0, 0] },
    { id: 2, element: "O", position: [0, 0, 3.369] },
    { id: 3, element: "O", position: [0, 0, 10.683] }
  ],
  edges: [
    { source: 0, target: 1, type: "ionic" },
    { source: 1, target: 2, type: "covalent" },
    { source: 1, target: 3, type: "covalent" }
  ],
  properties: {
    formula: "LiCoO2",
    spaceGroup: "R-3m"
  }
}, null, 2);

const formatConfigs: Record<string, { label: string; icon: typeof Code; example: string; language: string }> = {
  cif: { label: "CIF", icon: Atom, example: exampleCIF, language: "plaintext" },
  poscar: { label: "POSCAR", icon: FileText, example: examplePOSCAR, language: "plaintext" },
  smiles: { label: "SMILES", icon: Code, example: exampleSMILES, language: "plaintext" },
  json: { label: "JSON Graph", icon: Code, example: exampleJSON, language: "json" },
};

interface StructureEditorProps {
  onSubmit?: (content: string, format: string) => void;
  isProcessing?: boolean;
}

export function StructureEditor({ onSubmit, isProcessing }: StructureEditorProps) {
  const [activeFormat, setActiveFormat] = useState("cif");
  const [content, setContent] = useState(exampleCIF);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFormatChange = useCallback((format: string) => {
    setActiveFormat(format);
    setContent(formatConfigs[format].example);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Structure data has been copied.",
    });
  }, [content, toast]);

  const handleSubmit = useCallback(() => {
    if (!content.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter structure data before submitting.",
        variant: "destructive",
      });
      return;
    }
    onSubmit?.(content, activeFormat);
  }, [content, activeFormat, onSubmit, toast]);

  const currentConfig = formatConfigs[activeFormat];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Structure Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              data-testid="button-copy-code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-chart-3" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="gap-2"
              data-testid="button-submit-structure"
            >
              <Play className="w-4 h-4" />
              Analyze
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeFormat} onValueChange={handleFormatChange}>
          <TabsList className="grid grid-cols-4">
            {Object.entries(formatConfigs).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="gap-1.5"
                  data-testid={`tab-format-${key}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {Object.keys(formatConfigs).map((format) => (
            <TabsContent key={format} value={format} className="mt-4">
              <div className="rounded-lg border overflow-hidden">
                <Editor
                  height="400px"
                  language={formatConfigs[format].language}
                  value={content}
                  onChange={(value) => setContent(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 },
                    wordWrap: "on",
                  }}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
          <Info className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              {currentConfig.label} Format
            </p>
            <p>
              {activeFormat === "cif" && "Crystallographic Information File - standard format for crystal structure data."}
              {activeFormat === "poscar" && "VASP structure file format - commonly used in DFT calculations."}
              {activeFormat === "smiles" && "Simplified molecular-input line-entry system - text representation of molecules."}
              {activeFormat === "json" && "Graph representation with nodes (atoms) and edges (bonds) for GNN input."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StructureEditor;
