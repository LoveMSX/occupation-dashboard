
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectCard, ProjectData } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Search, SlidersHorizontal, Building, MapPin, Tag, TableIcon, 
  BarChart2Icon, LayoutGridIcon, PieChartIcon, CalendarDaysIcon, PlusIcon, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { projectsData } from "@/data/projectsData";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
  LineChart,
  Line,
} from "recharts";

const ProjectsPage = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentView, setCurrentView] = useState<"table" | "grid" | "chart" | "status" | "timeline">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "ongoing" as "ongoing" | "completed" | "standby" | "planned",
    client: "",
    category: "TMA" as "TMA" | "Regie" | "Forfait" | "Other",
    location: "Local" as "Local" | "Offshore" | "Hybrid",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
    progress: 0,
    manager: { name: "", id: 0, avatar: "" },
    team: [] as Array<{id: number, name: string, avatar?: string, role?: string}>,
  });
  const [projects, setProjects] = useState(projectsData);
  
  const filteredProjects = projects.filter((project) => {
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
  const clients = Array.from(new Set(projects.map(project => project.client)));
  const categories = Array.from(new Set(projects.map(project => project.category)));
  const locations = Array.from(new Set(projects.map(project => project.location)));
  
  // Get data for status chart
  const statusChartData = () => {
    const statusCounts: Record<string, number> = {};
    
    projects.forEach(project => {
      if (statusCounts[project.status]) {
        statusCounts[project.status]++;
      } else {
        statusCounts[project.status] = 1;
      }
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };
  
  // Get data for category chart
  const categoryChartData = () => {
    const categoryCounts: Record<string, number> = {};
    
    projects.forEach(project => {
      if (categoryCounts[project.category]) {
        categoryCounts[project.category]++;
      } else {
        categoryCounts[project.category] = 1;
      }
    });
    
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  };
  
  // Get data for timeline chart
  const timelineChartData = () => {
    const monthlyData: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${d.getMonth() + 1}/${d.getFullYear()}`;
      monthlyData[monthYear] = 0;
    }
    
    // Count projects by start date
    projects.forEach(project => {
      if (project.startDate) {
        const date = new Date(project.startDate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        // Only count if it's within the last 12 months
        if (monthlyData[monthYear] !== undefined) {
          monthlyData[monthYear]++;
        }
      }
    });
    
    return Object.entries(monthlyData).map(([name, value]) => ({ name, value }));
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleAddProject = () => {
    if (!newProject.name || !newProject.client) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const newId = Math.max(...projects.map(project => project.id)) + 1;
    const completeProject: ProjectData = {
      ...newProject,
      id: newId,
      status: newProject.status,
      category: newProject.category,
      location: newProject.location,
      team: [],
    };

    setProjects([completeProject, ...projects]);
    setIsAddDialogOpen(false);
    setNewProject({
      name: "",
      description: "",
      status: "ongoing",
      client: "",
      category: "TMA",
      location: "Local",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
      progress: 0,
      manager: { name: "", id: 0, avatar: "" },
      team: [],
    });
    toast.success("Projet ajouté avec succès");
  };
  
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
                  className={currentView === "grid" ? "bg-accent" : ""}
                  onClick={() => {
                    setCurrentView("grid");
                    setViewMode("grid");
                  }}
                >
                  <LayoutGridIcon className="h-4 w-4 mr-2" />
                  Cartes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "chart" ? "bg-accent" : ""}
                  onClick={() => setCurrentView("chart")}
                >
                  <BarChart2Icon className="h-4 w-4 mr-2" />
                  Par catégorie
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "status" ? "bg-accent" : ""}
                  onClick={() => setCurrentView("status")}
                >
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Par statut
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "timeline" ? "bg-accent" : ""}
                  onClick={() => setCurrentView("timeline")}
                >
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Chronologie
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 mb-6">
              <div className="relative flex-1 md:flex-initial md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des projets..."
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
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="ongoing">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="standby">En attente</SelectItem>
                    <SelectItem value="planned">Planifié</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Building className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous clients</SelectItem>
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
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
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
                    <SelectValue placeholder="Localisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes localisations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(currentView === "grid" || currentView === "table") && (
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
                )}
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouveau projet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau projet</DialogTitle>
                      <DialogDescription>
                        Veuillez remplir les informations pour créer un nouveau projet
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nom du projet *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Nom du projet"
                          className="col-span-3"
                          value={newProject.name}
                          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          placeholder="Description du projet"
                          className="col-span-3"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="client" className="text-right">
                          Client *
                        </Label>
                        <Input
                          id="client"
                          placeholder="Nom du client"
                          className="col-span-3"
                          value={newProject.client}
                          onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Catégorie
                        </Label>
                        <Select
                          value={newProject.category}
                          onValueChange={(val: "TMA" | "Regie" | "Forfait" | "Other") => setNewProject({ ...newProject, category: val })}
                        >
                          <SelectTrigger id="category" className="col-span-3">
                            <SelectValue placeholder="Catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TMA">TMA</SelectItem>
                            <SelectItem value="Forfait">Forfait</SelectItem>
                            <SelectItem value="Regie">Régie</SelectItem>
                            <SelectItem value="Other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Statut
                        </Label>
                        <Select
                          value={newProject.status}
                          onValueChange={(val: "ongoing" | "completed" | "standby" | "planned") => setNewProject({ ...newProject, status: val })}
                        >
                          <SelectTrigger id="status" className="col-span-3">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ongoing">En cours</SelectItem>
                            <SelectItem value="completed">Terminé</SelectItem>
                            <SelectItem value="standby">En attente</SelectItem>
                            <SelectItem value="planned">Planifié</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Localisation
                        </Label>
                        <Select
                          value={newProject.location}
                          onValueChange={(val: "Local" | "Offshore" | "Hybrid") => setNewProject({ ...newProject, location: val })}
                        >
                          <SelectTrigger id="location" className="col-span-3">
                            <SelectValue placeholder="Localisation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Local">Local</SelectItem>
                            <SelectItem value="Offshore">Offshore</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">
                          Date de début
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          className="col-span-3"
                          value={newProject.startDate}
                          onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">
                          Date de fin
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          className="col-span-3"
                          value={newProject.endDate}
                          onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="progress" className="text-right">
                          Progression (%)
                        </Label>
                        <Input
                          id="progress"
                          type="number"
                          min="0"
                          max="100"
                          className="col-span-3"
                          value={newProject.progress}
                          onChange={(e) => setNewProject({ ...newProject, progress: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="manager" className="text-right">
                          Chef de projet
                        </Label>
                        <Input
                          id="manager"
                          placeholder="Nom du chef de projet"
                          className="col-span-3"
                          value={newProject.manager.name}
                          onChange={(e) => setNewProject({ 
                            ...newProject, 
                            manager: { 
                              ...newProject.manager,
                              name: e.target.value,
                              id: newProject.manager.id || Math.floor(Math.random() * 1000)
                            } 
                          })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddProject}>
                        Ajouter le projet
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {(currentView === "grid" || currentView === "table") && (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} viewMode={viewMode} />
                ))}
                
                {filteredProjects.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-lg font-medium">Aucun projet trouvé</p>
                    <p className="text-muted-foreground">
                      Essayez d'ajuster votre recherche ou vos filtres
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {currentView === "chart" && (
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-bold mb-4">Répartition par catégorie</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} projets`, 'Nombre']} />
                        <Legend />
                        <Bar dataKey="value" name="Nombre de projets" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentView === "status" && (
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-bold mb-4">Répartition par statut</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={140}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} projets`, 'Nombre']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentView === "timeline" && (
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-bold mb-4">Projets par mois de démarrage</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timelineChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} projets`, 'Nombre']} />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Nombre de projets" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-4 text-sm text-muted-foreground">
              {filteredProjects.length} projets sur {projects.length} au total
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProjectsPage;
