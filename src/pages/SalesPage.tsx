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
import { salesApi, employeeApi } from "@/services/api";
import { SalesOperationRequest, SalesOperationResponse } from "@/types/sales";
import { EmployeeData } from "@/types/employee";
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
                    <DropdownMenuItem onClick={() => window.open(opp.url ?? '', '_blank')}>
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
    const columns = [
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
    ] as Array<keyof SalesOperationResponse>;

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

    const filteredOpps = opportunities as SalesOperationResponse[];
    const csvContent = convertToCSV(
      filteredOpps.map(opp => ({
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

  const filteredOpportunities = (opportunities as SalesOperationResponse[]).filter((opp) => {
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
    updateSalesOpMutation.mutate({ id, operation: { statut: newStatus } });
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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold text-destructive">
          Une erreur est survenue lors du chargement des données
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['sales'] })}>
          Réessayer
        </Button>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
                <h1 className="text-2xl font-bold">Opportunités commerciales</h1>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant="primary" 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="md:w-auto w-full"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nouvelle opportunité
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsImportDialogOpen(true)}
                    className="md:w-auto w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importer CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportCSV}
                    className="md:w-auto w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-4 grid-cols-1">
                  <div className="col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par nom, client ou commercial..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {uniqueStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status === "en_cours" 
                              ? "En cours" 
                              : status === "envoye" 
                                ? "Envoyé" 
                                : status === "gagne" 
                                  ? "Gagné" 
                                  : status === "perdu" 
                                    ? "Perdu" 
                                    : status === "en_attente" 
                                      ? "En attente" 
                                      : status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={commercialFilter}
                      onValueChange={setCommercialFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par commercial" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les commerciaux</SelectItem>
                        {uniqueCommercials.map((commercial) => (
                          <SelectItem key={commercial} value={commercial}>
                            {commercial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex space-x-2">
                <Button
                  variant={currentView === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView("table")}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Tableau
                </Button>
                <Button
                  variant={currentView === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView("cards")}
                >
                  <LayoutGridIcon className="h-4 w-4 mr-2" />
                  Cartes
                </Button>
                <Button
                  variant={currentView === "chart" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView("chart")}
                >
                  <BarChart2Icon className="h-4 w-4 mr-2" />
                  Graphiques
                </Button>
              </div>

              {currentView === "table" && (
                <TableView 
                  opportunities={currentItems} 
                  onStatusChange={handleStatusChange} 
                  onDelete={handleDelete}
                />
              )}

              {currentView === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentItems.map((opp) => (
                    <Card key={opp.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="font-semibold">{opp.nom_du_projet}</div>
                          {getStatusBadge(opp.statut)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Client:</span>
                            <span>{opp.client}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{formatDate(opp.date_reception)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">TJM:</span>
                            <span>{opp.tjm} €</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Chiffrage JH:</span>
                            <span>{opp.chiffrage_jh}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Commercial:</span>
                            <span>{opp.commerciale}</span>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {opp.url && (
                                <DropdownMenuItem onClick={() => window.open(opp.url ?? '', '_blank')}>
                                  Voir les documents
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleStatusChange(opp.id, "envoye")}>
                                Marquer comme Envoyé
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(opp.id, "en_cours")}>
                                Marquer comme En cours
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(opp.id, "gagne")}>
                                Marquer comme Gagné
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(opp.id, "perdu")}>
                                Marquer comme Perdu
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(opp.id, "en_attente")}>
                                Marquer comme En attente
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(opp.id)}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {currentView === "chart" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Distribution par statut</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={uniqueStatuses.map(status => ({
                                name: status === "en_cours" 
                                  ? "En cours" 
                                  : status === "envoye" 
                                    ? "Envoyé" 
                                    : status === "gagne" 
                                      ? "Gagné" 
                                      : status === "perdu" 
                                        ? "Perdu" 
                                        : status === "en_attente" 
                                          ? "En attente" 
                                          : status,
                                value: filteredOpportunities.filter(opp => opp.statut === status).length
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                if (percent === 0) return null;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return percent > 0.05 ? (
                                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                  </text>
                                ) : null;
                              }}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {uniqueStatuses.map((status, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={
                                    status === "en_cours" ? "#3B82F6" : 
                                    status === "envoye" ? "#8B5CF6" : 
                                    status === "gagne" ? "#10B981" : 
                                    status === "perdu" ? "#EF4444" : 
                                    status === "en_attente" ? "#F59E0B" : 
                                    "#6B7280"
                                  } 
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">TJM par client</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={Array.from(
                              new Set(filteredOpportunities.map(opp => opp.client))
                            ).map(client => ({
                              name: client,
                              tjm: Math.round(
                                filteredOpportunities
                                  .filter(opp => opp.client === client)
                                  .reduce((acc, opp) => acc + Number(opp.tjm), 0) / 
                                filteredOpportunities.filter(opp => opp.client === client).length
                              )
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="tjm" name="TJM moyen (€)" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {filteredOpportunities.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i} className={currentPage === i + 1 ? "hidden md:inline-block" : "hidden md:inline-block"}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle opportunité</DialogTitle>
                    <DialogDescription>
                      Remplissez les détails de la nouvelle opportunité commerciale
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom_du_projet">Nom du projet*</Label>
                        <Input
                          id="nom_du_projet"
                          value={newOpportunity.nom_du_projet}
                          onChange={(e) => setNewOpportunity({ ...newOpportunity, nom_du_projet: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client">Client*</Label>
                        <Input
                          id="client"
                          value={newOpportunity.client}
                          onChange={(e) => setNewOpportunity({ ...newOpportunity, client: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_reception">Date de réception</Label>
                        <Input
                          id="date_reception"
                          type="date"
                          value={newOpportunity.date_reception}
                          onChange={(e) => setNewOpportunity({ ...newOpportunity, date_reception: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statut">Statut</Label>
                        <Select
                          value={newOpportunity.statut}
                          onValueChange={(value) => setNewOpportunity({ ...newOpportunity, statut: value as SalesOperationRequest["statut"] })}
                        >
                          <SelectTrigger id="statut">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="envoye">Envoyé</SelectItem>
                            <SelectItem value="gagne">Gagné</SelectItem>
                            <SelectItem value="perdu">Perdu</SelectItem>
                            <SelectItem value="en_attente">En attente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tjm">TJM (€)</Label>
                        <Input
                          id="tjm"
                          type="number"
                          value={newOpportunity.tjm}
                          onChange={(e) => setNewOpportunity({ ...newOpportunity, tjm: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chiffrage_jh">Chiffrage (JH)</Label>
                        <Input
                          id="chiffrage_jh"
                          type="number"
                          value={newOpportunity.chiffrage_jh}
                          onChange={(e) => setNewOpportunity({ ...newOpportunity, chiffrage_jh: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commerciale">Commercial</Label>
                        <Select
                          value={newOpportunity.commerciale}
                          onValueChange={(value) => setNewOpportunity({ ...newOpportunity, commerciale: value })}
                        >
                          <SelectTrigger id="commerciale">
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
                      <div className="space-y-2">
                        <Label htmlFor="personne_en_charge_msx">Responsable MSX</Label>
                        <Select
                          value={newOpportunity.personne_en_charge_msx}
                          onValueChange={(value) => setNewOpportunity({ ...newOpportunity, personne_en_charge_msx: value })}
                        >
                          <SelectTrigger id="personne_en_charge_msx">
                            <SelectValue placeholder="Sélectionner un responsable" />
                          </SelectTrigger>
                          <SelectContent>
                            {responsablesMSX.map((resp) => (
                              <SelectItem key={resp} value={resp}>
                                {resp}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type_projet">Type de projet</Label>
                        <Input
                          id="type_projet"
                          value={newOpportunity.type_projet}
                          onChange={(e) => setNewOpportunity({ ...newOpportunity, type_projet: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">URL documents</Label>
                        <Input
                          id="url"
                          value={newOpportunity.url}
                          onChange={(e) => setNewOpportunity({ ...newOpportunity, url: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remarques">Remarques</Label>
                      <Input
                        id="remarques"
                        value={newOpportunity.remarques}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, remarques: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddOpportunity} disabled={addSalesOpMutation.isPending}>
                      {addSalesOpMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Importer des opportunités</DialogTitle>
                    <DialogDescription>
                      Importez des opportunités commerciales à partir d'un fichier CSV
                    </DialogDescription>
                  </DialogHeader>
                  <SalesCSVImportForm onClose={() => setIsImportDialogOpen(false)} />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                      Annuler
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog open={opportunityToDelete !== null} onOpenChange={(open) => {
                if (!open) setOpportunityToDelete(null);
              }}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer cette opportunité ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>
                      {deleteSalesOpMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        "Supprimer"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SalesPage;
