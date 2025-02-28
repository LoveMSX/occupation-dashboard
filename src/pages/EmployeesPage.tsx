
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmployeeCard, EmployeeData } from "@/components/employees/EmployeeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search, SlidersHorizontal, Tag, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

// Enhanced mock data for employees based on the data structure from the image
const employeesData: EmployeeData[] = [
  {
    id: 98765,
    name: "Smith, John",
    position: "Senior Developer",
    department: "Engineering",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    avatar: "https://i.pravatar.cc/150?img=1",
    location: "Paris",
    joinDate: "2019-05-15",
    manager: "Diana Miller",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    occupancyRate: 98,
    projects: [
      { id: 1, name: "Digital Transformation", status: "active", client: "TechCorp Industries", category: "Forfait" },
      { id: 2, name: "API Development", status: "active", client: "FinServe Group", category: "TMA" },
    ],
  },
  {
    id: 34567,
    name: "Garcia, Maria",
    position: "UX Designer",
    department: "Design",
    email: "maria.garcia@example.com",
    phone: "(555) 234-5678",
    avatar: "https://i.pravatar.cc/150?img=5",
    location: "Madrid",
    joinDate: "2020-02-10",
    manager: "David Kim",
    skills: ["Figma", "Adobe XD", "UI Design", "User Research"],
    occupancyRate: 95,
    projects: [
      { id: 3, name: "Website Redesign", status: "active", client: "Global Retail Inc.", category: "Forfait" },
      { id: 1, name: "Digital Transformation", status: "active", client: "TechCorp Industries", category: "Forfait" },
      { id: 8, name: "Analytics Dashboard", status: "active", client: "LogisticsPro", category: "TMA" },
    ],
  },
  {
    id: 45678,
    name: "Kim, David",
    position: "Project Manager",
    department: "Product",
    email: "david.kim@example.com",
    phone: "(555) 345-6789",
    avatar: "https://i.pravatar.cc/150?img=3",
    location: "Seoul",
    joinDate: "2018-11-05",
    manager: "Susan Richards",
    skills: ["Project Management", "Agile", "Scrum", "Jira"],
    occupancyRate: 92,
    projects: [
      { id: 4, name: "CRM Implementation", status: "active", client: "HealthPlus Services", category: "Regie" },
      { id: 3, name: "Website Redesign", status: "pending", client: "Global Retail Inc.", category: "Forfait" },
      { id: 1, name: "Digital Transformation", status: "active", client: "TechCorp Industries", category: "Forfait" },
    ],
  },
  {
    id: 56789,
    name: "Chen, Sarah",
    position: "Backend Developer",
    department: "Engineering",
    email: "sarah.chen@example.com",
    phone: "(555) 456-7890",
    avatar: "https://i.pravatar.cc/150?img=10",
    location: "Shanghai",
    joinDate: "2021-03-22",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Microservices"],
    occupancyRate: 88,
    projects: [
      { id: 2, name: "API Development", status: "active", client: "FinServe Group", category: "TMA" },
      { id: 5, name: "Database Migration", status: "active", client: "SecureData Solutions", category: "TMA" },
      { id: 9, name: "Product Recommendation", status: "active", client: "RetailMax", category: "Forfait" },
    ],
  },
  {
    id: 67890,
    name: "Wilson, James",
    position: "DevOps Engineer",
    department: "Engineering",
    email: "james.wilson@example.com",
    phone: "(555) 567-8901",
    avatar: "https://i.pravatar.cc/150?img=8",
    location: "London",
    joinDate: "2019-08-15",
    manager: "Michael Brown",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    occupancyRate: 85,
    projects: [
      { id: 6, name: "Infrastructure Modernization", status: "active", client: "EduTech Innovations", category: "Forfait" },
      { id: 7, name: "CI/CD Pipeline", status: "pending", client: "AgriTech Solutions", category: "Regie" },
    ],
  },
  {
    id: 78901,
    name: "Roberts, Emily",
    position: "Frontend Developer",
    department: "Engineering",
    email: "emily.roberts@example.com",
    phone: "(555) 678-9012",
    avatar: "https://i.pravatar.cc/150?img=9",
    location: "Berlin",
    joinDate: "2020-06-10",
    manager: "David Kim",
    skills: ["React", "JavaScript", "CSS", "Responsive Design"],
    occupancyRate: 82,
    projects: [
      { id: 3, name: "Website Redesign", status: "active", client: "Global Retail Inc.", category: "Forfait" },
      { id: 1, name: "Digital Transformation", status: "active", client: "TechCorp Industries", category: "Forfait" },
    ],
  },
  {
    id: 89012,
    name: "Lee, Michael",
    position: "Data Scientist",
    department: "Data",
    email: "michael.lee@example.com",
    phone: "(555) 789-0123",
    avatar: "https://i.pravatar.cc/150?img=7",
    location: "Singapore",
    joinDate: "2021-01-15",
    manager: "Susan Richards",
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "TensorFlow"],
    occupancyRate: 78,
    projects: [
      { id: 8, name: "Analytics Dashboard", status: "active", client: "LogisticsPro", category: "TMA" },
      { id: 9, name: "Product Recommendation", status: "active", client: "RetailMax", category: "Forfait" },
    ],
  },
  {
    id: 90123,
    name: "Brown, Jessica",
    position: "QA Engineer",
    department: "Engineering",
    email: "jessica.brown@example.com",
    phone: "(555) 890-1234",
    avatar: "https://i.pravatar.cc/150?img=6",
    location: "New York",
    joinDate: "2020-09-01",
    manager: "David Kim",
    skills: ["Test Automation", "Selenium", "QA Methodologies", "JIRA"],
    occupancyRate: 75,
    projects: [
      { id: 1, name: "Digital Transformation", status: "active", client: "TechCorp Industries", category: "Forfait" },
      { id: 4, name: "CRM Implementation", status: "active", client: "HealthPlus Services", category: "Regie" },
    ],
  },
];

const EmployeesPage = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  
  // Get unique departments, locations, and skills for filters
  const departments = Array.from(new Set(employeesData.map(emp => emp.department)));
  const locations = Array.from(new Set(employeesData.map(emp => emp.location)));
  
  // Extract all unique skills from employees
  const allSkills = new Set<string>();
  employeesData.forEach(emp => {
    emp.skills?.forEach(skill => allSkills.add(skill));
  });
  const skills = Array.from(allSkills);
  
  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "" || employee.department === departmentFilter;
    const matchesLocation = locationFilter === "" || employee.location === locationFilter;
    const matchesSkill = skillFilter === "" || employee.skills?.includes(skillFilter);
    
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
                
                <div className="flex flex-wrap gap-2">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Department" />
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
                  
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[140px]">
                      <MapPin className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={skillFilter} onValueChange={setSkillFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Tag className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Skills</SelectItem>
                      {skills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
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
                <EmployeeCard key={employee.id} employee={employee} viewMode={viewMode} />
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
