
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { toast } from 'sonner';
import { ProjectData } from '@/types/project';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAllProjects
  });

  const handleDeleteProject = async (id: number) => {
    try {
      await projectApi.deleteProject(id);
      toast.success('Projet supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast.error('Erreur lors de la suppression du projet');
      console.error('Error deleting project:', error);
    }
  };

  const filteredProjects = Array.isArray(projects) 
    ? projects.filter(project => {
      const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.client?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'all') return matchesSearch;
      return matchesSearch && project.status?.toLowerCase() === activeTab.toLowerCase();
    })
    : [];

  // Group projects by status
  const activeProjects = filteredProjects.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'en cours');
  const completedProjects = filteredProjects.filter(p => p.status?.toLowerCase() === 'completed' || p.status?.toLowerCase() === 'terminé');
  const plannedProjects = filteredProjects.filter(p => p.status?.toLowerCase() === 'planned' || p.status?.toLowerCase() === 'planifié');
  const onHoldProjects = filteredProjects.filter(p => p.status?.toLowerCase() === 'on hold' || p.status?.toLowerCase() === 'en pause');
  const cancelledProjects = filteredProjects.filter(p => p.status?.toLowerCase() === 'cancelled' || p.status?.toLowerCase() === 'annulé');

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Projets</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button onClick={() => navigate('/projects/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Projet
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des projets..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Liste
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                Tous <Badge className="ml-2">{filteredProjects.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                En cours <Badge className="ml-2">{activeProjects.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Terminés <Badge className="ml-2">{completedProjects.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="planned">
                Planifiés <Badge className="ml-2">{plannedProjects.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project as ProjectData} 
                  viewMode={viewMode}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="active" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project as ProjectData} 
                  viewMode={viewMode}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project as ProjectData} 
                  viewMode={viewMode}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="planned" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plannedProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project as ProjectData} 
                  viewMode={viewMode}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="on-hold" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onHoldProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project as ProjectData} 
                  viewMode={viewMode}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
