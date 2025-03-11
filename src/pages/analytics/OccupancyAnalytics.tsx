import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/components/LanguageProvider";
import { employeeApi } from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const WORKING_DAYS = {
  january: 22,
  february: 20,
  march: 23,
  april: 21,
  may: 22,
  june: 21,
  july: 22,
  august: 21,
  september: 22,
  october: 23,
  november: 21,
  december: 20,
};

const OccupancyAnalytics = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { 
    data: employeesOccupationData, 
    isLoading: isLoadingOccupation, 
    error: occupationError,
    refetch: refetchOccupation
  } = useQuery({
    queryKey: ['employees-occupation'],
    queryFn: async () => {
      const data = await employeeApi.getAllEmployeesOccupation();
      console.log('Occupation Data in component:', data); // Debug log
      return data;
    },
    retry: 1
  });

  const { 
    data: employees, 
    isLoading: isLoadingEmployees, 
    error: employeesError,
    refetch: refetchEmployees
  } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const data = await employeeApi.getAllEmployees();
      console.log('Employees Data in component:', data); // Debug log
      return data;
    },
    retry: 1
  });

  // Si les données sont vides mais qu'il n'y a pas d'erreur
  if ((!employees || employees.length === 0) && !isLoadingEmployees && !employeesError) {
    console.warn('No employees data available');
  }

  if ((!employeesOccupationData || employeesOccupationData.length === 0) && !isLoadingOccupation && !occupationError) {
    console.warn('No occupation data available');
  }

  // Log pour déboguer
  console.log('Occupation Data:', employeesOccupationData);
  console.log('Employees:', employees);
  console.log('Loading states:', { isLoadingOccupation, isLoadingEmployees });
  console.log('Errors:', { occupationError, employeesError });

  // Si une des requêtes est en cours de chargement
  if (isLoadingOccupation || isLoadingEmployees) {
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
                <span className="ml-2">{t('loading')}</span>
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Si une des requêtes a échoué
  if (occupationError || employeesError) {
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
                <p className="text-red-500 mb-4">{t('error.loading.data')}</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      refetchOccupation();
                      refetchEmployees();
                    }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t('retry')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      queryClient.invalidateQueries({ queryKey: ['employees-occupation'] });
                      queryClient.invalidateQueries({ queryKey: ['employees'] });
                    }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    {t('refresh.data')}
                  </Button>
                </div>
                {(occupationError || employeesError) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {(occupationError as Error)?.message || (employeesError as Error)?.message}
                  </p>
                )}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Si les données ne sont pas disponibles
  if (!employees || !employeesOccupationData) {
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
                {t('no.data.available')}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Fonction helper pour calculer le total d'un mois pour un employé
  const calculateMonthTotal = (employeeId: number, month: keyof typeof WORKING_DAYS) => {
    return employeesOccupationData
      ?.filter(o => o.employee_id === employeeId)
      .reduce((sum, o) => sum + (Number(o[month]) || 0), 0) || 0;
  };

  // Fonction pour calculer le taux d'occupation d'un employé
  const calculateTotalOccupancyRate = (employeeId: number) => {
    if (!employeesOccupationData) return 0;

    // Calculer le total des jours alloués pour chaque mois
    const monthlyTotals = Object.keys(WORKING_DAYS).reduce((acc, month) => {
      const monthlyAllocation = employeesOccupationData
        .filter(o => o.employee_id === employeeId)
        .reduce((sum, o) => sum + (Number(o[month]) || 0), 0);
      
      // Vérifier si l'allocation mensuelle dépasse les jours ouvrables
      const workingDays = WORKING_DAYS[month as keyof typeof WORKING_DAYS];
      acc += Math.min(monthlyAllocation, workingDays);
      return acc;
    }, 0);

    // Calculer le total des jours ouvrables sur l'année
    const totalWorkingDays = Object.values(WORKING_DAYS).reduce((sum, days) => sum + days, 0);
    
    // Calculer et retourner le taux d'occupation
    return Math.round((monthlyTotals / totalWorkingDays) * 100);
  };

  // Calculer le taux d'occupation pour chaque employé
  const employeesWithOccupancy = employees?.map(emp => ({
    ...emp,
    occupancyRate: calculateTotalOccupancyRate(emp.id)
  })) || [];

  // Séparer les employés en deux groupes selon leur taux d'occupation
  const lowOccupancyEmployees = employeesWithOccupancy.filter(emp => emp.occupancyRate < 85);
  const normalOccupancyEmployees = employeesWithOccupancy.filter(emp => emp.occupancyRate >= 85);

  // Données pour le graphique en camembert
  const pieData = [
    {
      name: t('low.occupancy'),
      value: lowOccupancyEmployees.length,
      color: '#EF4444'
    },
    {
      name: t('normal.occupancy'),
      value: normalOccupancyEmployees.length,
      color: '#10B981'
    }
  ];

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Table des employés à faible taux d'occupation */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('low.occupancy.employees')}</CardTitle>
                  <CardDescription>
                    {t('employees.below.25')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('employee')}</TableHead>
                        <TableHead>{t('position')}</TableHead>
                        <TableHead className="text-right">{t('occupancy.rate')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowOccupancyEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell className="text-right text-red-500">
                            {employee.occupancyRate}%
                          </TableCell>
                        </TableRow>
                      ))}
                      {lowOccupancyEmployees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            {t('no.low.occupancy.employees')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Graphique de comparaison */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('occupancy.distribution')}</CardTitle>
                  <CardDescription>
                    {t('occupancy.comparison')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
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
            </div>

            {/* Statistiques détaillées */}
            <Card>
              <CardHeader>
                <CardTitle>{t('occupancy.statistics')}</CardTitle>
                <CardDescription>
                  {t('detailed.statistics')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t('total.employees')}
                    </h3>
                    <p className="text-2xl font-bold">
                      {employeesWithOccupancy.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t('low.occupancy.count')}
                    </h3>
                    <p className="text-2xl font-bold">
                      {lowOccupancyEmployees.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t('normal.occupancy.count')}
                    </h3>
                    <p className="text-2xl font-bold">
                      {normalOccupancyEmployees.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default OccupancyAnalytics;
