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
    return null;
 

