
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { enhancedEmployeesData } from "@/data/employeesData";
import { positionDepartmentMap } from "@/data/employeesData";
import { useLanguage } from "@/components/LanguageProvider";

const OccupancyAnalytics = () => {
  const { t } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState("quarterly");
  
  // Grouper les données d'occupation par mois (simulation)
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Simuler des données d'occupation mensuelle basées sur les données réelles
    // En pratique, cette donnée viendrait d'une API avec historique
    return months.map((name, index) => {
      const baseOccupancy = Math.round(
        enhancedEmployeesData.reduce((sum, emp) => sum + emp.occupancyRate, 0) / 
        enhancedEmployeesData.length
      );
      
      // Ajouter une variation pour simuler des changements mensuels
      const monthVariation = Math.sin(index / 2) * 10;
      const occupancy = Math.min(Math.max(baseOccupancy + monthVariation, 60), 95);
      const utilization = occupancy + Math.random() * 5 + 2; // Utilisation légèrement supérieure
      
      return {
        name,
        occupancy: Math.round(occupancy),
        utilization: Math.round(utilization),
        target: 85
      };
    });
  }, []);
  
  // Calculer les données d'occupation par département en utilisant les données réelles
  const departmentData = useMemo(() => {
    const departmentMap: Record<string, { occupancy: number, count: number, headcount: number }> = {};
    
    // Regrouper par département
    enhancedEmployeesData.forEach(employee => {
      const dept = employee.department;
      
      if (!departmentMap[dept]) {
        departmentMap[dept] = { occupancy: 0, count: 0, headcount: 0 };
      }
      
      departmentMap[dept].occupancy += employee.occupancyRate;
      departmentMap[dept].count += 1;
      departmentMap[dept].headcount += 1; // Un employé = 1 headcount
    });
    
    // Calculer les moyennes et formater pour le graphique
    return Object.entries(departmentMap)
      .map(([name, data]) => ({
        name,
        occupancy: Math.round(data.occupancy / data.count),
        headcount: data.headcount
      }))
      .sort((a, b) => b.occupancy - a.occupancy); // Trier par occupation décroissante
  }, []);
  
  // Calculer les données d'occupation par niveau de séniorité (simulation basée sur position)
  const seniorityData = useMemo(() => {
    const seniorityMap: Record<string, { employees: typeof enhancedEmployeesData, totalOccupancy: number }> = {
      "Junior": { employees: [], totalOccupancy: 0 },
      "Mid-level": { employees: [], totalOccupancy: 0 },
      "Senior": { employees: [], totalOccupancy: 0 },
      "Lead": { employees: [], totalOccupancy: 0 },
      "Manager": { employees: [], totalOccupancy: 0 }
    };
    
    // Attribuer un niveau de séniorité basé sur la position (simulation)
    enhancedEmployeesData.forEach(employee => {
      let seniority = "Mid-level"; // Par défaut
      
      if (employee.position === "TL" || employee.position === "DP") {
        seniority = "Manager";
      } else if (employee.position === "RT" || employee.position === "CPS") {
        seniority = "Senior";
      } else if (employee.position === "AL" || employee.position === "CPC") {
        seniority = "Lead";
      } else if (employee.position === "IDS" && Math.random() > 0.5) {
        seniority = "Junior";
      }
      
      seniorityMap[seniority].employees.push(employee);
      seniorityMap[seniority].totalOccupancy += employee.occupancyRate;
    });
    
    // Calculer les moyennes et formater pour le graphique
    return Object.entries(seniorityMap)
      .filter(([_, data]) => data.employees.length > 0) // Supprimer les catégories sans employés
      .map(([name, data]) => ({
        name,
        occupancy: Math.round(data.totalOccupancy / data.employees.length),
        headcount: data.employees.length
      }))
      .sort((a, b) => a.occupancy - b.occupancy); // Trier par occupation croissante
  }, []);
  
  // Données de tendance - Simulation de semaines
  const trendData = useMemo(() => {
    const baseOccupancy = Math.round(
      enhancedEmployeesData.reduce((sum, emp) => sum + emp.occupancyRate, 0) / 
      enhancedEmployeesData.length
    );
    
    return Array.from({ length: 12 }, (_, index) => {
      const weekVariation = Math.sin(index / 3) * 5;
      const current = baseOccupancy + weekVariation;
      const previous = current - 4 + Math.random() * 6; // Simuler le trimestre précédent
      
      return {
        name: `Week ${index + 1}`,
        current: Math.round(Math.min(Math.max(current, 75), 95)),
        previous: Math.round(Math.min(Math.max(previous, 70), 90))
      };
    });
  }, []);
  
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">{t('occupancy.rate.analytics')}</h1>
              
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t('monthly')}</SelectItem>
                  <SelectItem value="quarterly">{t('quarterly')}</SelectItem>
                  <SelectItem value="yearly">{t('yearly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('monthly.occupancy.trend')}</CardTitle>
                  <CardDescription>
                    {t('occupancy.vs.utilization')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis 
                          domain={[0, 100]} 
                          ticks={[0, 20, 40, 60, 80, 100]} 
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, undefined]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend formatter={(value) => {
                          if (value === 'occupancy') return t('occupancy.rate');
                          if (value === 'utilization') return t('utilization');
                          if (value === 'target') return 'Objectif';
                          return value;
                        }} />
                        <Bar dataKey="occupancy" name="occupancy" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Line
                          type="monotone"
                          dataKey="utilization"
                          name="utilization"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          name="target"
                          stroke="#F97316"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('occupancy.by.department')}</CardTitle>
                  <CardDescription>
                    {t('avg.occupancy.departments')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={80}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'occupancy' ? `${value}%` : value,
                            name === 'occupancy' ? t('occupancy.rate') : 'Effectif'
                          ]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend 
                          formatter={(value) => (value === 'occupancy' ? t('occupancy.rate') : 'Effectif')}
                        />
                        <Bar dataKey="occupancy" name="occupancy" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('occupancy.by.seniority')}</CardTitle>
                  <CardDescription>
                    {t('occupancy.seniority.levels')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={seniorityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis
                          yAxisId="left"
                          domain={[0, 100]}
                          ticks={[0, 20, 40, 60, 80, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 'dataMax + 10']}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'occupancy' ? `${value}%` : value,
                            name === 'occupancy' ? t('occupancy.rate') : 'Effectif'
                          ]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend 
                          formatter={(value) => (value === 'occupancy' ? t('occupancy.rate') : 'Effectif')}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="occupancy"
                          name="occupancy"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="headcount"
                          name="headcount"
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('current.vs.previous')}</CardTitle>
                  <CardDescription>
                    {t('comparison.quarters')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis
                          domain={[70, 100]}
                          ticks={[70, 75, 80, 85, 90, 95, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, undefined]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend 
                          formatter={(value) => (
                            value === 'current' ? 'Trimestre Actuel' : 
                            value === 'previous' ? 'Trimestre Précédent' : value
                          )}
                        />
                        <Line
                          type="monotone"
                          dataKey="current"
                          name="current"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="previous"
                          name="previous"
                          stroke="#8E9196"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default OccupancyAnalytics;
