
import { BarChart2, Briefcase, Users, TrendingUp } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OccupancyChart, OccupancyData } from "@/components/dashboard/OccupancyChart";
import { ProjectsDistributionChart } from "@/components/dashboard/ProjectsDistributionChart";
import { TopEmployeesTable } from "@/components/dashboard/TopEmployeesTable";
import { OccupancyTable } from "@/components/dashboard/OccupancyTable";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useState } from "react";
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { ProjectStatusByClient } from "@/components/dashboard/ProjectStatusByClient";
import { dashboardApi } from "../services/api";

export interface IProjectDashboard {
  id: number;
  nom_projet: string;
  statut: string;
}
export interface ItopEmployee {
  employee_id: number;
  employee_name: string;
  average_occupancy_top: string;
  position: string;
  projects: IProjectDashboard[];
}
export interface IRateProjectCategories {
  categorie_projet: string;
  count: string;
  percentage: string;
}
export interface IRecentProject {
  nom_projet: string;
  statut: string;
  client: string;
  categorie_projet: string;
  progression: string;
}

export interface IDashboardData {
  ongoingProjects: number;
  totalProjects: number;
  completedProjects: number;
  upcomingProjects: number;
  occupationOverYear: OccupancyData[];
  topEmployees: ItopEmployee[];
  RateProjectCategories: IRateProjectCategories[];
  RecentProject: IRecentProject[];
  ongoingPercentage: number;
  completedPercentage: number;
  upcomingPercentage: number;
}

const Dashboard = () => {

  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("overview");

  const [dashboardData, setDashboardData] = useState<IDashboardData>();

  const getDashbordData = async() =>{
    try {
      const data = await dashboardApi.getGloabalData();
      console.log("dashboard data", data);
      setDashboardData(data);
    } catch(error){
      return (<div> Failed to fetch data</div>)
    }
  }

  useEffect(()=>{
    getDashbordData();
  },[])

  const statsData = {
    ongoingProjects: dashboardData ? dashboardData.ongoingProjects : 0,
    totalProjects: dashboardData ? dashboardData.totalProjects : 0,
    completedProjects: dashboardData ? dashboardData.completedProjects : 0,
    upcomingProjects: dashboardData ? dashboardData.upcomingProjects : 0,
    ongoingPercentage: dashboardData ? dashboardData.ongoingPercentage : 0,
    completedPercentage: dashboardData ? dashboardData.completedPercentage : 0,
    upcomingPercentage: dashboardData ? dashboardData.upcomingPercentage : 0,
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="overview">{t('dashboard')}</TabsTrigger>
                <TabsTrigger value="occupancy">{t('occupancy.rate')}</TabsTrigger>
                <TabsTrigger value="projects">{t('projects')}</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">Q3 2025</Button>
            </div>
            
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ProjectStats data={statsData} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <OccupancyChart
                    occupancyData={dashboardData?.occupationOverYear}
                  />
                </div>
                <div>
                  <ProjectsDistributionChart 
                    distribution={dashboardData?.RateProjectCategories}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <TopEmployeesTable 
                    Employees={dashboardData?.topEmployees}
                  />
                </div>
                <div>
                  <RecentProjects 
                    projectsData = {dashboardData?.RecentProject}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="occupancy" className="mt-0 space-y-6">
              <OccupancyTable />
            </TabsContent>
            
            <TabsContent value="projects" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ProjectStats data={statsData} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RecentProjects 
                  projectsData = {dashboardData?.RecentProject}
                />
                <ProjectsDistributionChart 
                  distribution={dashboardData?.RateProjectCategories}
                />
              </div>
              
              <ProjectStatusByClient />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
