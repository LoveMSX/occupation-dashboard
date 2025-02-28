
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search, SlidersHorizontal } from "lucide-react";

// Mock data for projects
const projectsData = [
  {
    id: 1,
    name: "Mobile App Development",
    description: "Develop a cross-platform mobile application for iOS and Android",
    status: "ongoing" as const,
    startDate: "2023-06-15",
    endDate: "2023-12-30",
    progress: 68,
    team: [
      { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
      { id: 2, name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=5" },
      { id: 6, name: "Emily Roberts", avatar: "https://i.pravatar.cc/150?img=9" },
      { id: 8, name: "Jessica Brown", avatar: "https://i.pravatar.cc/150?img=6" },
    ],
  },
  {
    id: 2,
    name: "API Development",
    description: "Build RESTful APIs for the new customer portal",
    status: "ongoing" as const,
    startDate: "2023-07-01",
    endDate: "2023-11-15",
    progress: 85,
    team: [
      { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
      { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10" },
    ],
  },
  {
    id: 3,
    name: "Website Redesign",
    description: "Completely redesign the company website with modern UI/UX principles",
    status: "ongoing" as const,
    startDate: "2023-05-10",
    endDate: "2023-10-30",
    progress: 92,
    team: [
      { id: 2, name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=5" },
      { id: 3, name: "David Kim", avatar: "https://i.pravatar.cc/150?img=3" },
      { id: 6, name: "Emily Roberts", avatar: "https://i.pravatar.cc/150?img=9" },
    ],
  },
  {
    id: 4,
    name: "CRM System",
    description: "Implement a new CRM system for the sales team",
    status: "ongoing" as const,
    startDate: "2023-08-15",
    endDate: "2024-02-28",
    progress: 45,
    team: [
      { id: 3, name: "David Kim", avatar: "https://i.pravatar.cc/150?img=3" },
      { id: 8, name: "Jessica Brown", avatar: "https://i.pravatar.cc/150?img=6" },
    ],
  },
  {
    id: 5,
    name: "Database Migration",
    description: "Migrate the existing database to a new cloud platform",
    status: "ongoing" as const,
    startDate: "2023-09-01",
    endDate: "2023-12-15",
    progress: 38,
    team: [
      { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10" },
      { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7" },
    ],
  },
  {
    id: 6,
    name: "Infrastructure Upgrade",
    description: "Upgrade the server infrastructure to improve performance",
    status: "ongoing" as const,
    startDate: "2023-07-15",
    endDate: "2023-11-30",
    progress: 72,
    team: [
      { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8" },
    ],
  },
  {
    id: 7,
    name: "CI/CD Pipeline",
    description: "Implement a continuous integration and deployment pipeline",
    status: "planned" as const,
    startDate: "2023-10-15",
    endDate: "2024-01-15",
    progress: 0,
    team: [
      { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8" },
    ],
  },
  {
    id: 8,
    name: "Analytics Dashboard",
    description: "Create a real-time analytics dashboard for business metrics",
    status: "ongoing" as const,
    startDate: "2023-08-01",
    endDate: "2023-12-31",
    progress: 60,
    team: [
      { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7" },
    ],
  },
  {
    id: 9,
    name: "ML Model Training",
    description: "Train machine learning models for product recommendations",
    status: "ongoing" as const,
    startDate: "2023-09-15",
    endDate: "2024-03-31",
    progress: 25,
    team: [
      { id: 7, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=7" },
    ],
  },
  {
    id: 10,
    name: "Legacy System Retirement",
    description: "Decommission and migrate away from legacy systems",
    status: "completed" as const,
    startDate: "2023-03-01",
    endDate: "2023-08-31",
    progress: 100,
    team: [
      { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
      { id: 4, name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=10" },
      { id: 5, name: "James Wilson", avatar: "https://i.pravatar.cc/150?img=8" },
    ],
  },
];

const ProjectsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Projects</h1>
              
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
                
                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
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
                <ProjectCard key={project.id} project={project} />
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
