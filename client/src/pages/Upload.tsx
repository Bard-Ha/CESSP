import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { FileUpload } from "@/components/FileUpload";
import { StructureEditor } from "@/components/StructureEditor";
import { MoleculeScene } from "@/components/3d/MoleculeScene";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, Code, Eye, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  content: string;
  format: string;
}

export default function Upload() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (data: { name: string; content: string; format: string }) => {
      const response = await apiRequest("POST", "/api/materials", {
        name: data.name,
        format: data.format,
        rawData: data.content,
        formula: extractFormula(data.content, data.format),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Material uploaded",
        description: `${data.name} has been uploaded and processed.`,
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to process the material. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    uploadMutation.mutate({
      name: file.name,
      content: file.content,
      format: file.format,
    });
  };

  const handleEditorSubmit = (content: string, format: string) => {
    const name = `Structure_${Date.now()}`;
    setUploadedFile({ name, content, format });
    uploadMutation.mutate({
      name,
      content,
      format: format.toUpperCase(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold">Upload Material</h1>
              {uploadMutation.isPending && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              Upload a crystal structure or molecule for energy storage prediction
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="upload" className="gap-2" data-testid="tab-upload">
                    <UploadIcon className="w-4 h-4" />
                    File Upload
                  </TabsTrigger>
                  <TabsTrigger value="editor" className="gap-2" data-testid="tab-editor">
                    <Code className="w-4 h-4" />
                    Code Editor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <FileUpload 
                    onFileUpload={handleFileUpload}
                    multiple={false}
                  />
                </TabsContent>

                <TabsContent value="editor">
                  <StructureEditor 
                    onSubmit={handleEditorSubmit}
                    isProcessing={uploadMutation.isPending}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Structure Preview
                  </CardTitle>
                  <CardDescription>
                    3D visualization of the uploaded structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
                    <MoleculeScene 
                      showParticles={false} 
                      rotating={true}
                    />
                  </div>
                </CardContent>
              </Card>

              {uploadedFile && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">File Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium truncate ml-2" data-testid="text-uploaded-filename">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format</span>
                      <Badge variant="outline">{uploadedFile.format}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-mono">
                        {(uploadedFile.content.length / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function extractFormula(content: string, format: string): string {
  if (format === "CIF" || format === "cif") {
    const match = content.match(/data_(\w+)/);
    return match ? match[1] : "Unknown";
  }
  if (format === "POSCAR" || format === "poscar") {
    const lines = content.split('\n');
    return lines[0]?.trim() || "Unknown";
  }
  if (format === "JSON" || format === "json") {
    try {
      const data = JSON.parse(content);
      return data.properties?.formula || "Unknown";
    } catch {
      return "Unknown";
    }
  }
  return content.split('\n')[0]?.substring(0, 50) || "Unknown";
}
