
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { occupationApi } from '@/api/occupation';
import { GSheetSync } from "@/components/import/GSheetSync";
import { gsheetApi } from "@/services/api/gsheetApi";
import { useLanguage } from "@/components/LanguageProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Download, Filter, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Users, 
  Briefcase, 
  Target, 
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

const WORKING_DAYS = {
  0: 22, // Jan
  1: 20, // Feb
  2: 23, // Mar
  3: 21, // Apr
  4: 22, // May
  5: 21, // Jun
  6: 22, // Jul
  7: 21, // Aug
  8: 22, // Sep
  9: 23, // Oct
  10: 21, // Nov
  11: 20, // Dec
};

export default function OccupancyAnalytics() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [view, setView] = useState("chart");
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

  const handleGSheetSync = async (spreadsheetId: string) => {
    try {
      const result = await gsheetApi.syncOccupation(spreadsheetId);
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ['occupation'] });
        toast.success('Synchronisation des occupations réussie');
      }
    } catch (error) {
      window.console.error('Occupation sync error:', error);
      toast.error('Erreur lors de la synchronisation des occupations');
      throw error;
    }
  };

  const { data: occupationData, isLoading, isError } = useQuery({
    queryKey: ['occupation'],
    queryFn: occupationApi.getAllOccupation
  });

  // Calculer les données mensuelles
  const monthlyData = useMemo(() => {
    if (!occupationData) return [];

    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => {
      const monthData = occupationData.filter(data => {
        const dataMonth = new Date(data.date).getMonth();
        return dataMonth === index;
      });

      const employeeCount = new Set(monthData.map(d => d.employee_id)).size;
      const avgOccupancy = monthData.reduce((sum, d) => sum + d.occupancyRate, 0) / (monthData.length || 1);
      const avgUtilization = monthData.reduce((sum, d) => sum + d.utilizationRate, 0) / (monthData.length || 1);

      return {
        name: month.substring(0, 3),
        occupancy: Math.round(avgOccupancy),
        utilization: Math.round(avgUtilization),
        target: 85,
        employeeCount
      };
    });
  }, [occupationData]);

  const stats = useMemo(() => {
    if (!monthlyData.length) return null;
    
    const currentOccupancy = monthlyData[monthlyData.length - 1].occupancy;
    const previousOccupancy = monthlyData[monthlyData.length - 2]?.occupancy || 0;
    const trend = currentOccupancy - previousOccupancy;
    
    // Calcul des employés en sous-occupation et surcharge
    const currentMonth = monthlyData[monthlyData.length - 1];
    const underutilized = currentMonth.employeeCount * (currentMonth.occupancy < 70 ? 1 : 0);
    const overutilized = currentMonth.employeeCount * (currentMonth.occupancy > 100 ? 1 : 0);
    
    // Calcul des heures facturables (exemple)
    const workingHoursPerDay = 8;
    const billableHours = Math.round(currentMonth.occupancy * currentMonth.employeeCount * workingHoursPerDay);
    const targetHours = currentMonth.employeeCount * workingHoursPerDay * WORKING_DAYS[new Date().getMonth()];
    const billableChange = Math.round((billableHours / targetHours * 100) - 100);
    
    return {
      current: currentOccupancy,
      trend,
      average: Math.round(monthlyData.reduce((acc, curr) => acc + curr.occupancy, 0) / monthlyData.length),
      highest: Math.max(...monthlyData.map(d => d.occupancy)),
      lowest: Math.min(...monthlyData.map(d => d.occupancy)),
      underutilized,
      overutilized,
      billableHours,
      billableChange
    };
  }, [monthlyData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement des données.
          Veuillez réessayer ultérieurement.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* En-tête et actions */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Analyse des taux d'occupation</h1>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <GSheetSync 
                pageId="occupation" 
                onSync={handleGSheetSync} 
              />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Taux moyen d'occupation"
                value={`${stats.average}%`}
                percentageChange={stats.trend}
                icon={Target}
                variant="primary"
                description="vs mois dernier"
              />
              <StatCard
                title="Employés en sous-occupation"
                value={stats.underutilized.toString()}
                icon={AlertCircle}
                variant="warning"
              />
              <StatCard
                title="Employés en surcharge"
                value={stats.overutilized.toString()}
                icon={TrendingUp}
                variant="danger"
              />
              <StatCard
                title="Heures facturables"
                value={`${stats.billableHours}h`}
                percentageChange={stats.billableChange}
                icon={Clock}
                variant="success"
                description="vs objectif"
              />
            </div>
          )}

          <Tabs value={view} onValueChange={setView} className="space-y-4">
            <TabsList>
              <TabsTrigger value="chart">Graphique</TabsTrigger>
              <TabsTrigger value="table">Tableau</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du taux d'occupation</CardTitle>
                  <CardDescription>
                    Taux d'occupation et d'utilisation mensuels avec objectif
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tickFormatter={(value, index) => `${value} (${monthlyData[index].employeeCount} emp.)`}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === "Occupation (%)") {
                            return [`${value}% (${props.payload.employeeCount} employés)`];
                          }
                          return [`${value}%`];
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="occupancy" 
                        name="Occupation (%)" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="utilization" 
                        name="Utilisation (%)" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                      />
                      <ReferenceLine 
                        y={85} 
                        label="Objectif" 
                        stroke="#ff7300" 
                        strokeDasharray="3 3"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition mensuelle</CardTitle>
                  <CardDescription>
                    Distribution des taux d'occupation par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="occupancy" name="Occupation (%)" fill="#8884d8" />
                      <Bar dataKey="utilization" name="Utilisation (%)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Détails mensuels</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Ajoutez ici votre tableau de données */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
