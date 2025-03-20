import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "@/services/api";
import { gsheetApi } from "@/services/api/gsheetApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  MoreHorizontal,
  PlusIcon,
  Download,
  LayoutGrid,
  TableIcon,
  BarChart2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { GSheetSync } from "@/components/import/GSheetSync";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users,
  BarChart as ChartIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { toast } from "sonner";

type ViewMode = "table" | "grid" | "chart";

const ITEMS_PER_PAGE = 10;

// Définition des couleurs par statut
const STATUS_COLORS = {
  envoye: "#3B82F6",     // bleu
  en_cours: "#F97316",   // orange
  gagne: "#10B981",      // vert
  perdu: "#EF4444",      // rouge
  en_attente: "#8B5CF6"  // violet
};

// Constantes pour les statuts (en majuscules, sans accents)
const STATUTS = {
  ENVOYE: 'ENVOYE',
  EN_COURS: 'EN_COURS',
  GAGNE: 'GAGNE',
  PERDU: 'PERDU',
  EN_ATTENTE: 'EN_ATTENTE'
} as const;

// Fonction pour normaliser le texte (majuscules, sans accents)
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
};

// Fonction pour calculer les statistiques avec normalisation
const calculateStats = (opportunities: any[]) => {
  const total = opportunities.length;
  
  // Calcul du montant total des opportunités gagnées uniquement
  const totalAmount = opportunities
    .filter(opp => normalizeText(opp.statut) === STATUTS.GAGNE)
    .reduce((sum, opp) => sum + (parseFloat(opp.montant) || (opp.tjm * opp.chiffrage_jh) || 0), 0);
  
  // Calcul du taux de conversion
  const wonOpportunities = opportunities.filter(opp => 
    normalizeText(opp.statut) === STATUTS.GAGNE
  ).length;
  
  const closedOpportunities = opportunities.filter(opp => 
    [STATUTS.GAGNE, STATUTS.PERDU].includes(normalizeText(opp.statut) as typeof STATUTS.GAGNE | typeof STATUTS.PERDU)
  ).length;
  
  const conversionRate = closedOpportunities > 0 ? (wonOpportunities / closedOpportunities) * 100 : 0;
  
  const averageAmount = wonOpportunities > 0 ? totalAmount / wonOpportunities : 0;
  
  return {
    total,
    totalAmount,
    conversionRate,
    averageAmount,
    wonOpportunities
  };
};

// Fonction pour formater les montants
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const statusConfig = {
  [STATUTS.ENVOYE]: { 
    label: "Envoyé"
  },
  [STATUTS.EN_COURS]: { 
    label: "En cours"
  },
  [STATUTS.GAGNE]: { 
    label: "Gagné"
  },
  [STATUTS.PERDU]: { 
    label: "Perdu"
  },
  [STATUTS.EN_ATTENTE]: { 
    label: "En attente"
  }
} as const;

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const queryClient = useQueryClient();

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAllSalesOperations
  });

  const handleGSheetSync = async (spreadsheetId: string) => {
    try {
      const result = await gsheetApi.syncSales(spreadsheetId);
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ['sales'] });
        toast.success('Synchronisation des ventes réussie');
      }
    } catch (error) {
      window.console.error('Sales sync error:', error);
      toast.error('Erreur lors de la synchronisation des ventes');
      throw error;
    }
  };

  // Filtrer les opportunités en fonction du terme de recherche
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => 
      opp.nom_du_projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.client.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [opportunities, searchTerm]);

  const stats = useMemo(() => {
    if (!opportunities.length) return null;

    const total = opportunities.length;
    
    // Calcul du montant total pour toutes les opportunités
    const totalAmount = opportunities
      .reduce((sum, opp) => {
        const amount = Number(opp.tjm || 0) * Number(opp.chiffrage_jh || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
    
    // Calcul du taux de conversion
    const wonOpportunities = opportunities.filter(opp => 
      normalizeText(opp.statut) === STATUTS.GAGNE
    ).length;
    
    const closedOpportunities = opportunities.filter(opp => 
      [STATUTS.GAGNE, STATUTS.PERDU].includes(normalizeText(opp.statut) as typeof STATUTS.GAGNE | typeof STATUTS.PERDU)
    ).length;
    
    const conversionRate = closedOpportunities > 0 ? (wonOpportunities / closedOpportunities) * 100 : 0;
    
    // Calcul du TJM moyen - moyenne simple des TJM
    const validTJMs = opportunities
      .map(opp => Number(opp.tjm))
      .filter(tjm => !isNaN(tjm) && tjm > 0);
      
    const averageTJM = validTJMs.length > 0
      ? validTJMs.reduce((sum, tjm) => sum + tjm, 0) / validTJMs.length
      : 0;

    // Calcul de la variation par rapport au mois précédent
    const previousMonthTotal = opportunities
      .filter(opp => {
        const date = new Date(opp.date_reception);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return date.getMonth() === lastMonth.getMonth();
      }).length;
    
    const monthlyTrend = previousMonthTotal ? ((total - previousMonthTotal) / previousMonthTotal) * 100 : 0;

    return {
      total,
      totalAmount,
      conversionRate,
      averageTJM,
      wonOpportunities,
      monthlyTrend
    };
  }, [opportunities]);

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOpportunities = filteredOpportunities.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Données pour le graphique de statut
  const statusData = useMemo(() => {
    const statusCounts = opportunities.reduce((acc: { [key: string]: number }, opp) => {
      const normalizedStatus = normalizeText(opp.statut);
      acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: statusConfig[status as keyof typeof statusConfig]?.label || status,
      value: count,
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#CBD5E1'
    }));
  }, [opportunities]);

  interface MonthlyData {
    name: string;
    total: number;
    montant: number;
    gagne: number;
  }

  // Données pour le graphique d'évolution
  const evolutionData = useMemo(() => {
    return opportunities
      .sort((a, b) => new Date(a.date_reception).getTime() - new Date(b.date_reception).getTime())
      .reduce<MonthlyData[]>((acc, opp) => {
        const month = new Date(opp.date_reception).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
        const existingMonth = acc.find(item => item.name === month);
        if (existingMonth) {
          existingMonth.total += 1;
          existingMonth.montant += (opp.tjm * opp.chiffrage_jh) || 0;
          if (opp.statut === 'gagne') existingMonth.gagne += 1;
        } else {
          acc.push({ 
            name: month, 
            total: 1, 
            montant: (opp.tjm * opp.chiffrage_jh) || 0,
            gagne: opp.statut === 'gagne' ? 1 : 0
          });
        }
        return acc;
      }, []);
  }, [opportunities]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* En-tête et actions */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Opportunités commerciales</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <GSheetSync pageId="sales" onSync={handleGSheetSync} />
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Nouvelle opportunité
              </Button>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="p-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Total Opportunités"
                  value={stats.total.toString()}
                  percentageChange={stats.monthlyTrend}
                  icon={Target}
                  variant="primary"
                  description="vs mois dernier"
                />
                <StatCard
                  title="Opportunités Gagnées"
                  value={stats.wonOpportunities.toString()}
                  percentageChange={stats.conversionRate}
                  icon={TrendingUp}
                  variant="success"
                  description="taux de conversion"
                />
                <StatCard
                  title="Montant Total"
                  value={formatAmount(stats.totalAmount)}
                  icon={DollarSign}
                  variant="info"
                />
                <StatCard
                  title="TJM Moyen"
                  value={formatAmount(stats.averageTJM)}
                  icon={ChartIcon}
                  variant="warning"
                />
              </div>
            )}
          </div>
          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("chart")}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Vue tableau */}
          {viewMode === "table" && (
            <>
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
                    {paginatedOpportunities.map((opp) => (
                      <TableRow key={opp.id}>
                        <TableCell className="font-medium">{opp.nom_du_projet}</TableCell>
                        <TableCell>{opp.client}</TableCell>
                        <TableCell>{formatDate(opp.date_reception)}</TableCell>
                        <TableCell>{opp.tjm} €</TableCell>
                        <TableCell>{opp.chiffrage_jh}</TableCell>
                        <TableCell>{getStatusBadge(opp.statut)}</TableCell>
                        <TableCell>{opp.commercial}</TableCell>
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
                              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Vue grille */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedOpportunities.map((opp) => (
                <Card key={opp.id}>
                  <CardHeader>
                    <CardTitle>{opp.nom_du_projet}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span>{opp.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TJM:</span>
                        <span>{opp.tjm} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Statut:</span>
                        <span>{getStatusBadge(opp.statut)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Vue graphique */}
          {viewMode === "chart" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution par statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
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
                <CardHeader>
                  <CardTitle>Évolution des opportunités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={evolutionData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'montant') return [formatAmount(Number(value)), 'Montant'];
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="total"
                          name="Nombre d'opportunités"
                          stroke={STATUS_COLORS.en_cours}
                          strokeWidth={2}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="montant"
                          name="Montant"
                          stroke={STATUS_COLORS.gagne}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getStatusBadge = (status: string) => {
  const normalizedStatus = normalizeText(status);
  
  const statusConfig = {
    [STATUTS.ENVOYE]: { 
      label: "Envoyé", 
      className: `bg-blue-500 hover:bg-blue-600`
    },
    [STATUTS.EN_COURS]: { 
      label: "En cours", 
      className: `bg-orange-500 hover:bg-orange-600`
    },
    [STATUTS.GAGNE]: { 
      label: "Gagné", 
      className: `bg-green-500 hover:bg-green-600`
    },
    [STATUTS.PERDU]: { 
      label: "Perdu", 
      className: `bg-red-500 hover:bg-red-600`
    },
    [STATUTS.EN_ATTENTE]: { 
      label: "En attente", 
      className: `bg-purple-500 hover:bg-purple-600`
    }
  };

  const config = statusConfig[normalizedStatus as keyof typeof statusConfig] || { 
    label: status,
    className: "bg-gray-500 hover:bg-gray-600"
  };

  return (
    <Badge variant="secondary" className={`${config.className} text-white`}>
      {config.label}
    </Badge>
  );
};

export default SalesPage;
