
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ArrowRight, Check, Database, LinkIcon, RefreshCw, Settings,
  Table as TableIcon, ArrowDown, Plus, Edit2, Trash2, Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DATA_TYPE_MAPPING = {
  "title": "string",
  "rich_text": "string",
  "number": "number",
  "select": "string",
  "multi_select": "array",
  "date": "date",
  "people": "string",
  "files": "array",
  "checkbox": "boolean",
  "url": "string",
  "email": "string",
  "phone_number": "string",
  "formula": "string",
  "relation": "array",
  "rollup": "string",
  "created_time": "date",
  "created_by": "string",
  "last_edited_time": "date",
  "last_edited_by": "string"
};

export function NotionIntegration() {
  const [apiKey, setApiKey] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Notion database integration states
  const [notionDatabases, setNotionDatabases] = useState<{id: string, title: string}[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [databaseSchema, setDatabaseSchema] = useState<{name: string, type: string, required: boolean}[]>([]);
  const [databaseData, setDatabaseData] = useState<any[]>([]);
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showConfigureDialog, setShowConfigureDialog] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [selectedFields, setSelectedFields] = useState<{[key: string]: boolean}>({});
  const [mappedFields, setMappedFields] = useState<{[key: string]: {target: string, enabled: boolean}}>({});
  const [targetSystem, setTargetSystem] = useState<string>("employees");
  const [autosync, setAutosync] = useState<boolean>(false);
  const [syncFrequency, setSyncFrequency] = useState<string>("daily");
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("connection");

  // Systèmes cibles disponibles
  const targetSystems = [
    { id: "employees", name: "Employés" },
    { id: "projects", name: "Projets" },
    { id: "timeEntries", name: "Entrées de temps" },
    { id: "skills", name: "Compétences" },
    { id: "clients", name: "Clients" }
  ];

  // Schémas par défaut pour les différents systèmes cibles
  const targetSchemas: {[key: string]: {name: string, type: string, required: boolean}[]} = {
    "employees": [
      { name: "id", type: "number", required: true },
      { name: "name", type: "string", required: true },
      { name: "email", type: "string", required: true },
      { name: "position", type: "string", required: true },
      { name: "department", type: "string", required: false },
      { name: "location", type: "string", required: false },
      { name: "joinDate", type: "date", required: false },
      { name: "skills", type: "array", required: false },
      { name: "occupancyRate", type: "number", required: false },
    ],
    "projects": [
      { name: "id", type: "number", required: true },
      { name: "name", type: "string", required: true },
      { name: "client", type: "string", required: true },
      { name: "status", type: "string", required: true },
      { name: "category", type: "string", required: false },
      { name: "startDate", type: "date", required: false },
      { name: "endDate", type: "date", required: false },
      { name: "progress", type: "number", required: false },
    ]
  };

  // Simulation de la récupération des bases de données Notion
  const fetchNotionDatabases = () => {
    setIsLoadingDatabases(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      setNotionDatabases([
        { id: "db123456", title: "Employés" },
        { id: "db789012", title: "Projets" },
        { id: "db345678", title: "Clients" },
        { id: "db901234", title: "Compétences" }
      ]);
      setIsLoadingDatabases(false);
    }, 1000);
  };

  // Simulation de la récupération du schéma d'une base de données Notion
  const fetchDatabaseSchema = (dbId: string) => {
    // Simulation d'une requête API
    setTimeout(() => {
      // Différents schémas selon la base de données sélectionnée
      if (dbId === "db123456") {
        // Schéma pour les employés
        setDatabaseSchema([
          { name: "Name", type: "title", required: true },
          { name: "Email", type: "email", required: true },
          { name: "Position", type: "rich_text", required: true },
          { name: "Department", type: "select", required: false },
          { name: "Start Date", type: "date", required: false },
          { name: "Skills", type: "multi_select", required: false },
          { name: "Occupation Rate", type: "number", required: false },
        ]);
      } else if (dbId === "db789012") {
        // Schéma pour les projets
        setDatabaseSchema([
          { name: "Project Name", type: "title", required: true },
          { name: "Client", type: "rich_text", required: true },
          { name: "Status", type: "select", required: true },
          { name: "Category", type: "select", required: false },
          { name: "Start Date", type: "date", required: false },
          { name: "End Date", type: "date", required: false },
          { name: "Progress", type: "number", required: false },
        ]);
      } else {
        // Schéma par défaut
        setDatabaseSchema([
          { name: "Name", type: "title", required: true },
          { name: "Description", type: "rich_text", required: false },
          { name: "Date Created", type: "date", required: false },
        ]);
      }
      
      // Générer des mappages par défaut
      generateDefaultMappings(dbId);
    }, 500);
  };

  // Générer des mappages par défaut entre les champs Notion et le système cible
  const generateDefaultMappings = (dbId: string) => {
    const targetSchema = targetSchemas[targetSystem] || [];
    const newSelectedFields: {[key: string]: boolean} = {};
    const newMappedFields: {[key: string]: {target: string, enabled: boolean}} = {};
    
    // Mappages par défaut pour les employés
    if (dbId === "db123456" && targetSystem === "employees") {
      newSelectedFields["Name"] = true;
      newSelectedFields["Email"] = true;
      newSelectedFields["Position"] = true;
      newSelectedFields["Department"] = true;
      newSelectedFields["Start Date"] = true;
      newSelectedFields["Skills"] = true;
      newSelectedFields["Occupation Rate"] = true;
      
      newMappedFields["Name"] = { target: "name", enabled: true };
      newMappedFields["Email"] = { target: "email", enabled: true };
      newMappedFields["Position"] = { target: "position", enabled: true };
      newMappedFields["Department"] = { target: "department", enabled: true };
      newMappedFields["Start Date"] = { target: "joinDate", enabled: true };
      newMappedFields["Skills"] = { target: "skills", enabled: true };
      newMappedFields["Occupation Rate"] = { target: "occupancyRate", enabled: true };
    } 
    // Mappages par défaut pour les projets
    else if (dbId === "db789012" && targetSystem === "projects") {
      newSelectedFields["Project Name"] = true;
      newSelectedFields["Client"] = true;
      newSelectedFields["Status"] = true;
      newSelectedFields["Category"] = true;
      newSelectedFields["Start Date"] = true;
      newSelectedFields["End Date"] = true;
      newSelectedFields["Progress"] = true;
      
      newMappedFields["Project Name"] = { target: "name", enabled: true };
      newMappedFields["Client"] = { target: "client", enabled: true };
      newMappedFields["Status"] = { target: "status", enabled: true };
      newMappedFields["Category"] = { target: "category", enabled: true };
      newMappedFields["Start Date"] = { target: "startDate", enabled: true };
      newMappedFields["End Date"] = { target: "endDate", enabled: true };
      newMappedFields["Progress"] = { target: "progress", enabled: true };
    }
    // Sinon, tentative de correspondance par nom
    else {
      databaseSchema.forEach(field => {
        const matchingTarget = targetSchema.find(target => 
          target.name.toLowerCase() === field.name.toLowerCase());
        
        if (matchingTarget) {
          newSelectedFields[field.name] = true;
          newMappedFields[field.name] = { 
            target: matchingTarget.name, 
            enabled: true 
          };
        } else {
          newSelectedFields[field.name] = false;
          newMappedFields[field.name] = { 
            target: "", 
            enabled: false 
          };
        }
      });
    }
    
    setSelectedFields(newSelectedFields);
    setMappedFields(newMappedFields);
  };

  // Simulation de la récupération des données d'une base de données Notion
  const fetchDatabaseData = (dbId: string) => {
    setIsLoadingData(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      // Différentes données selon la base de données sélectionnée
      if (dbId === "db123456") {
        // Données pour les employés
        setDatabaseData([
          { 
            id: 1,
            Name: "John Doe", 
            Email: "john.doe@example.com", 
            Position: "Senior Developer", 
            Department: "Engineering", 
            "Start Date": "2021-03-15",
            Skills: ["React", "TypeScript", "Node.js"],
            "Occupation Rate": 85
          },
          { 
            id: 2,
            Name: "Jane Smith", 
            Email: "jane.smith@example.com", 
            Position: "UX Designer", 
            Department: "Design", 
            "Start Date": "2022-01-10",
            Skills: ["UI Design", "Figma", "User Research"],
            "Occupation Rate": 90
          },
          { 
            id: 3,
            Name: "Mike Johnson", 
            Email: "mike.johnson@example.com", 
            Position: "Project Manager", 
            Department: "Product", 
            "Start Date": "2020-06-22",
            Skills: ["Agile", "Scrum", "JIRA"],
            "Occupation Rate": 100
          },
        ]);
      } else if (dbId === "db789012") {
        // Données pour les projets
        setDatabaseData([
          { 
            id: 101,
            "Project Name": "App Redesign", 
            Client: "TechCorp", 
            Status: "ongoing", 
            Category: "Design", 
            "Start Date": "2023-01-15",
            "End Date": "2023-06-30",
            Progress: 65
          },
          { 
            id: 102,
            "Project Name": "CRM Integration", 
            Client: "Finance Solutions", 
            Status: "completed", 
            Category: "Development", 
            "Start Date": "2022-08-01",
            "End Date": "2023-02-28",
            Progress: 100
          },
          { 
            id: 103,
            "Project Name": "Marketing Site", 
            Client: "EcoProducts", 
            Status: "planned", 
            Category: "Web", 
            "Start Date": "2023-04-01",
            "End Date": "2023-07-31",
            Progress: 0
          },
        ]);
      } else {
        // Données par défaut
        setDatabaseData([
          { id: 1, Name: "Item 1", Description: "Description for item 1", "Date Created": "2022-12-01" },
          { id: 2, Name: "Item 2", Description: "Description for item 2", "Date Created": "2023-01-15" },
          { id: 3, Name: "Item 3", Description: "Description for item 3", "Date Created": "2023-02-20" },
        ]);
      }
      
      setIsLoadingData(false);
    }, 1500);
  };

  // Effet pour charger les bases de données Notion lors de la connexion
  useEffect(() => {
    if (isConnected) {
      fetchNotionDatabases();
    }
  }, [isConnected]);

  // Effet pour charger le schéma et les données lorsqu'une base de données est sélectionnée
  useEffect(() => {
    if (selectedDatabase) {
      fetchDatabaseSchema(selectedDatabase);
      fetchDatabaseData(selectedDatabase);
    }
  }, [selectedDatabase]);

  // Effet pour rafraichir les mappages lorsque le système cible change
  useEffect(() => {
    if (selectedDatabase && targetSystem) {
      generateDefaultMappings(selectedDatabase);
    }
  }, [targetSystem]);

  const handleConnect = () => {
    if (!apiKey || !databaseId) {
      toast.error("Veuillez entrer la clé API et l'ID de la base de données");
      return;
    }

    setIsConnecting(true);

    // Simuler le processus de connexion
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast.success("Connexion à Notion réussie", {
        description: "Votre base de données Notion est maintenant intégrée au tableau de bord."
      });
      setCurrentTab("databases");
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey("");
    setDatabaseId("");
    setSelectedDatabase("");
    setDatabaseSchema([]);
    setDatabaseData([]);
    setNotionDatabases([]);
    setCurrentTab("connection");
    toast.info("Déconnecté de Notion");
  };

  const handleDatabaseSelect = (dbId: string) => {
    setSelectedDatabase(dbId);
  };

  const handleSync = () => {
    if (!selectedDatabase) {
      toast.error("Veuillez sélectionner une base de données");
      return;
    }
    
    toast.success("Synchronisation des données depuis Notion...");
    setIsLoadingData(true);
    
    // Simuler la synchronisation
    setTimeout(() => {
      fetchDatabaseData(selectedDatabase);
      setLastSyncTime(new Date().toLocaleString());
      toast.success("Données synchronisées avec succès");
    }, 2000);
  };

  const handleImport = () => {
    if (!selectedDatabase || !targetSystem) {
      toast.error("Veuillez sélectionner une base de données et un système cible");
      return;
    }
    
    // Vérifier les mappages requis
    const requiredTargetFields = targetSchemas[targetSystem]?.filter(f => f.required) || [];
    const mappedRequiredFields = Object.entries(mappedFields)
      .filter(([_, mapping]) => mapping.enabled)
      .map(([_, mapping]) => mapping.target);
    
    const missingRequiredFields = requiredTargetFields.filter(field => 
      !mappedRequiredFields.includes(field.name)
    );
    
    if (missingRequiredFields.length > 0) {
      toast.error(`Champs obligatoires manquants: ${missingRequiredFields.map(f => f.name).join(', ')}`);
      return;
    }
    
    toast.success("Importation des données...");
    
    // Simuler l'importation
    setTimeout(() => {
      toast.success("Données importées avec succès", {
        description: `${databaseData.length} enregistrements ont été importés dans ${targetSystems.find(t => t.id === targetSystem)?.name}.`
      });
      
      // Mettre à jour l'heure de dernière synchronisation
      setLastSyncTime(new Date().toLocaleString());
      
      // Si l'autosync est activé, configurer la prochaine sync
      if (autosync) {
        const nextSyncMessage = syncFrequency === "hourly" 
          ? "Prochaine synchronisation dans 1 heure" 
          : syncFrequency === "daily" 
          ? "Prochaine synchronisation demain à la même heure" 
          : "Prochaine synchronisation dans 1 semaine";
        
        toast.info(nextSyncMessage);
      }
    }, 2500);
  };

  const getHumanReadableType = (type: string) => {
    const typeMap: {[key: string]: string} = {
      "title": "Titre",
      "rich_text": "Texte",
      "number": "Nombre",
      "select": "Sélection unique",
      "multi_select": "Sélection multiple",
      "date": "Date",
      "people": "Personne",
      "files": "Fichiers",
      "checkbox": "Case à cocher",
      "url": "URL",
      "email": "Email",
      "phone_number": "Téléphone",
      "formula": "Formule",
      "relation": "Relation",
      "rollup": "Agrégation",
      "created_time": "Date de création",
      "created_by": "Créé par",
      "last_edited_time": "Date de modification",
      "last_edited_by": "Modifié par",
      "string": "Texte",
      "array": "Liste",
      "boolean": "Oui/Non"
    };
    
    return typeMap[type] || type;
  };

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="connection" className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4" />
          Connexion
        </TabsTrigger>
        <TabsTrigger value="databases" className="flex items-center gap-2" disabled={!isConnected}>
          <Database className="h-4 w-4" />
          Bases de données
        </TabsTrigger>
        <TabsTrigger value="data" className="flex items-center gap-2" disabled={!isConnected || !selectedDatabase}>
          <TableIcon className="h-4 w-4" />
          Données
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="connection" className="transition-all duration-300">
        <Card>
          <CardHeader>
            <CardTitle>Intégration Notion</CardTitle>
            <CardDescription>
              Connectez-vous à Notion pour importer des données d'employés et de projets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="api-key">Clé API Notion</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="secret_xxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Votre clé API est stockée localement et n'est jamais envoyée à nos serveurs
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database-id">ID de base de données (facultatif)</Label>
                  <Input
                    id="database-id"
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={databaseId}
                    onChange={(e) => setDatabaseId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    L'ID de votre base de données Notion (vous pourrez également sélectionner une base de données après la connexion)
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-lg font-medium">Connecté à Notion</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span>API Key: {apiKey.substring(0, 4)}...{apiKey.substring(apiKey.length - 4)}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setCurrentTab("databases")}
                >
                  Voir les bases de données
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!isConnected ? (
              <Button 
                className="w-full" 
                onClick={handleConnect} 
                disabled={!apiKey || isConnecting}
              >
                {isConnecting ? "Connexion en cours..." : "Se connecter à Notion"}
                {!isConnecting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full text-destructive"
                onClick={handleDisconnect}
              >
                Déconnecter
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="databases" className="transition-all duration-300">
        <Card>
          <CardHeader>
            <CardTitle>Bases de données Notion</CardTitle>
            <CardDescription>
              Sélectionnez une base de données pour visualiser et importer des données
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDatabases ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notionDatabases.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notionDatabases.map((db) => (
                    <Card 
                      key={db.id} 
                      className={`cursor-pointer transition-all hover:shadow ${selectedDatabase === db.id ? 'border-primary' : ''}`}
                      onClick={() => handleDatabaseSelect(db.id)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Database className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{db.title}</h3>
                            <p className="text-sm text-muted-foreground">{db.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                        {selectedDatabase === db.id && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedDatabase && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        Base de données sélectionnée: {notionDatabases.find(db => db.id === selectedDatabase)?.title}
                      </h3>
                      <Button 
                        size="sm" 
                        onClick={() => setCurrentTab("data")}
                      >
                        Voir les données
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Structure de la base de données</h4>
                      <div className="space-y-1">
                        {databaseSchema.map((field, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{field.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {getHumanReadableType(field.type)}
                              </Badge>
                            </div>
                            {field.required && (
                              <Badge variant="secondary" className="text-xs">Obligatoire</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Aucune base de données trouvée</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={fetchNotionDatabases}
                >
                  Actualiser
                  <RefreshCw className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchNotionDatabases}
            >
              Actualiser
              <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
            
            {selectedDatabase && (
              <Button 
                size="sm"
                onClick={() => setShowImportOptions(true)}
              >
                Configurer l'importation
                <Settings className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="data" className="transition-all duration-300">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Données Notion</CardTitle>
              <CardDescription>
                {selectedDatabase && 
                  `Affichage des données de ${notionDatabases.find(db => db.id === selectedDatabase)?.title}`}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {lastSyncTime && (
                <p className="text-sm text-muted-foreground">
                  Dernière synchronisation: {lastSyncTime}
                </p>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSync}
                disabled={isLoadingData}
              >
                {isLoadingData ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Synchroniser
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : databaseData.length > 0 ? (
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(databaseData[0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {databaseData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.entries(row).map(([key, value], cellIndex) => (
                          <TableCell key={cellIndex}>
                            {Array.isArray(value) 
                              ? value.join(", ") 
                              : typeof value === "boolean" 
                                ? value ? "Oui" : "Non"
                                : String(value) /* Conversion explicite en chaîne pour résoudre l'erreur */}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {databaseData.length} enregistrements trouvés
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setCurrentTab("databases")}
              >
                <ArrowDown className="h-4 w-4 rotate-90 mr-2" />
                Retour aux bases de données
              </Button>
              
              <Button 
                size="sm"
                onClick={() => setShowImportOptions(true)}
              >
                Importer ces données
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      
      {/* Dialog pour configurer l'importation */}
      <Dialog open={showImportOptions} onOpenChange={setShowImportOptions}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Configuration de l'importation Notion</DialogTitle>
            <DialogDescription>
              Configurez comment les données Notion seront importées dans votre système
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="target-system">Système cible</Label>
              <Select value={targetSystem} onValueChange={setTargetSystem}>
                <SelectTrigger id="target-system" className="w-[180px]">
                  <SelectValue placeholder="Choisir une cible" />
                </SelectTrigger>
                <SelectContent>
                  {targetSystems.map(system => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <h3 className="text-lg font-medium mt-2">Mappage des champs</h3>
            <p className="text-sm text-muted-foreground mt-0">
              Associez les champs Notion à votre système
            </p>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Champ Notion</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Champ cible</TableHead>
                    <TableHead className="w-[100px] text-center">Actif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {databaseSchema.map((field, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {field.name}
                          {field.required && (
                            <Badge variant="secondary" className="text-xs">Obligatoire</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getHumanReadableType(field.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={mappedFields[field.name]?.target || ""} 
                          onValueChange={(value) => {
                            setMappedFields({
                              ...mappedFields,
                              [field.name]: { 
                                target: value, 
                                enabled: value ? true : mappedFields[field.name]?.enabled || false 
                              }
                            });
                          }}
                          disabled={!mappedFields[field.name]?.enabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un champ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Ne pas importer</SelectItem>
                            {targetSchemas[targetSystem]?.map(targetField => (
                              <SelectItem key={targetField.name} value={targetField.name}>
                                {targetField.name} 
                                {targetField.required && "*"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={mappedFields[field.name]?.enabled || false}
                          onCheckedChange={(checked) => {
                            setMappedFields({
                              ...mappedFields,
                              [field.name]: { 
                                target: mappedFields[field.name]?.target || "", 
                                enabled: checked 
                              }
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <h3 className="text-lg font-medium mt-4">Options de synchronisation</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="autosync" 
                  checked={autosync}
                  onCheckedChange={setAutosync}
                />
                <Label htmlFor="autosync">Synchronisation automatique</Label>
              </div>
              
              {autosync && (
                <div className="flex items-center space-x-4 ml-6">
                  <Label htmlFor="sync-frequency">Fréquence:</Label>
                  <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                    <SelectTrigger id="sync-frequency" className="w-[150px]">
                      <SelectValue placeholder="Fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportOptions(false)}>
              Annuler
            </Button>
            <Button onClick={handleImport}>
              Importer les données
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
