
import { BarChart2, Briefcase, Users, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { ProjectsDistributionChart } from "@/components/dashboard/ProjectsDistributionChart";
import { TopEmployeesTable } from "@/components/dashboard/TopEmployeesTable";
import { ThemeProvider } from "@/components/ThemeProvider";

const Dashboard = () => {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Employees"
                value="128"
                percentageChange={5.2}
                icon={<Users className="h-5 w-5" />}
                variant="primary"
              />
              <StatCard
                title="Active Projects"
                value="42"
                percentageChange={12.5}
                icon={<Briefcase className="h-5 w-5" />}
                variant="info"
              />
              <StatCard
                title="Avg. Occupancy"
                value="86.7%"
                percentageChange={3.8}
                icon={<BarChart2 className="h-5 w-5" />}
                variant="success"
              />
              <StatCard
                title="Utilization"
                value="92.3%"
                percentageChange={-1.5}
                icon={<TrendingUp className="h-5 w-5" />}
                variant="warning"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2">
                <OccupancyChart />
              </div>
              <div>
                <ProjectsDistributionChart />
              </div>
            </div>
            
            <div className="mb-6">
              <TopEmployeesTable />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
