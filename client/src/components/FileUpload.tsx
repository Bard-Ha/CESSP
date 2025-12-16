import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  FileText, 
  Atom, 
  Code, 
  X, 
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string;
  format: "CIF" | "POSCAR" | "SMILES" | "JSON" | "UNKNOWN";
}

const formatInfo = {
  CIF: { icon: Atom, color: "text-chart-1", description: "Crystallographic Information File" },
  POSCAR: { icon: FileText, color: "text-chart-2", description: "VASP structure file" },
  SMILES: { icon: Code, color: "text-chart-3", description: "Molecular string notation" },
  JSON: { icon: Code, color: "text-chart-4", description: "Graph representation" },
  UNKNOWN: { icon: FileText, color: "text-muted-foreground", description: "Unknown format" },
};

function detectFormat(filename: string, content: string): UploadedFile["format"] {
  const ext = filename.toLowerCase().split('.').pop();
  
  if (ext === "cif" || content.includes("_cell_length") || content.includes("data_")) {
    return "CIF";
  }
  if (ext === "poscar" || ext === "vasp" || content.match(/^\s*[\d.]+\s*$/m)) {
    return "POSCAR";
  }
  if (ext === "smi" || ext === "smiles" || /^[A-Za-z0-9@+\-\[\]()=#%]+$/.test(content.trim().split('\n')[0])) {
    return "SMILES";
  }
  if (ext === "json") {
    try {
      JSON.parse(content);
      return "JSON";
    } catch {
      return "UNKNOWN";
    }
  }
  return "UNKNOWN";
}

interface FileUploadProps {
  onFileUpload?: (file: UploadedFile) => void;
  onFilesChange?: (files: UploadedFile[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export function FileUpload({ 
  onFileUpload, 
  onFilesChange,
  multiple = false, 
  maxFiles = 5 
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const processedFiles: UploadedFile[] = [];
      
      for (const file of acceptedFiles) {
        const content = await file.text();
        const format = detectFormat(file.name, content);
        
        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          content,
          format,
        };
        
        processedFiles.push(uploadedFile);
        
        if (onFileUpload) {
          onFileUpload(uploadedFile);
        }
      }
      
      const newFiles = multiple 
        ? [...files, ...processedFiles].slice(0, maxFiles)
        : processedFiles.slice(0, 1);
      
      setFiles(newFiles);
      
      if (onFilesChange) {
        onFilesChange(newFiles);
      }
    } catch (err) {
      setError("Failed to process file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [files, multiple, maxFiles, onFileUpload, onFilesChange]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.cif', '.poscar', '.vasp', '.smi', '.smiles'],
      'application/json': ['.json'],
    },
    multiple,
    maxFiles,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          relative min-h-[300px] rounded-2xl border-2 border-dashed 
          flex flex-col items-center justify-center p-8 cursor-pointer
          transition-all duration-300
          ${isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
          ${isProcessing ? "pointer-events-none opacity-50" : ""}
        `}
        data-testid="dropzone-upload"
      >
        <input {...getInputProps()} data-testid="input-file-upload" />
        
        <div className="text-center space-y-4">
          <div className={`
            w-20 h-20 mx-auto rounded-2xl flex items-center justify-center
            transition-all duration-300
            ${isDragActive ? "bg-primary/20 scale-110" : "bg-muted"}
          `}>
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            ) : (
              <Upload className={`w-10 h-10 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
            )}
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg">
              {isDragActive ? "Drop files here" : "Upload Material Structure"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Drag and drop or click to browse
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.entries(formatInfo).filter(([key]) => key !== "UNKNOWN").map(([format, info]) => {
              const Icon = info.icon;
              return (
                <Badge 
                  key={format} 
                  variant="secondary" 
                  className="gap-1.5"
                >
                  <Icon className={`w-3 h-3 ${info.color}`} />
                  {format}
                </Badge>
              );
            })}
          </div>
        </div>

        {isDragActive && (
          <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse pointer-events-none" />
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          
          {files.map((file, index) => {
            const info = formatInfo[file.format];
            const Icon = info.icon;
            
            return (
              <Card key={`${file.name}-${index}`} className="overflow-visible">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${info.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate" data-testid={`text-filename-${index}`}>
                          {file.name}
                        </span>
                        <Badge variant="outline" className="shrink-0">
                          {file.format}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span className="text-xs">•</span>
                        <span>{info.description}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-chart-3/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-chart-3" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        data-testid={`button-remove-file-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
