
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectCard, ProjectData } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search, SlidersHorizontal, Building, MapPin, Tag } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

// Enhanced mock data for projects based on the provided image
const projectsData: ProjectData[] = [
  {
    id: 1,
    name: "Digital Transformation Program",
    description: "Comprehensive digital transformation initiative including process reengineering and new technology implementation",
    status: "ongoing",
    client: "TechCorp Industries",
    category: "Forfait",
    location: "Local",
    startDate: "2023-06-15",
    endDate: "2023-12-30",
    progress: 68,
    manager: { id: 3, name: "David Kim", avatar: "https://i.pravatar.cc/150?img=3" },
    budget: { planned: 350000, consumed: 220000, currency: "EUR" },
    team: [
      { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", role: "Lead Developer" },
      { id: 2, name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=5", role: "UX Designer" },
      { id: 6, name: "Emily Roberts", avatar: "https://i.pravatar.cc/150?img=9", role: "Frontend Developer" },
      { id: 8, name: "Jessica Brown", avatar: "https://i.pravatar.cc/150?img=6", role: "QA Engineer" },
    ],
  },
  {
    id: 2,
    name: "API Development & Integration",
    description: "Build RESTful APIs for the new customer portal and integrate with existing systems",
    status: "ongoing",
    client: "FinServe Group",
    category: "TMA",
    location: "Hybrid",
    startDate: "2023-07-01",
    endDate: "2023-11-15",
    progress: 85,
    manager: { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8" },
    team: [
      { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", role: "Backend Developer" },
      { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10", role: "Database Specialist" },
    ],
  },
  {
    id: 3,
    name: "Corporate Website Redesign",
    description: "Completely redesign the company website with modern UI/UX principles and improved user journey",
    status: "ongoing",
    client: "Global Retail Inc.",
    category: "Forfait",
    location: "Local",
    startDate: "2023-05-10",
    endDate: "2023-10-30",
    progress: 92,
    manager: { id: 2, name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=5" },
    budget: { planned: 120000, consumed: 110000, currency: "EUR" },
    team: [
      { id: 2, name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=5", role: "Lead Designer" },
      { id: 3, name: "David Kim", avatar: "https://i.pravatar.cc/150?img=3", role: "Project Manager" },
      { id: 6, name: "Emily Roberts", avatar: "https://i.pravatar.cc/150?img=9", role: "Frontend Developer" },
    ],
  },
  {
    id: 4,
    name: "CRM System Implementation",
    description: "Implement a new CRM system for the sales team with customized workflows and integration with existing tools",
    status: "ongoing",
    client: "HealthPlus Services",
    category: "Regie",
    location: "Local",
    startDate: "2023-08-15",
    endDate: "2024-02-28",
    progress: 45,
    manager: { id: 3, name: "David Kim", avatar: "https://i.pravatar.cc/150?img=3" },
    budget: { planned: 280000, consumed: 125000, currency: "EUR" },
    team: [
      { id: 3, name: "David Kim", avatar: "https://i.pravatar.cc/150?img=3", role: "Project Manager" },
      { id: 8, name: "Jessica Brown", avatar: "https://i.pravatar.cc/150?img=6", role: "QA Engineer" },
    ],
  },
  {
    id: 5,
    name: "Database Migration to Cloud",
    description: "Migrate the existing database infrastructure to a new cloud platform with improved security and performance",
    status: "ongoing",
    client: "SecureData Solutions",
    category: "TMA",
    location: "Offshore",
    startDate: "2023-09-01",
    endDate: "2023-12-15",
    progress: 38,
    manager: { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10" },
    team: [
      { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10", role: "Database Architect" },
      { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7", role: "Data Scientist" },
    ],
  },
  {
    id: 6,
    name: "Infrastructure Modernization",
    description: "Upgrade the server infrastructure and network to improve performance, reliability, and security",
    status: "ongoing",
    client: "EduTech Innovations",
    category: "Forfait",
    location: "Local",
    startDate: "2023-07-15",
    endDate: "2023-11-30",
    progress: 72,
    manager: { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8" },
    budget: { planned: 195000, consumed: 140000, currency: "EUR" },
    team: [
      { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8", role: "System Administrator" },
    ],
  },
  {
    id: 7,
    name: "CI/CD Pipeline Automation",
    description: "Implement a continuous integration and deployment pipeline to streamline software delivery",
    status: "standby",
    client: "AgriTech Solutions",
    category: "Regie",
    location: "Local",
    startDate: "2023-10-15",
    endDate: "2024-01-15",
    progress: 25,
    manager: { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8" },
    team: [
      { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8", role: "DevOps Engineer" },
    ],
  },
  {
    id: 8,
    name: "Business Analytics Dashboard",
    description: "Create a real-time analytics dashboard for business metrics with customizable reports and visualizations",
    status: "ongoing",
    client: "LogisticsPro",
    category: "TMA",
    location: "Hybrid",
    startDate: "2023-08-01",
    endDate: "2023-12-31",
    progress: 60,
    manager: { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7" },
    budget: { planned: 175000, consumed: 105000, currency: "EUR" },
    team: [
      { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7", role: "Data Analyst" },
      { id: 2, name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=5", role: "UX Designer" },
    ],
  },
  {
    id: 9,
    name: "Product Recommendation Engine",
    description: "Train machine learning models for product recommendations based on customer behavior and preferences",
    status: "ongoing",
    client: "RetailMax",
    category: "Forfait",
    location: "Offshore",
    startDate: "2023-09-15",
    endDate: "2024-03-31",
    progress: 25,
    manager: { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7" },
    budget: { planned: 230000, consumed: 58000, currency: "EUR" },
    team: [
      { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7", role: "Data Scientist" },
      { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10", role: "Machine Learning Engineer" },
    ],
  },
  {
    id: 10,
    name: "Legacy System Retirement",
    description: "Decommission and migrate away from legacy systems to modern platforms",
    status: "completed",
    client: "IndustrialTech",
    category: "Regie",
    location: "Local",
    startDate: "2023-03-01",
    endDate: "2023-08-31",
    progress: 100,
    manager: { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    team: [
      { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", role: "Lead Developer" },
      { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10", role: "Database Specialist" },
      { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8", role: "System Administrator" },
    ],
  },
];

const ProjectsPage = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesClient = clientFilter === "all" || project.client === clientFilter;
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || project.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesClient && matchesCategory && matchesLocation;
  });
  
  // Get unique clients, categories, and locations for filters
  const clients = Array.from(new Set(projectsData.map(project => project.client)));
  const categories = Array.from(new Set(projectsData.map(project => project.category)));
  const locations = Array.from(new Set(projectsData.map(project => project.location)));
  
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
              <h1 className="text-2xl font-bold mb-4 md:mb-0">{t('projects')}</h1>
              
              <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative flex-1 md:flex-initial md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="standby">Stand By</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Building className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Tag className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
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
            
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} viewMode={viewMode} />
              ))}
              
              {filteredProjects.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-medium">No projects found</p>
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

export default ProjectsPage;
