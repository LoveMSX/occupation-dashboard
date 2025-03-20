
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectData } from '@/types/project';
import { Calendar, User, Users, Tag, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProjectCardProps {
  project: ProjectData;
  viewMode?: 'grid' | 'list';
  onDelete?: () => Promise<void>;
}

export function ProjectCard({ project, viewMode = 'grid', onDelete }: ProjectCardProps) {
  const navigate = useNavigate();
  
  // Get project status styling
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'ongoing':
      case 'en cours':
        return { variant: 'success' as const, label: 'En cours' };
      case 'completed':
      case 'terminé':
        return { variant: 'default' as const, label: 'Terminé' };
      case 'planned':
      case 'planifié':
        return { variant: 'secondary' as const, label: 'Planifié' };
      case 'on hold':
      case 'standby':
      case 'en pause':
        return { variant: 'outline' as const, label: 'En pause' };
      case 'cancelled':
      case 'annulé':
        return { variant: 'destructive' as const, label: 'Annulé' };
      default:
        return { variant: 'outline' as const, label: status };
    }
  };
  
  const getCategoryStyles = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'tma':
        return { color: 'bg-indigo-100 text-indigo-800' };
      case 'forfait':
        return { color: 'bg-green-100 text-green-800' };
      case 'regie':
        return { color: 'bg-orange-100 text-orange-800' };
      default:
        return { color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  const status = getStatusStyles(project.status || '');
  const category = getCategoryStyles(project.category || '');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const handleViewProject = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      await onDelete();
    }
  };

  // Grid view
  if (viewMode === 'grid') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewProject}>
        <CardHeader className="p-4 bg-muted/50">
          <div className="flex justify-between items-start">
            <Badge variant={status.variant}>{status.label}</Badge>
            {project.category && (
              <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                {project.category}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base mt-2 line-clamp-2">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.client}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="mt-4 space-y-2">
            {project.startDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
              </div>
            )}
            {project.manager && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{typeof project.manager === 'string' ? project.manager : project.manager.name}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.location}</span>
              </div>
            )}
            {project.team && project.team.length > 0 && (
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.team.length} membre{project.team.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" onClick={handleViewProject}>
            Voir détails
          </Button>
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteClick}
            >
              Supprimer
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // List view
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer mb-4" onClick={handleViewProject}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={status.variant}>{status.label}</Badge>
              {project.category && (
                <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                  {project.category}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-base">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.client}</p>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            {project.startDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDate(project.startDate)}</span>
              </div>
            )}
            {project.manager && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{typeof project.manager === 'string' ? project.manager : project.manager.name}</span>
              </div>
            )}
            {project.team && project.team.length > 0 && (
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{project.team.length} membre{project.team.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleViewProject}>
              Voir
            </Button>
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteClick}
              >
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
