
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

const EmployeesPage = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
              
              <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
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
                  
                  <ViewModeToggle 
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                </div>
              </div>
            </div>
            
            <EmployeeGrid 
              employees={filteredEmployees}
              viewMode={viewMode}
            />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EmployeesPage;
