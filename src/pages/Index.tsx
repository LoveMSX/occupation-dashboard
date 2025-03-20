
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { TopEmployeesTable } from "@/components/dashboard/TopEmployeesTable";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { ProjectsDistributionChart } from "@/components/dashboard/ProjectsDistributionChart";
import { ProjectStatusByClient } from "@/components/dashboard/ProjectStatusByClient";
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/LanguageProvider";
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, IDashboardData } from '@/services/dashboardApi';

export function IndexPage() {
  const { language, t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<IDashboardData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: dashboardApi.getGloabalData,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  useEffect(() => {
    if (data) {
      setDashboardData(data);
      setLoading(false);
    }
  }, [data]);

  return (
    <SidebarProvider>
      <div className="container mx-auto py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your analytics dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title={t("Employees")}
            value={loading ? <Skeleton className="h-9 w-24" /> : dashboardData?.totalEmployees || 0}
            description={t("Total employees")}
            trend="up"
            trendValue="12%"
            icon="users"
          />
          <StatCard
            title={t("Projects")}
            value={loading ? <Skeleton className="h-9 w-24" /> : dashboardData?.totalProjects || 0}
            description={`${dashboardData?.activeProjects || 0} active`}
            trend="up"
            trendValue="4%"
            icon="folder"
          />
          <StatCard
            title={t("Sales")}
            value={loading ? <Skeleton className="h-9 w-24" /> : dashboardData?.totalSales || 0}
            description={`${dashboardData?.wonSales || 0} won, ${dashboardData?.pendingSales || 0} pending`}
            trend="up"
            trendValue="9%"
            icon="trending-up"
          />
          <StatCard
            title={t("Occupancy")}
            value={loading ? <Skeleton className="h-9 w-24" /> : `${dashboardData?.occupancyRate || 0}%`}
            description={t("Average rate")}
            trend="down"
            trendValue="3%"
            icon="activity"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>{t("Occupation Rate")}</CardTitle>
              <CardDescription>{t("Monthly occupation rate for all resources")}</CardDescription>
            </CardHeader>
            <CardContent>
              <OccupancyChart />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>{t("Projects Distribution")}</CardTitle>
              <CardDescription>{t("Number of projects per category")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsDistributionChart />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>{t("Project Status by Client")}</CardTitle>
              <CardDescription>{t("Current projects per client")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectStatusByClient />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>{t("Project Statistics")}</CardTitle>
              <CardDescription>{t("Timeline of project starts and completions")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectStats />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>{t("Recent Projects")}</CardTitle>
              <CardDescription>{t("Latest project updates")}</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentProjects />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>{t("Top Performers")}</CardTitle>
              <CardDescription>{t("Employees with highest occupancy")}</CardDescription>
            </CardHeader>
            <CardContent>
              <TopEmployeesTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default IndexPage;
