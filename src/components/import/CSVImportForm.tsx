import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, Database, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const availableTables = [
  { id: "employees", name: "Employees" },
  { id: "projects", name: "Projects" },
  { id: "timeEntries", name: "Time Entries" },
  { id: "skills", name: "Skills" },
  { id: "clients", name: "Clients" }
];

const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    position: "Senior Developer"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Design",
    position: "UX Designer"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    department: "Product",
    position: "Product Manager"
  }
];

export function CSVImportForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("upload");
  const [importedData, setImportedData] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  
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
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    
    if (!selectedTable) {
      toast.error("Please select a target table");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success("CSV file uploaded successfully", {
          description: `Data has been imported to the ${availableTables.find(t => t.id === selectedTable)?.name} table.`
        });
        
        setImportedData(sampleData);
        setShowPreview(true);
        setCurrentTab("data");
        
        setSelectedFile(null);
      }, 500);
    }, 2000);
  };

  const startEditing = (rowIndex: number) => {
    setEditingRow(rowIndex);
    setEditData({...importedData[rowIndex]});
  };

  const cancelEditing = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveEdit = (rowIndex: number) => {
    const updatedData = [...importedData];
    updatedData[rowIndex] = editData;
    setImportedData(updatedData);
    setEditingRow(null);
    toast.success("Record updated successfully");
  };

  const deleteRow = (rowIndex: number) => {
    const updatedData = importedData.filter((_, index) => index !== rowIndex);
    setImportedData(updatedData);
    toast.success("Record deleted successfully");
  };

  const addNewRow = () => {
    const newRow = {
      id: importedData.length > 0 ? Math.max(...importedData.map(item => item.id)) + 1 : 1,
      name: "",
      email: "",
      department: "",
      position: ""
    };
    
    setImportedData([...importedData, newRow]);
    startEditing(importedData.length);
  };

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload CSV
        </TabsTrigger>
        <TabsTrigger value="data" className="flex items-center gap-2" disabled={!showPreview}>
          <Table className="h-4 w-4" />
          Data Table
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="animate-fade-in">
        <Card className="transition-all duration-300">
          <CardHeader>
            <CardTitle>Import Data from CSV</CardTitle>
            <CardDescription>
              Upload a CSV file containing data and select the target table
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="table-select">Target Table</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger id="table-select" className="mt-1">
                  <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select target table" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map(table => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                disabled={!selectedFile || !selectedTable || isUploading}
                className="transition-all"
              >
                {isUploading ? "Processing..." : "Upload & Process"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="data" className="animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Imported Data</CardTitle>
              <CardDescription>
                {selectedTable && `Showing data from ${availableTables.find(t => t.id === selectedTable)?.name} table`}
              </CardDescription>
            </div>
            <Button onClick={addNewRow} size="sm" className="flex items-center gap-2">
              <span>Add New Row</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <Input 
                              value={editData.name} 
                              onChange={(e) => handleEditChange('name', e.target.value)}
                              className="max-w-[180px]"
                            />
                          ) : (
                            row.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <Input 
                              value={editData.email} 
                              onChange={(e) => handleEditChange('email', e.target.value)}
                              className="max-w-[180px]"
                            />
                          ) : (
                            row.email
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <Input 
                              value={editData.department} 
                              onChange={(e) => handleEditChange('department', e.target.value)}
                              className="max-w-[150px]"
                            />
                          ) : (
                            row.department
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <Input 
                              value={editData.position} 
                              onChange={(e) => handleEditChange('position', e.target.value)}
                              className="max-w-[150px]"
                            />
                          ) : (
                            row.position
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingRow === index ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={cancelEditing}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => saveEdit(index)}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => startEditing(index)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteRow(index)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {importedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No data available. Import some data first.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {importedData.length} items loaded
            </div>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
