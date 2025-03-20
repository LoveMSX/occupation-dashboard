
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProjectsDistributionChart } from "@/components/dashboard/ProjectsDistributionChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { dashboardApi } from '@/services/dashboardApi';
import { useQuery } from '@tanstack/react-query';
import { IDashboardData } from '@/types/dashboard';
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { TopEmployeesTable } from "@/components/dashboard/TopEmployeesTable";

// Import actual icons from lucide-react
import { 
  Users, 
  Briefcase, 
  Target, 
  TrendingUp,
  Clock
} from 'lucide-react';

export default function Index() {
  const [dashboardData, setDashboardData] = useState<IDashboardData | undefined>(undefined);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getGlobalData
  });

  useEffect(() => {
    if (data) {
      setDashboardData(data);
    }
  }, [data]);

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Employés"
              value={dashboardData?.totalEmployees.toString() || "0"}
              icon={Users}
              variant="success"
            />
            <StatCard
              title="Total Projets"
              value={dashboardData?.totalProjects.toString() || "0"}
              icon={Briefcase}
              variant="primary"
            />
            <StatCard
              title="Taux d'occupation"
              value={`${dashboardData?.occupancyRate || 0}%`}
              icon={Target}
              variant="warning"
            />
            <StatCard
              title="Ventes gagnées"
              value={`${Math.round((dashboardData?.wonSales || 0) / (dashboardData?.totalSales || 1) * 100)}%`}
              percentageChange={dashboardData?.completedPercentage || 0}
              icon={TrendingUp}
              variant="success"
              description="vs année précédente"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Taux d'occupation</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.occupationOverYear && (
                  <OccupancyChart occupancyData={dashboardData.occupationOverYear || []} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des projets</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.projectsByType && (
                  <ProjectsDistributionChart distribution={dashboardData.projectsByType || []} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <Tabs defaultValue="stats">
              <TabsList>
                <TabsTrigger value="stats">Statistiques Projets</TabsTrigger>
                <TabsTrigger value="projects">Projets Récents</TabsTrigger>
                <TabsTrigger value="employees">Top Employés</TabsTrigger>
              </TabsList>
              <TabsContent value="stats">
                <Card>
                  <CardContent className="p-6">
                    {dashboardData && (
                      <ProjectStats data={{
                        completed: dashboardData.completedProjects,
                        ongoing: dashboardData.ongoingProjects,
                        upcoming: dashboardData.upcomingProjects
                      }} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="projects">
                <Card>
                  <CardContent className="p-6">
                    {dashboardData?.recentProjects && (
                      <RecentProjects projectsData={dashboardData.recentProjects} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="employees">
                <Card>
                  <CardContent className="p-6">
                    {dashboardData?.topEmployees && (
                      <TopEmployeesTable Employees={dashboardData.topEmployees} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
