
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  CalendarIcon,
  ChevronDownIcon,
  Filter,
  MoreHorizontal,
  PlusIcon,
  Search,
  TableIcon,
  BarChart2Icon,
  LayoutGridIcon,
  PieChartIcon,
  CalendarDaysIcon,
  LineChart,
  User,
  FileDown,
  FileCog,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { salesOpportunities, SalesOpportunity } from "@/data/salesData";
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
import { convertToCSV, downloadCSV } from "@/utils/csvExport";
import { useLanguage } from "@/components/LanguageProvider";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const SalesPage = () => {
  const { t } = useLanguage();
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [commercialFilter, setCommercialFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<Partial<SalesOpportunity>>({
    status: "En cours",
    receptionDate: new Date().toISOString().split("T")[0],
  });
  const [currentView, setCurrentView] = useState("table");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SalesOpportunity | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    setOpportunities(salesOpportunities);
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.commercial && opp.commercial.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || opp.status === statusFilter;
    const matchesCommercial = !commercialFilter || opp.commercial === commercialFilter;

    return matchesSearch && matchesStatus && matchesCommercial;
  });

  const uniqueStatuses = Array.from(new Set(opportunities.map((opp) => opp.status)));
  const uniqueCommercials = Array.from(new Set(opportunities.map((opp) => opp.commercial))).filter(
    (commercial) => commercial
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Envoyé":
        return "bg-blue-500 hover:bg-blue-600";
      case "En cours":
        return "bg-amber-500 hover:bg-amber-600";
      case "Gagné":
        return "bg-green-500 hover:bg-green-600";
      case "Perdu":
        return "bg-red-500 hover:bg-red-600";
      case "Attente élément":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    // Using only the supported variants: "default", "destructive", "outline", or "secondary"
    switch (status) {
      case "Envoyé":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">{status}</Badge>;
      case "En cours":
        return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">{status}</Badge>;
      case "Gagné":
        return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">{status}</Badge>;
      case "Perdu":
        return <Badge variant="destructive">{status}</Badge>;
      case "Attente élément":
        return <Badge variant="secondary" className="bg-purple-500 hover:bg-purple-600 text-white">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleAddOpportunity = () => {
    if (!newOpportunity.projectName || !newOpportunity.client) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const newId = Math.max(...opportunities.map((opp) => opp.id)) + 1;
    const completeOpportunity = {
      ...newOpportunity,
      id: newId,
      tjm: newOpportunity.tjm || 0,
      budget: newOpportunity.budget || "",
      status: (newOpportunity.status as SalesOpportunity["status"]) || "En cours",
      commercial: newOpportunity.commercial || "",
    } as SalesOpportunity;

    setOpportunities([completeOpportunity, ...opportunities]);
    setIsAddDialogOpen(false);
    setNewOpportunity({
      status: "En cours",
      receptionDate: new Date().toISOString().split("T")[0],
    });
    toast.success("Opportunité ajoutée avec succès");
  };

  const handleStatusChange = (opportunityId: number, newStatus: SalesOpportunity["status"]) => {
    const updatedOpportunities = opportunities.map((opp) =>
      opp.id === opportunityId ? { ...opp, status: newStatus } : opp
    );
    setOpportunities(updatedOpportunities);
    toast.success(`Statut mis à jour: ${newStatus}`);
  };

  const handleDelete = (opportunityId: number) => {
    const updatedOpportunities = opportunities.filter((opp) => opp.id !== opportunityId);
    setOpportunities(updatedOpportunities);
    toast.success("Opportunité supprimée avec succès");
  };

  const handleSort = (key: keyof SalesOpportunity) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
  };

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    
    if (sortConfig.key === 'receptionDate') {
      const dateA = new Date(a.receptionDate);
      const dateB = new Date(b.receptionDate);
      return sortConfig.direction === 'ascending' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'ascending'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'ascending'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const getSortIndicator = (key: keyof SalesOpportunity) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Fonction d'export CSV
  const handleExportCSV = () => {
    // Définir les colonnes et leurs noms pour l'export
    const columns: (keyof SalesOpportunity)[] = [
      'id', 'projectName', 'client', 'receptionDate', 'tjm', 'budget', 'status', 'commercial'
    ];
    
    const columnNames = [
      'ID', 'Nom du Projet', 'Client', 'Date de Réception', 'TJM', 'Budget', 'Statut', 'Commercial'
    ];
    
    // Convertir les données en CSV
    const csvContent = convertToCSV(
      // Utiliser les données filtrées actuellement affichées
      sortedOpportunities, 
      columns,
      columnNames
    );
    
    // Télécharger le fichier CSV
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(csvContent, `opportunites-commerciales-${date}.csv`);
    
    // Notifier l'utilisateur
    toast.success("Export CSV réalisé avec succès");
  };

  // Data for status chart
  const getStatusChartData = () => {
    const statusCounts: Record<string, number> = {};
    
    opportunities.forEach(opportunity => {
      statusCounts[opportunity.status] = (statusCounts[opportunity.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  // Data for commercial chart
  const getCommercialChartData = () => {
    const commercialCounts: Record<string, number> = {};
    
    opportunities.forEach(opportunity => {
      if (opportunity.commercial) {
        commercialCounts[opportunity.commercial] = (commercialCounts[opportunity.commercial] || 0) + 1;
      }
    });
    
    return Object.entries(commercialCounts)
      .filter(([name]) => name) // Filter out empty commercial names
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  };

  // Data for timeline chart
  const getTimelineChartData = () => {
    const timeData: Record<string, number> = {};
    
    // Initialize last 12 months
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${d.toLocaleString('fr-FR', { month: 'short' })} ${d.getFullYear()}`;
      timeData[monthYear] = 0;
    }
    
    // Count opportunities by reception date
    opportunities.forEach(opportunity => {
      const date = new Date(opportunity.receptionDate);
      const monthYear = `${date.toLocaleString('fr-FR', { month: 'short' })} ${date.getFullYear()}`;
      
      // Only count if it's in our time range
      if (timeData[monthYear] !== undefined) {
        timeData[monthYear]++;
      }
    });
    
    return Object.entries(timeData).map(([name, value]) => ({ name, value }));
  };

  // Budget size chart
  const getBudgetSizeChartData = () => {
    // Group budgets into size categories
    const categories = {
      "< 10 JH": 0,
      "10-50 JH": 0,
      "50-100 JH": 0,
      "100-200 JH": 0,
      "> 200 JH": 0,
      "Autres": 0
    };
    
    opportunities.forEach(opportunity => {
      if (typeof opportunity.budget === 'number') {
        if (opportunity.budget < 10) {
          categories["< 10 JH"]++;
        } else if (opportunity.budget >= 10 && opportunity.budget < 50) {
          categories["10-50 JH"]++;
        } else if (opportunity.budget >= 50 && opportunity.budget < 100) {
          categories["50-100 JH"]++;
        } else if (opportunity.budget >= 100 && opportunity.budget < 200) {
          categories["100-200 JH"]++;
        } else if (opportunity.budget >= 200) {
          categories["> 200 JH"]++;
        }
      } else {
        categories["Autres"]++;
      }
    });
    
    return Object.entries(categories)
      .filter(([, value]) => value > 0) // Only show categories with data
      .map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Avant vente - AVV Data</h1>
                  <p className="text-muted-foreground">
                    Gestion des opportunités commerciales
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={currentView === "table" ? "bg-accent" : ""}
                    onClick={() => setCurrentView("table")}
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={currentView === "chart" ? "bg-accent" : ""}
                    onClick={() => setCurrentView("chart")}
                  >
                    <BarChart2Icon className="h-4 w-4 mr-2" />
                    Par commercial
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={currentView === "cards" ? "bg-accent" : ""}
                    onClick={() => setCurrentView("cards")}
                  >
                    <LayoutGridIcon className="h-4 w-4 mr-2" />
                    Cartes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={currentView === "status" ? "bg-accent" : ""}
                    onClick={() => setCurrentView("status")}
                  >
                    <PieChartIcon className="h-4 w-4 mr-2" />
                    Par statut
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={currentView === "period" ? "bg-accent" : ""}
                    onClick={() => setCurrentView("period")}
                  >
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    Chronologie
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={currentView === "budget" ? "bg-accent" : ""}
                    onClick={() => setCurrentView("budget")}
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    Budget
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher par projet, client ou commercial..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter || ""} onValueChange={(val) => setStatusFilter(val || null)}>
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>{statusFilter || "Tous statuts"}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={commercialFilter || ""}
                    onValueChange={(val) => setCommercialFilter(val || null)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>
                          {commercialFilter
                            ? `Commercial: ${commercialFilter}`
                            : "Tous commerciaux"}
                        </span>
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

                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nouveau
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle opportunité</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="projectName" className="text-right">
                            Projet *
                          </Label>
                          <Input
                            id="projectName"
                            placeholder="Nom du projet"
                            className="col-span-3"
                            value={newOpportunity.projectName || ""}
                            onChange={(e) =>
                              setNewOpportunity({ ...newOpportunity, projectName: e.target.value })
                            }
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
                            value={newOpportunity.client || ""}
                            onChange={(e) =>
                              setNewOpportunity({ ...newOpportunity, client: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="receptionDate" className="text-right">
                            Date de réception
                          </Label>
                          <Input
                            id="receptionDate"
                            type="date"
                            className="col-span-3"
                            value={newOpportunity.receptionDate || ""}
                            onChange={(e) =>
                              setNewOpportunity({ ...newOpportunity, receptionDate: e.target.value })
                            }
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
                            value={newOpportunity.tjm || ""}
                            onChange={(e) =>
                              setNewOpportunity({
                                ...newOpportunity,
                                tjm: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="budget" className="text-right">
                            Budget
                          </Label>
                          <Input
                            id="budget"
                            placeholder="Budget"
                            className="col-span-3"
                            value={newOpportunity.budget || ""}
                            onChange={(e) =>
                              setNewOpportunity({ ...newOpportunity, budget: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">
                            Statut
                          </Label>
                          <Select
                            value={newOpportunity.status as string}
                            onValueChange={(val) =>
                              setNewOpportunity({
                                ...newOpportunity,
                                status: val as SalesOpportunity["status"],
                              })
                            }
                          >
                            <SelectTrigger id="status" className="col-span-3">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="En cours">En cours</SelectItem>
                              <SelectItem value="Envoyé">Envoyé</SelectItem>
                              <SelectItem value="Gagné">Gagné</SelectItem>
                              <SelectItem value="Perdu">Perdu</SelectItem>
                              <SelectItem value="Attente élément">Attente élément</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="commercial" className="text-right">
                            Commercial
                          </Label>
                          <Input
                            id="commercial"
                            placeholder="Commercial"
                            className="col-span-3"
                            value={newOpportunity.commercial || ""}
                            onChange={(e) =>
                              setNewOpportunity({ ...newOpportunity, commercial: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddOpportunity}>
                          Ajouter
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {currentView === "table" && (
                <div className="border rounded-md shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('projectName')}
                          >
                            Nom du projet {getSortIndicator('projectName')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('client')}
                          >
                            Client {getSortIndicator('client')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('receptionDate')}
                          >
                            Date Réception {getSortIndicator('receptionDate')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('tjm')}
                          >
                            TJM {getSortIndicator('tjm')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('budget')}
                          >
                            Chiffrage JH {getSortIndicator('budget')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('status')}
                          >
                            Statut {getSortIndicator('status')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('commercial')}
                          >
                            Commercial {getSortIndicator('commercial')}
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedOpportunities.length > 0 ? (
                          sortedOpportunities.map((opportunity) => (
                            <TableRow key={opportunity.id}>
                              <TableCell className="font-medium">
                                {opportunity.projectName}
                              </TableCell>
                              <TableCell>{opportunity.client}</TableCell>
                              <TableCell>{formatDate(opportunity.receptionDate)}</TableCell>
                              <TableCell>{opportunity.tjm}</TableCell>
                              <TableCell>{opportunity.budget}</TableCell>
                              <TableCell>{getStatusBadge(opportunity.status)}</TableCell>
                              <TableCell>{opportunity.commercial}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => console.log("Edit", opportunity.id)}>
                                      Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(opportunity.id, "Envoyé")}
                                    >
                                      Marquer comme Envoyé
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(opportunity.id, "En cours")}
                                    >
                                      Marquer comme En cours
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(opportunity.id, "Gagné")}
                                    >
                                      Marquer comme Gagné
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(opportunity.id, "Perdu")}
                                    >
                                      Marquer comme Perdu
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleStatusChange(opportunity.id, "Attente élément")}
                                    >
                                      Marquer comme En attente
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDelete(opportunity.id)}
                                    >
                                      Supprimer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              Aucune opportunité trouvée
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {currentView === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedOpportunities.length > 0 ? (
                    sortedOpportunities.map((opportunity) => (
                      <Card key={opportunity.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle>{opportunity.projectName}</CardTitle>
                          <CardDescription>{opportunity.client}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Date réception:</span>
                            <span>{formatDate(opportunity.receptionDate)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">TJM:</span>
                            <span>{opportunity.tjm || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Budget:</span>
                            <span>{opportunity.budget || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Statut:</span>
                            {getStatusBadge(opportunity.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Commercial:</span>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{opportunity.commercial || "Non assigné"}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("Edit", opportunity.id)}>
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(opportunity.id, "Gagné")}
                              >
                                Marquer comme Gagné
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(opportunity.id, "Perdu")}
                              >
                                Marquer comme Perdu
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(opportunity.id)}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-lg font-medium">Aucune opportunité trouvée</p>
                      <p className="text-muted-foreground">
                        Essayez d'ajuster votre recherche ou vos filtres
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentView === "status" && (
                <Card className="p-4">
                  <CardContent className="pt-4">
                    <h2 className="text-xl font-bold mb-4">Répartition par statut</h2>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getStatusChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={140}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {getStatusChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} opportunités`, 'Nombre']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentView === "chart" && (
                <Card className="p-4">
                  <CardContent className="pt-4">
                    <h2 className="text-xl font-bold mb-4">Opportunités par commercial</h2>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getCommercialChartData()}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip formatter={(value) => [`${value} opportunités`, 'Nombre']} />
                          <Legend />
                          <Bar dataKey="value" name="Nombre d'opportunités" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentView === "period" && (
                <Card className="p-4">
                  <CardContent className="pt-4">
                    <h2 className="text-xl font-bold mb-4">Évolution des opportunités</h2>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartLineChart
                          data={getTimelineChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} opportunités`, 'Nombre']} />
                          <Legend />
                          <Line type="monotone" dataKey="value" name="Nombre d'opportunités" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </RechartLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentView === "budget" && (
                <Card className="p-4">
                  <CardContent className="pt-4">
                    <h2 className="text-xl font-bold mb-4">Répartition par taille de budget</h2>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getBudgetSizeChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} opportunités`, 'Nombre']} />
                          <Legend />
                          <Bar dataKey="value" name="Nombre d'opportunités" fill="#FF8042" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {filteredOpportunities.length} opportunités sur {opportunities.length} au total
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportCSV}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter en CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    Imprimer
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SalesPage;
