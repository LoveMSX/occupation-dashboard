
import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CSVImportForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Check if file is CSV
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Simulate processing delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Simulate success after a brief delay
      setTimeout(() => {
        setIsUploading(false);
        toast.success("CSV file uploaded successfully", {
          description: "Data has been processed and is now available in the dashboard."
        });
        setSelectedFile(null);
      }, 500);
    }, 2000);
  };

  return (
    <Card className="transition-all duration-300">
      <CardHeader>
        <CardTitle>Import Data from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file containing employee and project data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-all",
            isDragging ? "border-primary bg-primary/5" : "border-border",
            isUploading ? "opacity-50 pointer-events-none" : "hover:border-primary/50 hover:bg-muted/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
          />
          
          {!selectedFile ? (
            <>
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Drag & Drop CSV File</h3>
              <p className="text-sm text-muted-foreground text-center mb-2">
                or click to browse for a file
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Maximum file size: 10MB
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <FileText className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-medium mb-2">File Selected</h3>
              <p className="text-sm text-center mb-2">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          )}
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Uploading...</span>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between">
          <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={!selectedFile || isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="transition-all"
          >
            {isUploading ? "Processing..." : "Upload & Process"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
