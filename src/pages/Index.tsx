
import { BarChart2, Briefcase, Users, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { ProjectsDistributionChart } from "@/components/dashboard/ProjectsDistributionChart";
import { TopEmployeesTable } from "@/components/dashboard/TopEmployeesTable";
import { OccupancyTable } from "@/components/dashboard/OccupancyTable";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { ProjectStatusByClient } from "@/components/dashboard/ProjectStatusByClient";

const Dashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="overview">{t('dashboard')}</TabsTrigger>
                  <TabsTrigger value="occupancy">{t('occupancy.rate')}</TabsTrigger>
                  <TabsTrigger value="projects">Projets</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">Q3 2025</Button>
              </div>
              
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProjectStats />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <OccupancyChart />
                  </div>
                  <div>
                    <ProjectsDistributionChart />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <TopEmployeesTable />
                  </div>
                  <div>
                    <RecentProjects />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="occupancy" className="mt-0 space-y-6">
                <OccupancyTable />
              </TabsContent>
              
              <TabsContent value="projects" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProjectStats />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RecentProjects />
                  <ProjectsDistributionChart />
                </div>
                
                <ProjectStatusByClient />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
