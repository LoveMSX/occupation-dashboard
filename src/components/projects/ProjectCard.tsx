import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, MapPin, Building, Tag, User, Users, Trash2, Loader2 } from "lucide-react";
import { AvatarGroup } from "../ui/avatar-group";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { projectApi, employeeApi } from "@/services/api";

export interface ProjectData {
  id: number;
  name: string;
  description: string;
  status: "ongoing" | "completed" | "standby" | "planned";
  client: string;
  category: "TMA" | "Regie" | "Forfait" | "Other";
  location: "Local" | "Offshore" | "Hybrid";
  startDate: string;
  endDate: string;
  progress: number;
  manager: {
    id: number;
    name: string;
    avatar?: string;
  };
  budget?: {
    planned: number;
    consumed: number;
    currency: string;
  };
  team: Array<{
    id: number;
    name: string;
    avatar?: string;
    role?: string;
  }>;
}

interface ProjectCardProps {
  project: ProjectData;
  viewMode?: "grid" | "list";
  onDelete?: () => void;
}

export function ProjectCard({ project, viewMode = "grid", onDelete }: ProjectCardProps) {
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [teamCount, setTeamCount] = useState(0);
  
  const statusColors = {
    ongoing: "bg-success text-success-foreground",
    completed: "bg-muted text-muted-foreground",
    standby: "bg-warning text-warning-foreground",
    planned: "bg-primary text-primary-foreground",
  };
  
  const categoryColors = {
    "TMA": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "Regie": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Forfait": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Other": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };
  
  const locationIcons = {
    "Local": "🏢",
    "Offshore": "🌍",
    "Midshore": "🔄",  // Changed from "Hybrid" to "Midshore"
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  // Clean query for project team members
  const { data: teamMembers = [], isLoading: isLoadingTeam } = useQuery({
    queryKey: ['project-employees', project.id],
    queryFn: () => projectApi.getProjectEmployees(project.id),
    enabled: isTeamDialogOpen,
  });

  const handleOpenTeamDialog = () => {
    setIsTeamDialogOpen(true);
  };

  if (viewMode === "list") {
    // ... existing list view code ...
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          {/* ... existing list view content ... */}
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Le projet sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <Badge className={cn("capitalize", statusColors[project.status])}>
                {project.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-y-1 gap-x-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Building className="mr-1 h-4 w-4" />
                <span>{project.client}</span>
              </div>
              <div className="flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                <Badge variant="outline" className={cn(categoryColors[project.category])}>
                  {project.category}
                </Badge>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{locationIcons[project.location]} {project.location}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {project.startDate} - {project.endDate}
            </span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{project.manager.name}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress 
            value={project.progress}
            className="h-2"
            indicatorClassName={cn(
              project.progress === 100 ? "bg-success" :
              project.progress > 70 ? "bg-primary" :
              project.progress > 30 ? "bg-warning" :
              "bg-danger"
            )}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Team ({project.team.length})</span>
          </div>
          <AvatarGroup>
            {project.team.map((member) => (
              <Avatar key={member.id} className="border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          onClick={handleOpenTeamDialog}
        >
          <Users className="mr-2 h-4 w-4" />
          Team
        </Button>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-8">
            <ExternalLink className="mr-2 h-4 w-4" />
            Details
          </Button>
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Le projet sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Équipe du projet {project.name} (ID: {project.id})
              </DialogTitle>
              <DialogDescription>
                {isLoadingTeam ? "Chargement..." : `${teamCount} membre(s) dans l'équipe`}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4">
              {isLoadingTeam ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <div className="text-sm text-center mt-2">
                    Chargement des membres de l'équipe...
                  </div>
                </div>
              ) : teamMembers.length > 0 ? (
                <div className="space-y-2">
                  {teamMembers.map((member, index) => (
                    <div 
                      key={`team-member-${member.id || index}`} 
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name ? member.name.split(" ").map(n => n[0]).join("") : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name || "Unnamed Member"}</p>
                        <p className="text-sm text-muted-foreground">{member.position || 'Team Member'}</p>
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
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
