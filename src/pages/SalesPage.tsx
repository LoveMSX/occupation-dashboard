
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
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { toast } from "sonner";
import { salesOpportunities, SalesOpportunity } from "@/data/salesData";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const SalesPage = () => {
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
                    Graphique
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
                    Par periode
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
                      <SelectItem value="">Tous statuts</SelectItem>
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
                      <SelectItem value="">Tous commerciaux</SelectItem>
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

              {currentView !== "table" && (
                <Card className="p-4">
                  <CardContent className="pt-4 flex justify-center items-center min-h-[300px]">
                    <div className="text-center text-muted-foreground">
                      <h3 className="text-lg font-medium mb-2">Vue {currentView}</h3>
                      <p>Cette vue est en cours de développement</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {filteredOpportunities.length} opportunités sur {opportunities.length} au total
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Exporter
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
