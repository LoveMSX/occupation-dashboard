
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search, SlidersHorizontal } from "lucide-react";

// Mock data for employees
const employeesData = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Senior Developer",
    department: "Engineering",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    avatar: "https://i.pravatar.cc/150?img=1",
    occupancyRate: 98,
    projects: [
      { id: 1, name: "Mobile App", status: "active" },
      { id: 2, name: "API Development", status: "active" },
    ],
  },
  {
    id: 2,
    name: "Maria Garcia",
    position: "UX Designer",
    department: "Design",
    email: "maria.garcia@example.com",
    phone: "(555) 234-5678",
    avatar: "https://i.pravatar.cc/150?img=5",
    occupancyRate: 95,
    projects: [
      { id: 3, name: "Website Redesign", status: "active" },
      { id: 1, name: "Mobile App", status: "active" },
    ],
  },
  {
    id: 3,
    name: "David Kim",
    position: "Project Manager",
    department: "Product",
    email: "david.kim@example.com",
    phone: "(555) 345-6789",
    avatar: "https://i.pravatar.cc/150?img=3",
    occupancyRate: 92,
    projects: [
      { id: 4, name: "CRM System", status: "active" },
      { id: 3, name: "Website Redesign", status: "pending" },
    ],
  },
  {
    id: 4,
    name: "Sarah Chen",
    position: "Backend Developer",
    department: "Engineering",
    email: "sarah.chen@example.com",
    phone: "(555) 456-7890",
    avatar: "https://i.pravatar.cc/150?img=10",
    occupancyRate: 88,
    projects: [
      { id: 2, name: "API Development", status: "active" },
      { id: 5, name: "Database Migration", status: "active" },
    ],
  },
  {
    id: 5,
    name: "James Wilson",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "james.wilson@example.com",
    phone: "(555) 567-8901",
    avatar: "https://i.pravatar.cc/150?img=8",
    occupancyRate: 85,
    projects: [
      { id: 6, name: "Infrastructure Upgrade", status: "active" },
      { id: 7, name: "CI/CD Pipeline", status: "pending" },
    ],
  },
  {
    id: 6,
    name: "Emily Roberts",
    position: "Frontend Developer",
    department: "Engineering",
    email: "emily.roberts@example.com",
    phone: "(555) 678-9012",
    avatar: "https://i.pravatar.cc/150?img=9",
    occupancyRate: 82,
    projects: [
      { id: 3, name: "Website Redesign", status: "active" },
      { id: 1, name: "Mobile App", status: "active" },
    ],
  },
  {
    id: 7,
    name: "Michael Lee",
    position: "Data Scientist",
    department: "Data",
    email: "michael.lee@example.com",
    phone: "(555) 789-0123",
    avatar: "https://i.pravatar.cc/150?img=7",
    occupancyRate: 78,
    projects: [
      { id: 8, name: "Analytics Dashboard", status: "active" },
      { id: 9, name: "ML Model Training", status: "active" },
    ],
  },
  {
    id: 8,
    name: "Jessica Brown",
    position: "QA Engineer",
    department: "Engineering",
    email: "jessica.brown@example.com",
    phone: "(555) 890-1234",
    avatar: "https://i.pravatar.cc/150?img=6",
    occupancyRate: 75,
    projects: [
      { id: 1, name: "Mobile App", status: "active" },
      { id: 4, name: "CRM System", status: "active" },
    ],
  },
];

const EmployeesPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  
  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "" || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Get unique departments for filter
  const departments = Array.from(new Set(employeesData.map(emp => emp.department)));
  
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
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Employees</h1>
              
              <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative flex-1 md:flex-initial md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex rounded-md border">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
              {filteredEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
              
              {filteredEmployees.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-medium">No employees found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EmployeesPage;
