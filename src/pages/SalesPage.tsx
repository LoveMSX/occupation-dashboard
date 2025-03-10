import React, { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  MoreHorizontal,
  PlusIcon,
  TableIcon,
  BarChart2Icon,
  LayoutGridIcon,
  PieChartIcon,
  CalendarDaysIcon,
  LineChart,
  User,
  Download,
  Loader2,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartLineChart,
  Line,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi, employeeApi, SalesOperationRequest, SalesOperationResponse } from "@/services/api";
import { EmployeeData } from "@/components/employees/EmployeeCard";
import { convertToCSV, downloadCSV } from "@/utils/csvExport";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { SalesCSVImportForm } from "@/components/import/SalesCSVImportForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getStatusBadge = (status: string) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "envoye": return "Envoyé";
      case "en_cours": return "En cours";
      case "gagne": return "Gagné";
      case "perdu": return "Perdu";
      case "en_attente": return "En attente";
      default: return status;
    }
  };

  switch (status) {
    case "envoye":
      return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">{getStatusLabel(status)}</Badge>;
    case "en_cours":
      return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">{getStatusLabel(status)}</Badge>;
    case "gagne":
      return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">{getStatusLabel(status)}</Badge>;
    case "perdu":
      return <Badge variant="destructive">{getStatusLabel(status)}</Badge>;
    case "en_attente":
      return <Badge variant="secondary" className="bg-purple-500 hover:bg-purple-600 text-white">{getStatusLabel(status)}</Badge>;
    default:
      return <Badge variant="default">{getStatusLabel(status)}</Badge>;
  }
};

interface TableViewProps {
  opportunities: SalesOperationResponse[];
  onStatusChange: (id: number, status: SalesOperationRequest["statut"]) => void;
  onDelete: (id: number) => void;
}

const TableView: React.FC<TableViewProps> = ({ opportunities, onStatusChange, onDelete }) => (
  <div className="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom du projet</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date réception</TableHead>
          <TableHead>TJM</TableHead>
          <TableHead>Chiffrage JH</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Commercial</TableHead>
          <TableHead>Responsable MSX</TableHead>
          <TableHead>Type projet</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opp) => (
          <TableRow key={opp.id}>
            <TableCell className="font-medium">{opp.nom_du_projet}</TableCell>
            <TableCell>{opp.client}</TableCell>
            <TableCell>{formatDate(opp.date_reception)}</TableCell>
            <TableCell>{opp.tjm} €</TableCell>
            <TableCell>{opp.chiffrage_jh}</TableCell>
            <TableCell>{getStatusBadge(opp.statut)}</TableCell>
            <TableCell>{opp.commerciale}</TableCell>
            <TableCell>{opp.personne_en_charge_msx}</TableCell>
            <TableCell>{opp.type_projet}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {opp.url && (
                    <DropdownMenuItem onClick={() => window.open(opp.url, '_blank')}>
                      Voir les documents
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onStatusChange(opp.id, "envoye")}>
                    Marquer comme Envoyé
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(opp.id, "en_cours")}>
                    Marquer comme En cours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(opp.id, "gagne")}>
                    Marquer comme Gagné
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(opp.id, "perdu")}>
                    Marquer comme Perdu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(opp.id, "en_attente")}>
                    Marquer comme En attente
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onDelete(opp.id)}
                  >
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {opportunities.length === 0 && (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-4">
              Aucune opportunité trouvée
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

const StatusBadgeVariant = {
  "en_cours": "default",
  "envoye": "secondary",
  "gagne": "success",
  "perdu": "destructive",
  "en_attente": "warning"
} as const;

const SalesPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [commercialFilter, setCommercialFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState("table");
  const [newOpportunity, setNewOpportunity] = useState<SalesOperationRequest>({
    nom_du_projet: "",
    client: "",
    date_reception: new Date().toISOString().split("T")[0],
    statut: "en_cours",
    tjm: "0",
    chiffrage_jh: "0",
    commerciale: "",
    personne_en_charge_msx: "",
    type_projet: "",
    remarques: "",
    url: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [opportunityToDelete, setOpportunityToDelete] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: opportunities = [], isLoading: isLoadingOpps, error: oppsError } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAllSalesOperations,
  });

  const addSalesOpMutation = useMutation({
    mutationFn: (operation: SalesOperationRequest) => salesApi.createSalesOperation(operation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Opportunité ajoutée avec succès');
      setIsAddDialogOpen(false);
      resetNewOpportunity();
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error.message}`);
    }
  });

  const updateSalesOpMutation = useMutation({
    mutationFn: ({ id, operation }: { id: number; operation: Partial<SalesOperationRequest> }) => 
      salesApi.updateSalesOperation(id, operation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Opportunité mise à jour avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  });

  const deleteSalesOpMutation = useMutation({
    mutationFn: (id: number) => salesApi.deleteSalesOperation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Opportunité supprimée avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  const resetNewOpportunity = () => {
    setNewOpportunity({
      nom_du_projet: "",
      client: "",
      date_reception: new Date().toISOString().split("T")[0],
      statut: "en_cours",
      tjm: "0",
      chiffrage_jh: "0",
      commerciale: "",
      personne_en_charge_msx: "",
      type_projet: "",
      remarques: "",
      url: "",
    });
  };

  const handleExportCSV = () => {
    const columns: (keyof SalesOperationResponse)[] = [
      'nom_du_projet',
      'client',
      'date_reception',
      'tjm',
      'chiffrage_jh',
      'statut',
      'commerciale',
      'personne_en_charge_msx',
      'type_projet',
      'remarques',
      'url'
    ];

    const columnNames = [
      'Nom du projet',
      'Client',
      'Date de réception',
      'TJM',
      'Chiffrage JH',
      'Statut',
      'Commercial',
      'Responsable MSX',
      'Type de projet',
      'Remarques',
      'URL Documents'
    ];

    const csvContent = convertToCSV(
      filteredOpportunities.map(opp => ({
        ...opp,
        date_reception: formatDate(opp.date_reception)
      })),
      columns,
      columnNames
    );

    const date = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `opportunites-commerciales-${date}.csv`);
    toast.success("Export CSV réalisé avec succès");
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      (opp.nom_du_projet?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (opp.client?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (opp.commerciale?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || opp.statut === statusFilter;
    const matchesCommercial = commercialFilter === "all" || opp.commerciale === commercialFilter;

    return matchesSearch && matchesStatus && matchesCommercial;
  });

  const handleAddOpportunity = () => {
    if (!newOpportunity.nom_du_projet || !newOpportunity.client) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    addSalesOpMutation.mutate(newOpportunity);
  };

  const handleStatusChange = (id: number, newStatus: SalesOperationRequest["statut"]) => {
    updateSalesOperation.mutate({ id, operation: { statut: newStatus } });
  };

  const handleDelete = (opportunityId: number) => {
    setOpportunityToDelete(opportunityId);
  };

  const confirmDelete = () => {
    if (opportunityToDelete) {
      deleteSalesOpMutation.mutate(opportunityToDelete);
      setOpportunityToDelete(null);
    }
  };

  const uniqueStatuses = Array.from(new Set(opportunities.map((opp) => opp.statut)));
  const uniqueCommercials = Array.from(
    new Set(opportunities.map((opp) => opp.commerciale))
  ).filter((commercial) => commercial);

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<EmployeeData[]>({
    queryKey: ['employees'],
    queryFn: employeeApi.getAllEmployees,
  });

  const isLoading = isLoadingOpps || isLoadingEmployees;
  const error = oppsError;

  const responsablesMSX = Array.from(new Set(
    (employees as EmployeeData[]).map(emp => emp.name)
  )).sort();
  
  const commerciaux = Array.from(new Set(
    (employees as EmployeeData[])
      .filter(emp => emp.position === "Commercial" )
      .map(emp => emp.name)
  )).sort();

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="flex h-screen bg-background">
          <div className="w-64 hidden md:block">
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Chargement des opportunités...</span>
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider>
        <div className="flex h-screen bg-background">
          <div className="w-64 hidden md:block">
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500 mb-4">Erreur lors du chargement des opportunités</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['sales'] })}>
                  Réessayer
                </Button>
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const calculateSuccessRate = (opportunities: SalesOperationResponse[]) => {
    const totalOpportunities = opportunities.length;
    if (totalOpportunities === 0) return 0;
    
    const won = opportunities.filter(opp => opp.statut === "gagne").length;
    const lost = opportunities.filter(opp => opp.statut === "perdu").length;
    const pending = opportunities.filter(opp => opp.statut === "en_attente").length;

    return Math.round((won / totalOpportunities) * 100);
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Opportunités commerciales</h1>
                <div className="flex items-center space-x-2">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nouvelle opportunité
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] fixed top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="text-center">
                        <DialogTitle>Ajouter une nouvelle opportunité</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 px-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nom_du_projet" className="text-right">
                            Nom du projet *
                          </Label>
                          <Input
                            id="nom_du_projet"
                            placeholder="Nom du projet"
                            className="col-span-3"
                            value={newOpportunity.nom_du_projet}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              nom_du_projet: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="client" className="text-right">
                            Client *
                          </Label>
                          <Input
                            id="client"
                            placeholder="Nom du client"
                            className="col-span-3"
                            value={newOpportunity.client}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              client: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date_reception" className="text-right">
                            Date de réception
                          </Label>
                          <Input
                            id="date_reception"
                            type="date"
                            className="col-span-3"
                            value={newOpportunity.date_reception}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              date_reception: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="tjm" className="text-right">
                            TJM
                          </Label>
                          <Input
                            id="tjm"
                            type="number"
                            placeholder="TJM"
                            className="col-span-3"
                            value={newOpportunity.tjm}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              tjm: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="chiffrage_jh" className="text-right">
                            Chiffrage JH
                          </Label>
                          <Input
                            id="chiffrage_jh"
                            type="number"
                            step="0.5"
                            placeholder="Chiffrage en jours/homme"
                            className="col-span-3"
                            value={newOpportunity.chiffrage_jh}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              chiffrage_jh: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="commerciale" className="text-right">
                            Commercial
                          </Label>
                          <Select 
                            value={newOpportunity.commerciale} 
                            onValueChange={(value) => setNewOpportunity({
                              ...newOpportunity,
                              commerciale: value
                            })}
                          >
                            <SelectTrigger id="commerciale" className="col-span-3">
                              <SelectValue placeholder="Sélectionner un commercial" />
                            </SelectTrigger>
                            <SelectContent>
                              {commerciaux.map((commercial) => (
                                <SelectItem key={commercial} value={commercial}>
                                  {commercial}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="personne_en_charge_msx" className="text-right">
                            Responsable MSX
                          </Label>
                          <Select 
                            value={newOpportunity.personne_en_charge_msx} 
                            onValueChange={(value) => setNewOpportunity({
                              ...newOpportunity,
                              personne_en_charge_msx: value
                            })}
                          >
                            <SelectTrigger id="personne_en_charge_msx" className="col-span-3">
                              <SelectValue placeholder="Sélectionner un responsable" />
                            </SelectTrigger>
                            <SelectContent>
                              {responsablesMSX.map((responsable) => (
                                <SelectItem key={responsable} value={responsable}>
                                  {responsable}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="type_projet" className="text-right">
                            Type de projet
                          </Label>
                          <Input
                            id="type_projet"
                            placeholder="Type de projet"
                            className="col-span-3"
                            value={newOpportunity.type_projet}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              type_projet: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="remarques" className="text-right">
                            Remarques
                          </Label>
                          <Input
                            id="remarques"
                            placeholder="Remarques additionnelles"
                            className="col-span-3"
                            value={newOpportunity.remarques}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              remarques: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="url" className="text-right">
                            URL Documents
                          </Label>
                          <Input
                            id="url"
                            type="url"
                            placeholder="URL des documents"
                            className="col-span-3"
                            value={newOpportunity.url}
                            onChange={(e) => setNewOpportunity({
                              ...newOpportunity,
                              url: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <DialogFooter className="px-6 pb-6">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddOpportunity}>
                          Ajouter
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] fixed top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <DialogHeader className="text-center">
                        <DialogTitle>Importer des opportunités</DialogTitle>
                        <DialogDescription>
                          Uploadez un fichier CSV pour importer plusieurs opportunités
                        </DialogDescription>
                      </DialogHeader>
                      <SalesCSVImportForm onClose={() => setIsImportDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Opportunités</p>
                        <h3 className="text-2xl font-bold">{filteredOpportunities.length}</h3>
                      </div>
                      <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Taux de Réussite</p>
                        <h3 className="text-2xl font-bold">
                          {calculateSuccessRate(opportunities)}%
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {opportunities.filter(opp => opp.statut === "Gagné").length} / {opportunities.length} opportunités
                        </p>
                      </div>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">TJM Moyen</p>
                        <h3 className="text-2xl font-bold">
                          {Math.round(
                            filteredOpportunities.reduce((sum, opp) => sum + Number(opp.tjm), 0) /
                            filteredOpportunities.length
                          )} €
                        </h3>
                      </div>
                      <BarChart2Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valeur Potentielle</p>
                        <h3 className="text-2xl font-bold">
                          {Math.round(
                            filteredOpportunities.reduce((sum, opp) => 
                              sum + (Number(opp.tjm) * Number(opp.chiffrage_jh)), 0)
                          ).toLocaleString()} €
                        </h3>
                      </div>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={currentView === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("table")}
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    Tableau
                  </Button>
                  <Button
                    variant={currentView === "pie" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("pie")}
                  >
                    <PieChartIcon className="h-4 w-4 mr-2" />
                    Répartition
                  </Button>
                  <Button
                    variant={currentView === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("line")}
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    Évolution
                  </Button>
                  <Button
                    variant={currentView === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("bar")}
                  >
                    <BarChart2Icon className="h-4 w-4 mr-2" />
                    Comparaison
                  </Button>
                </div>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>{statusFilter === "all" ? "Tous statuts" : getStatusBadge(statusFilter)}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusBadge(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={commercialFilter} onValueChange={setCommercialFilter}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{commercialFilter === "all" ? "Tous commerciaux" : commercialFilter}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous commerciaux</SelectItem>
                    {uniqueCommercials.map((commercial) => (
                      <SelectItem key={commercial} value={commercial}>
                        {commercial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chart Data Processing */}
              {(() => {
                // Process data for charts
                const pieData = Array.from(new Set(filteredOpportunities.map(opp => opp.statut)))
                  .map(status => ({
                    name: status,
                    value: filteredOpportunities.filter(opp => opp.statut === status).length,
                  }));

                const barData = Array.from(new Set(filteredOpportunities.map(opp => opp.commerciale)))
                  .filter(commercial => commercial)
                  .map(commercial => ({
                    name: commercial,
                    total: filteredOpportunities.filter(opp => opp.commerciale === commercial).length,
                    gagne: filteredOpportunities.filter(opp => opp.commerciale === commercial && opp.statut === "Gagné").length,
                    perdu: filteredOpportunities.filter(opp => opp.commerciale === commercial && opp.statut === "Perdu").length,
                  }));

                const lineData = (() => {
                  const groupedByMonth: Record<string, number> = {};
                  filteredOpportunities.forEach(opp => {
                    const month = new Date(opp.date_reception).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
                    groupedByMonth[month] = (groupedByMonth[month] || 0) + 1;
                  });
                  return Object.entries(groupedByMonth).map(([name, value]) => ({ name, value }));
                })();

                // Return appropriate view based on currentView
                switch (currentView) {
                  case "table":
                    return (
                      <TableView 
                        opportunities={currentOpportunities}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    );
                    
                  case "pie":
                    return (
                      <Card>
                        <CardContent className="h-[500px] pt-6">
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie
                                data={pieData}
                                nameKey="name"
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                label={({ name, value }) => `${name} (${value})`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={[
                                      "#3B82F6", // blue
                                      "#F97316", // orange
                                      "#10B981", // green
                                      "#EF4444", // red
                                      "#8B5CF6", // purple
                                    ][index % 5]} 
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    );
                    
                  case "line":
                    return (
                      <Card>
                        <CardContent className="h-[500px] pt-6">
                          <ResponsiveContainer>
                            <RechartLineChart data={lineData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                name="Opportunités" 
                                stroke="#3B82F6" 
                                strokeWidth={2}
                              />
                            </RechartLineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    );
                    
                  case "bar":
                    return (
                      <Card>
                        <CardContent className="h-[500px] pt-6">
                          <ResponsiveContainer>
                            <BarChart data={barData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="total" name="Total" fill="#3B82F6" />
                              <Bar dataKey="gagne" name="Gagnés" fill="#10B981" />
                              <Bar dataKey="perdu" name="Perdus" fill="#EF4444" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    );
                    
                  default:
                    return null;
                }
              })()}

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {filteredOpportunities.length} opportunités sur {opportunities.length} au total
                </div>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en CSV
                </Button>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                          return false;
                        })
                        .map((page, i, array) => (
                          <div key={page}>
                            {i > 0 && array[i - 1] !== page - 1 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        ))}

                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SalesPage;
