
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { ViewModeToggle } from "@/components/employees/ViewModeToggle";
import { EmployeeGrid } from "@/components/employees/EmployeeGrid";
import { enhancedEmployeesData } from "@/data/employeesData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TableIcon, 
  BarChart2Icon, 
  LayoutGridIcon, 
  PieChartIcon, 
  CalendarDaysIcon,
  ListIcon
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const EmployeesPage = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentView, setCurrentView] = useState<"table" | "chart" | "cards" | "department" | "skills">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  
  const filteredEmployees = enhancedEmployeesData.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesLocation = locationFilter === "all" || employee.location === locationFilter;
    const matchesSkill = skillFilter === "all" || employee.skills?.includes(skillFilter);
    
    return matchesSearch && matchesDepartment && matchesLocation && matchesSkill;
  });

  // Calculate data for department chart
  const departmentChartData = () => {
    const departmentCounts: Record<string, number> = {};
    
    enhancedEmployeesData.forEach(employee => {
      if (departmentCounts[employee.department]) {
        departmentCounts[employee.department]++;
      } else {
        departmentCounts[employee.department] = 1;
      }
    });
    
    return Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));
  };

  // Calculate data for skills chart
  const skillsChartData = () => {
    const skillCounts: Record<string, number> = {};
    
    enhancedEmployeesData.forEach(employee => {
      employee.skills?.forEach(skill => {
        if (skillCounts[skill]) {
          skillCounts[skill]++;
        } else {
          skillCounts[skill] = 1;
        }
      });
    });
    
    return Object.entries(skillCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 skills
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
  
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
              <h1 className="text-2xl font-bold mb-4 md:mb-0">{t('employees')}</h1>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "table" ? "bg-accent" : ""}
                  onClick={() => {
                    setCurrentView("table");
                    setViewMode("list");
                  }}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Table
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "cards" ? "bg-accent" : ""}
                  onClick={() => {
                    setCurrentView("table");
                    setViewMode("grid");
                  }}
                >
                  <LayoutGridIcon className="h-4 w-4 mr-2" />
                  Cartes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "department" ? "bg-accent" : ""}
                  onClick={() => setCurrentView("department")}
                >
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Par département
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "skills" ? "bg-accent" : ""}
                  onClick={() => setCurrentView("skills")}
                >
                  <BarChart2Icon className="h-4 w-4 mr-2" />
                  Par compétences
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 mb-6">
              <EmployeeSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              
              <div className="flex flex-wrap gap-2">
                <EmployeeFilters
                  employees={enhancedEmployeesData}
                  departmentFilter={departmentFilter}
                  setDepartmentFilter={setDepartmentFilter}
                  locationFilter={locationFilter}
                  setLocationFilter={setLocationFilter}
                  skillFilter={skillFilter}
                  setSkillFilter={setSkillFilter}
                />
                
                {currentView === "table" && (
                  <ViewModeToggle 
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                )}
              </div>
            </div>
            
            {currentView === "table" && (
              <EmployeeGrid 
                employees={filteredEmployees}
                viewMode={viewMode}
              />
            )}

            {currentView === "department" && (
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-bold mb-4">Répartition par département</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={140}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {departmentChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} employés`, 'Nombre']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentView === "skills" && (
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-bold mb-4">Top 10 des compétences</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={skillsChartData()}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value) => [`${value} employés`, 'Nombre']} />
                        <Legend />
                        <Bar dataKey="value" name="Nombre d'employés" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-4 text-sm text-muted-foreground">
              {filteredEmployees.length} employés sur {enhancedEmployeesData.length} au total
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EmployeesPage;
