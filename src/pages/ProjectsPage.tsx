import React, { useState, useEffect } from "react";
import { projectApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const handleSyncProjects = async (spreadsheetId: string) => {
  console.log("Would sync projects from spreadsheet:", spreadsheetId);
  // Use a mock promise to simulate API call
  return Promise.resolve({ success: true });
};

function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: projects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAllProjects,
  });

  const handleDeleteProject = async (id: number) => {
    try {
      await projectApi.deleteProject(id);
      toast.success("Project deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((project: any) => {
    const statusMatch = 
      activeTab === "all" || 
      (activeTab === "active" && project.status === "ongoing") ||
      (activeTab === "completed" && project.status === "completed") ||
      (activeTab === "planned" && project.status === "planned") ||
      (activeTab === "standby" && project.status === "standby");

    const searchMatch = 
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex space-x-4">
          <Button>New Project</Button>
          <Button variant="outline">Import</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-3/4">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-md border border-input px-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="md:w-1/4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
          <TabsTrigger value="standby">On Hold</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">Error loading projects.</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">No projects found.</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProjects.map((project: any) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewMode={viewMode} 
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">Error loading projects.</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">No projects found.</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProjects.filter((project: any) => project.status === "ongoing").map((project: any) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewMode={viewMode} 
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">Error loading projects.</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">No projects found.</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProjects.filter((project: any) => project.status === "completed").map((project: any) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewMode={viewMode} 
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="planned" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">Error loading projects.</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">No projects found.</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProjects.filter((project: any) => project.status === "planned").map((project: any) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewMode={viewMode} 
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="standby" className="mt-0">
          {isLoading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">Error loading projects.</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8">No projects found.</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProjects.filter((project: any) => project.status === "standby").map((project: any) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewMode={viewMode} 
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProjectsPage;
