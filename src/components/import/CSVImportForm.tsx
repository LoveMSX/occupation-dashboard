
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, Database, Table, ArrowRight, Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const availableTables = [
  { id: "employees", name: "Employees" },
  { id: "projects", name: "Projects" },
  { id: "timeEntries", name: "Time Entries" },
  { id: "skills", name: "Skills" },
  { id: "clients", name: "Clients" }
];

// Ces colonnes représentent le mappage de base pour les tables principales
const defaultColumnMappings = {
  employees: [
    { key: "id", label: "ID", required: true, type: "number" },
    { key: "name", label: "Nom", required: true, type: "string" },
    { key: "email", label: "Email", required: true, type: "string" },
    { key: "position", label: "Poste", required: true, type: "string" },
    { key: "department", label: "Département", required: false, type: "string" },
    { key: "location", label: "Localisation", required: false, type: "string" },
    { key: "joinDate", label: "Date d'embauche", required: false, type: "date" },
    { key: "phone", label: "Téléphone", required: false, type: "string" },
    { key: "skills", label: "Compétences", required: false, type: "array" },
    { key: "occupancyRate", label: "Taux d'occupation", required: false, type: "number" },
    { key: "manager", label: "Manager", required: false, type: "string" },
  ],
  projects: [
    { key: "id", label: "ID", required: true, type: "number" },
    { key: "name", label: "Nom du projet", required: true, type: "string" },
    { key: "description", label: "Description", required: false, type: "string" },
    { key: "client", label: "Client", required: true, type: "string" },
    { key: "status", label: "Statut", required: true, type: "string" },
    { key: "category", label: "Catégorie", required: false, type: "string" },
    { key: "startDate", label: "Date de début", required: false, type: "date" },
    { key: "endDate", label: "Date de fin", required: false, type: "date" },
    { key: "progress", label: "Progression", required: false, type: "number" },
    { key: "location", label: "Localisation", required: false, type: "string" },
  ],
  timeEntries: [
    { key: "id", label: "ID", required: true, type: "number" },
    { key: "employeeId", label: "ID Employé", required: true, type: "number" },
    { key: "projectId", label: "ID Projet", required: true, type: "number" },
    { key: "date", label: "Date", required: true, type: "date" },
    { key: "hours", label: "Heures", required: true, type: "number" },
    { key: "description", label: "Description", required: false, type: "string" },
  ]
};

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
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<{[key: string]: string}>({});
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [customColumns, setCustomColumns] = useState<{key: string, label: string, required: boolean, type: string}[]>([]);
  const [parsedCsvData, setParsedCsvData] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Réinitialiser les mappages lorsqu'une nouvelle table est sélectionnée
  useEffect(() => {
    if (selectedTable) {
      // Initialiser un mappage par défaut si disponible pour cette table
      const defaultMapping = defaultColumnMappings[selectedTable as keyof typeof defaultColumnMappings] || [];
      setCustomColumns(defaultMapping);
      
      // Réinitialiser le mappage actuel
      setColumnMappings({});
    }
  }, [selectedTable]);

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
      toast.error("Veuillez télécharger un fichier CSV");
      return;
    }
    
    setSelectedFile(file);
    
    // Lire les en-têtes du CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      if (lines.length > 0) {
        // Obtenir les en-têtes
        const headers = lines[0].split(',').map(header => header.trim());
        setCsvHeaders(headers);
        
        // Lire également les 5 premières lignes pour l'aperçu
        const previewData = [];
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(value => value.trim());
            const rowData: {[key: string]: string} = {};
            
            headers.forEach((header, index) => {
              rowData[header] = values[index] || '';
            });
            
            previewData.push(rowData);
          }
        }
        setParsedCsvData(previewData);
      }
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleContinueToMapping = () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    if (!selectedTable) {
      toast.error("Veuillez sélectionner une table cible");
      return;
    }
    
    setShowMappingDialog(true);
  };

  const handleSaveMapping = () => {
    // Vérifier que tous les champs obligatoires sont mappés
    const requiredFields = customColumns.filter(col => col.required);
    const missingRequiredFields = requiredFields.filter(field => 
      !Object.values(columnMappings).includes(field.key)
    );
    
    if (missingRequiredFields.length > 0) {
      toast.error(`Champs obligatoires manquants: ${missingRequiredFields.map(f => f.label).join(', ')}`);
      return;
    }
    
    setShowMappingDialog(false);
    handleUpload();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    if (!selectedTable) {
      toast.error("Veuillez sélectionner une table cible");
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
        toast.success("Fichier CSV téléchargé avec succès", {
          description: `Données importées dans la table ${availableTables.find(t => t.id === selectedTable)?.name}.`
        });
        
        // Convertir les données CSV parsées en utilisant le mappage de colonnes
        const processedData = parsedCsvData.map(row => {
          const newRow: {[key: string]: any} = {};
          
          Object.entries(columnMappings).forEach(([csvHeader, targetField]) => {
            // Appliquer la conversion de type selon la définition de la colonne
            const columnDef = customColumns.find(col => col.key === targetField);
            if (columnDef) {
              let value = row[csvHeader];
              
              switch(columnDef.type) {
                case 'number':
                  newRow[targetField] = Number(value) || 0;
                  break;
                case 'date':
                  newRow[targetField] = value; // Garder comme chaîne pour l'instant
                  break;
                case 'array':
                  newRow[targetField] = value.split(';').map((item: string) => item.trim());
                  break;
                case 'boolean':
                  newRow[targetField] = value.toLowerCase() === 'true' || value === '1';
                  break;
                default:
                  newRow[targetField] = value;
              }
            }
          });
          
          // Ajouter un ID s'il n'est pas présent
          if (!newRow.id) {
            newRow.id = Math.floor(Math.random() * 10000);
          }
          
          return newRow;
        });
        
        setImportedData(processedData);
        setShowPreview(true);
        setCurrentTab("data");
        
        // Ne pas effacer le fichier sélectionné pour permettre plusieurs importations
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

  const handleEditChange = (field: string, value: any) => {
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
    toast.success("Enregistrement mis à jour");
  };

  const deleteRow = (rowIndex: number) => {
    const updatedData = importedData.filter((_, index) => index !== rowIndex);
    setImportedData(updatedData);
    toast.success("Enregistrement supprimé");
  };

  const addNewRow = () => {
    // Créer un nouvel enregistrement avec les colonnes actuelles
    const newRow: {[key: string]: any} = {
      id: importedData.length > 0 ? Math.max(...importedData.map((item: any) => item.id)) + 1 : 1
    };
    
    // Initialiser les valeurs par défaut pour chaque champ
    customColumns.forEach(column => {
      switch(column.type) {
        case 'number':
          newRow[column.key] = 0;
          break;
        case 'array':
          newRow[column.key] = [];
          break;
        case 'boolean':
          newRow[column.key] = false;
          break;
        case 'date':
          newRow[column.key] = new Date().toISOString().split('T')[0];
          break;
        default:
          newRow[column.key] = '';
      }
    });
    
    setImportedData([...importedData, newRow]);
    startEditing(importedData.length);
  };

  const addCustomColumn = () => {
    const newColumnKey = `custom_${Math.floor(Math.random() * 1000)}`;
    const newColumn = {
      key: newColumnKey,
      label: "Nouvelle colonne",
      required: false,
      type: "string"
    };
    
    setCustomColumns([...customColumns, newColumn]);
  };

  const updateCustomColumn = (index: number, field: string, value: any) => {
    const updatedColumns = [...customColumns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value
    };
    setCustomColumns(updatedColumns);
  };

  const removeCustomColumn = (index: number) => {
    const columnToRemove = customColumns[index];
    
    // Supprimer cette colonne du mappage
    const newMappings = {...columnMappings};
    Object.entries(newMappings).forEach(([key, value]) => {
      if (value === columnToRemove.key) {
        delete newMappings[key];
      }
    });
    setColumnMappings(newMappings);
    
    // Supprimer la colonne de la liste
    const updatedColumns = customColumns.filter((_, i) => i !== index);
    setCustomColumns(updatedColumns);
  };

  const getColumnTypeLabel = (type: string) => {
    switch(type) {
      case 'string': return 'Texte';
      case 'number': return 'Nombre';
      case 'date': return 'Date';
      case 'array': return 'Liste';
      case 'boolean': return 'Oui/Non';
      default: return 'Texte';
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Télécharger CSV
        </TabsTrigger>
        <TabsTrigger value="data" className="flex items-center gap-2" disabled={!showPreview}>
          <Table className="h-4 w-4" />
          Aperçu des données
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="animate-fade-in">
        <Card className="transition-all duration-300">
          <CardHeader>
            <CardTitle>Importer des données depuis CSV</CardTitle>
            <CardDescription>
              Téléchargez un fichier CSV contenant des données et sélectionnez la table cible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="table-select">Table cible</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger id="table-select" className="mt-1">
                  <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Sélectionner une table cible" />
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
                  <h3 className="text-lg font-medium mb-2">Glisser & Déposer un fichier CSV</h3>
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    ou cliquez pour parcourir les fichiers
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Taille maximale du fichier: 10MB
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mb-4 rounded-full bg-success/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Fichier sélectionné</h3>
                  <p className="text-sm text-center mb-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              )}
            </div>
            
            {parsedCsvData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Aperçu des données</h3>
                <div className="border rounded-md overflow-x-auto">
                  <UITable className="w-full">
                    <TableHeader>
                      <TableRow>
                        {csvHeaders.map((header, idx) => (
                          <TableHead key={idx}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedCsvData.map((row, rowIdx) => (
                        <TableRow key={rowIdx}>
                          {csvHeaders.map((header, colIdx) => (
                            <TableCell key={colIdx}>{row[header]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </UITable>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Téléchargement...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={() => {
                setSelectedFile(null);
                setCsvHeaders([]);
                setParsedCsvData([]);
              }} disabled={!selectedFile || isUploading}>
                Annuler
              </Button>
              <Button 
                onClick={handleContinueToMapping} 
                disabled={!selectedFile || !selectedTable || isUploading || csvHeaders.length === 0}
                className="transition-all"
              >
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="data" className="animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Données importées</CardTitle>
              <CardDescription>
                {selectedTable && `Affichage des données de la table ${availableTables.find(t => t.id === selectedTable)?.name}`}
              </CardDescription>
            </div>
            <Button onClick={addNewRow} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter une ligne</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      {customColumns.map((column) => (
                        <TableHead key={column.key}>
                          <div className="flex items-center gap-1">
                            {column.label}
                            {column.required && <Badge variant="outline" className="text-xs">Obligatoire</Badge>}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedData.map((row, index) => (
                      <TableRow key={index}>
                        {customColumns.map((column) => (
                          <TableCell key={column.key}>
                            {editingRow === index ? (
                              <div>
                                {column.type === 'array' ? (
                                  <Input 
                                    value={Array.isArray(editData[column.key]) ? editData[column.key].join('; ') : ''} 
                                    onChange={(e) => handleEditChange(column.key, e.target.value.split(';').map(item => item.trim()))}
                                    className="max-w-[180px]"
                                    placeholder="Séparé par des points-virgules"
                                  />
                                ) : column.type === 'boolean' ? (
                                  <Switch 
                                    checked={!!editData[column.key]} 
                                    onCheckedChange={(checked) => handleEditChange(column.key, checked)}
                                  />
                                ) : column.type === 'date' ? (
                                  <Input 
                                    type="date"
                                    value={editData[column.key] || ''} 
                                    onChange={(e) => handleEditChange(column.key, e.target.value)}
                                    className="max-w-[180px]"
                                  />
                                ) : column.type === 'number' ? (
                                  <Input 
                                    type="number"
                                    value={editData[column.key] || 0} 
                                    onChange={(e) => handleEditChange(column.key, Number(e.target.value))}
                                    className="max-w-[180px]"
                                  />
                                ) : (
                                  <Input 
                                    value={editData[column.key] || ''} 
                                    onChange={(e) => handleEditChange(column.key, e.target.value)}
                                    className="max-w-[180px]"
                                  />
                                )}
                              </div>
                            ) : (
                              <div>
                                {column.type === 'array' ? (
                                  Array.isArray(row[column.key]) ? row[column.key].join(', ') : ''
                                ) : column.type === 'boolean' ? (
                                  row[column.key] ? 'Oui' : 'Non'
                                ) : column.type === 'date' ? (
                                  row[column.key] ? new Date(row[column.key]).toLocaleDateString() : ''
                                ) : (
                                  row[column.key]
                                )}
                              </div>
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          {editingRow === index ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={cancelEditing}
                              >
                                Annuler
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => saveEdit(index)}
                              >
                                Enregistrer
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => startEditing(index)}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Éditer
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteRow(index)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {importedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={customColumns.length + 1} className="text-center py-8 text-muted-foreground">
                          Aucune donnée disponible. Importez des données d'abord.
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
              {importedData.length} éléments chargés
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              toast.success("Données exportées avec succès");
            }}>
              Exporter les données
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Dialogue de mappage des colonnes */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Configuration de l'importation</DialogTitle>
            <DialogDescription>
              Mappez les colonnes de votre CSV aux champs de la base de données et personnalisez la structure
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Structure des données</h3>
              <Button onClick={addCustomColumn} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un champ
              </Button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du champ</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[100px]">Obligatoire</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customColumns.map((column, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input 
                          value={column.label} 
                          onChange={(e) => updateCustomColumn(index, 'label', e.target.value)}
                          className="max-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={column.type}
                          onValueChange={(val) => updateCustomColumn(index, 'type', val)}
                        >
                          <SelectTrigger className="max-w-[150px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">Texte</SelectItem>
                            <SelectItem value="number">Nombre</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="array">Liste</SelectItem>
                            <SelectItem value="boolean">Oui/Non</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`required-${index}`} 
                            checked={column.required}
                            onCheckedChange={(checked) => updateCustomColumn(index, 'required', checked)}
                            disabled={column.key === 'id'} // L'ID est toujours obligatoire
                          />
                          <Label htmlFor={`required-${index}`}>{column.required ? 'Oui' : 'Non'}</Label>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeCustomColumn(index)}
                          disabled={column.key === 'id' || column.required} // Ne pas supprimer l'ID ou les champs obligatoires
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </div>
            
            <h3 className="text-lg font-medium mt-4">Mappage des colonnes CSV</h3>
            
            <div className="border rounded-md overflow-hidden">
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colonne CSV</TableHead>
                    <TableHead>Mappage au champ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvHeaders.map((header, index) => (
                    <TableRow key={index}>
                      <TableCell>{header}</TableCell>
                      <TableCell>
                        <Select 
                          value={columnMappings[header] || ''}
                          onValueChange={(val) => {
                            setColumnMappings(prev => ({
                              ...prev,
                              [header]: val
                            }));
                          }}
                        >
                          <SelectTrigger className="max-w-[250px]">
                            <SelectValue placeholder="Sélectionner un champ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Ne pas importer</SelectItem>
                            {customColumns.map((column) => (
                              <SelectItem key={column.key} value={column.key}>
                                {column.label} ({getColumnTypeLabel(column.type)})
                                {column.required && ' *'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveMapping}>
              Confirmer et importer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
