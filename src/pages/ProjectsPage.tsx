import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  PlusIcon, 
  Upload, 
  PieChartIcon, 
  BarChart3, 
  Library,
  Filter,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  Users,
  MoreHorizontal,
  Edit,
  Trash,
  SortAsc,
  SortDesc
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { projectApi, ProjectRequest, Project } from "@/services/api";
import { ProjectCSVImportForm } from "@/components/import/ProjectCSVImportForm";
import { Chart } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { employeeApi } from "@/services/api";
import { Link } from "react-router-dom";
import { GSheetSync } from "@/components/import/GSheetSync";
import { gsheetApi } from "@/services/api/gsheetApi";
import { logWithTimestamp } from "@/utils/logger";

// Calculate project progress based on start and end dates
const calculateProgress = (startDate: string | undefined, endDate: string | undefined): number => {
  if (!startDate || !endDate) return 0;

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end.getTime() - start.getTime();
  const progress = now.getTime() - start.getTime();
  return Math.round((progress / total) * 100);
};

type SortField = 'name' | 'client' | 'startDate' | 'progress';
type SortOrder = 'asc' | 'desc';

interface SortOption {
  field: SortField;
  label: string;
}

interface FilterOptions {
  status: string[];
  category: string[];
  location: string[];
}

const ProjectsPage = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [newProject, setNewProject] = useState<ProjectRequest>({
    nom_projet: "",
    client: "",
    statut: "ongoing",
    categorie_projet: "TMA",
    localite: "Local",
    date_debut: new Date().toISOString().split("T")[0],
    date_fin_prevu: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
    description_bc: "",
    tjm: "0",
    charge_vendu_jours: "0",
    cp: "",
    bu: "MSX"
  });

  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    category: [],
    location: []
  });

  const sortOptions: SortOption[] = [
    { field: 'name', label: 'Project Name' },
    { field: 'client', label: 'Client' },
    { field: 'startDate', label: 'Start Date' },
    { field: 'progress', label: 'Progress' }
  ];

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleGSheetSync = async (spreadsheetId: string) => {
    try {
      const result = await gsheetApi.syncProjects(spreadsheetId);
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.success('Synchronisation des projets réussie');
      }
    } catch (error) {
      window.console.error('Project sync error:', error);
      toast.error('Erreur lors de la synchronisation des projets');
      throw error;
    }
  };

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const data = await projectApi.getAllProjects();
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid projects data received');
        }
        return data.map(project => ({
          ...project,
          progress: calculateProgress(project.startDate || new Date().toISOString(), project.endDate || new Date().toISOString()),
          category: project.category as "TMA" | "Regie" | "Forfait" | "Other",
          location: project.location === "Midshore" ? "Hybrid" : (project.location as "Local" | "Offshore" | "Hybrid"),
          manager: {
            id: project.projectManager ? parseInt(project.projectManager) : 0,
            name: project.projectManager || "Unknown Manager",
            avatar: undefined
          },
          team: []
        }));
      } catch (err) {
        console.error('Error fetching projects:', err);
        return [];
      }
    }
  });

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error loading projects: {error.message}</div>;
  }

  const addProjectMutation = useMutation({
    mutationFn: (project: ProjectRequest) => projectApi.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project added successfully');
      setIsAddDialogOpen(false);
      setNewProject({
        nom_projet: "",
        client: "",
        statut: "ongoing",
        categorie_projet: "TMA",
        localite: "Local",
        date_debut: new Date().toISOString().split("T")[0],
        date_fin_prevu: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
        description_bc: "",
        tjm: "0",
        charge_vendu_jours: "0",
        cp: "",
        bu: "MSX"
      });
    },
    onError: (error) => {
      toast.error(`Error adding project: ${error.message}`);
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => projectApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    }
  });

  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const handleAddProject = () => {
    if (!newProject.nom_projet || !newProject.client) {
      toast.error("Please fill in required fields");
      return;
    }
    addProjectMutation.mutate(newProject);
  };

  const handleDelete = (projectId: number) => {
    setProjectToDelete(projectId);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete);
      setProjectToDelete(null);
    }
  };

  const handleFilterChange = (type: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  // Memoized sorting function
  const sortProjects = useCallback((projects: Project[], field: SortField, order: SortOrder) => {
    return [...projects].sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'client':
          comparison = (a.client || '').localeCompare(b.client || '');
          break;
        case 'startDate': {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        }
        case 'progress': {
          const progressA = a.progress || 0;
          const progressB = b.progress || 0;
          comparison = progressA - progressB;
          break;
        }
        default:
          comparison = 0;
      }
      return order === 'asc' ? comparison : -comparison;
    });
  }, []);

  // Memoized filtering function
  const filterProjects = useCallback((projects: Project[], searchTerm: string, filters: FilterOptions) => {
    return projects.filter(project => {
      const matchesSearch = 
        (project.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (project.client?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filters.status.length === 0 || 
        (project.status && filters.status.includes(project.status));
      
      const matchesCategory = 
        filters.category.length === 0 || 
        (project.category && filters.category.includes(project.category));
      
      const matchesLocation = 
        filters.location.length === 0 || 
        (project.location && filters.location.includes(project.location));

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
    });
  }, []);

  // Move the employees query before any hooks that depend on it
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getAllEmployees
  });

  // Move the getProjectTeam function definition after employees is defined
  const getProjectTeam = useCallback((projectId: number) => {
    return employees.filter(employee => 
      employee.projects?.some(project => project.id === projectId)
    );
  }, [employees]);

  // Then use the existing useMemo hook without the team mapping
  const processedProjects = useMemo(() => {
    const filtered = filterProjects(projects, searchTerm, filters);
    return sortProjects(filtered, sortField, sortOrder);
  }, [projects, searchTerm, filters, sortField, sortOrder, filterProjects, sortProjects]);

  // Calculate analytics
  const analytics = useMemo(() => {
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'ongoing').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      averageProgress: Math.round(
        projects.reduce((acc, p) => acc + (p.progress || 0), 0) / (projects.length || 1)
      ),
      categoryDistribution: projects.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      locationDistribution: projects.reduce((acc, p) => {
        acc[p.location] = (acc[p.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [projects]);

  // Add Filter Dropdown Component
  const FilterDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        {['ongoing', 'completed', 'planned', 'standby'].map(status => (
          <DropdownMenuItem key={status} onSelect={() => handleFilterChange('status', status)}>
            <input
              type="checkbox"
              checked={filters.status.includes(status)}
              className="mr-2"
              readOnly
              aria-label={`Filter by ${status} status`}
            />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
        {['TMA', 'Regie', 'Forfait', 'Other'].map(category => (
          <DropdownMenuItem key={category} onSelect={() => handleFilterChange('category', category)}>
            <input
              type="checkbox"
              checked={filters.category.includes(category)}
              className="mr-2"
              readOnly
              aria-label={`Filter by ${category} category`}
            />
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Add Sort Dropdown Component
  const SortDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {sortOrder === 'asc' ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[
          { field: 'name' as const, label: 'Project Name' },
          { field: 'client' as const, label: 'Client' },
          { field: 'startDate' as const, label: 'Start Date' },
          { field: 'progress' as const, label: 'Progress' },
        ].map(({ field, label }) => (
          <DropdownMenuItem key={field} onSelect={() => handleSortChange(field)}>
            {label}
            {sortField === field && (
              <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = Math.ceil(processedProjects.length / itemsPerPage);

  // Composant pour afficher la liste de l'équipe
  interface ProjectEmployeeResponse {
    id: number;
    name: string;
    position?: string;
    avatar?: string;
  }

  interface Employee {
    id: number;
    name: string;
    position?: string;
    avatar?: string;
  }

  const TeamList = ({ projectId }: { projectId: number }) => {
    // Get all employees first
    const { data: allEmployees = [] } = useQuery<Employee[]>({
      queryKey: ['employees'],
      queryFn: () => employeeApi.getAllEmployees()
    });

    // Get project team members
    const { data: teamMappings = [], isLoading } = useQuery<ProjectEmployeeResponse[]>({
      queryKey: ['project-team', projectId],
      queryFn: async () => {
        try {
          const response = await projectApi.getProjectEmployees(projectId);
          return response.map(emp => ({
            id: emp.id,
            name: emp.name || '',
            position: emp.position,
            avatar: emp.avatar
          }));
        } catch (error) {
          console.error(`Error fetching project team: ${error}`);
          return [];
        }
      }
    });

    // Map team members to employee details
    const teamMembers = useMemo(() => {
      return teamMappings
        .map(mapping => allEmployees.find(emp => emp.id === mapping.id))
        .filter((emp): emp is Employee => !!emp); // Remove any undefined values
    }, [teamMappings, allEmployees]);
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Équipe du projet (ID: {projectId})</h3>
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Chargement des membres de l'équipe...</p>
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{member.name}</p>
                  {member.position && (
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">Aucun membre dans l'équipe</p>
          </div>
        )}
      </div>
    );
  };

  // Modification du menu d'options du ProjectCard pour inclure l'équipe
  const ProjectOptionsMenu = ({ project, onDelete }: { project: Project; onDelete: () => void }) => {
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link to={`/projects/${project.id}`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Éditer
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsTeamDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Équipe
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onSelect={onDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>

        <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Équipe du projet {project.name} (ID: {project.id})</DialogTitle>
            </DialogHeader>
            <TeamList projectId={project.id} />
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    );
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Projects</h1>
              <div className="flex items-center gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Project</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                          id="name"
                          value={newProject.nom_projet}
                          onChange={(e) => setNewProject({ ...newProject, nom_projet: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="client">Client</Label>
                        <Input
                          id="client"
                          value={newProject.client}
                          onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProject}>
                        Add Project
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <GSheetSync pageId="projects" onSync={handleGSheetSync} />
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Import CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Import Projects</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file to import multiple projects
                      </DialogDescription>
                    </DialogHeader>
                    <ProjectCSVImportForm onClose={() => setIsImportDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <h3 className="text-2xl font-bold">{analytics.totalProjects}</h3>
                  </div>
                  <Library className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <h3 className="text-2xl font-bold">
                      {analytics.activeProjects}
                    </h3>
                  </div>
                  <PieChartIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <h3 className="text-2xl font-bold">
                      {analytics.completedProjects}
                    </h3>
                  </div>
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Progress</p>
                    <h3 className="text-2xl font-bold">
                      {analytics.averageProgress}%
                    </h3>
                  </div>
                  <PieChartIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-4">Project Status Distribution</h3>
                <div className="h-64">
                  <Chart
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                      },
                    }}
                    type="doughnut"
                    data={{ 
                      labels: ['Active', 'Completed', 'Planned', 'On Hold'],
                      datasets: [
                        {
                          label: 'Projects',
                          data: [
                            projects.filter(p => p.status === 'ongoing').length,
                            projects.filter(p => p.status === 'completed').length,
                            projects.filter(p => p.status === 'planned').length,
                            projects.filter(p => p.status === 'standby').length,
                          ],
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(255, 99, 132, 0.8)'
                          ],
                        }
                      ]
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-4">Project Categories</h3>
                <div className="h-64">
                  <Chart
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                      },
                    }}
                    type="pie"
                    data={{ 
                      labels: ['TMA', 'Regie', 'Forfait', 'Other'],
                      datasets: [
                        {
                          label: 'Projects',
                          data: [
                            projects.filter(p => p.category === 'TMA').length,
                            projects.filter(p => p.category === 'Regie').length,
                            projects.filter(p => p.category === 'Forfait').length,
                            projects.filter(p => p.category === 'Other').length,
                          ],
                          backgroundColor: [
                            'rgba(153, 102, 255, 0.8)',
                            'rgba(255, 159, 64, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(75, 192, 192, 0.8)'
                          ],
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedProjects
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      progress: calculateProgress(project.startDate, project.endDate),
                      manager: project.manager || {
                        id: 0,
                        name: "Unassigned",
                        avatar: ""
                      }
                    }}
                    onDelete={() => handleDelete(project.id)}
                  />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <AlertDialog open={projectToDelete !== null} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ThemeProvider>
  );
};

export default ProjectsPage;
