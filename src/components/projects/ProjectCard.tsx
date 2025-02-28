
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, MapPin, Building, Tag, User, Users } from "lucide-react";
import { AvatarGroup } from "../ui/avatar-group";
import { cn } from "@/lib/utils";

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
}

export function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
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
    "Hybrid": "🔄",
  };
  
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <Badge className={cn("capitalize", statusColors[project.status])}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center mt-1 space-x-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{project.client}</span>
                  <span className="text-muted-foreground">•</span>
                  <Tag className="h-4 w-4" />
                  <Badge variant="outline" className={cn(categoryColors[project.category])}>
                    {project.category}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{locationIcons[project.location]} {project.location}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                  {project.description}
                </p>
              </div>
              <div className="hidden md:flex space-x-2">
                <AvatarGroup>
                  {project.team.slice(0, 3).map((member) => (
                    <Avatar key={member.id} className="border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <Avatar className="border-2 border-background">
                      <AvatarFallback>+{project.team.length - 3}</AvatarFallback>
                    </Avatar>
                  )}
                </AvatarGroup>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-4 gap-4">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {project.startDate} - {project.endDate}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{project.progress}% Complete</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Manager: {project.manager.name}</span>
              </div>
            </div>
          </div>
          <div className="p-4 md:w-48 flex md:flex-col justify-between border-t md:border-t-0 md:border-l">
            <div className="space-y-2 w-full">
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
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4">
              <Button variant="ghost" size="sm" className="h-8 justify-start">
                <Users className="mr-2 h-4 w-4" />
                Team
              </Button>
              <Button variant="ghost" size="sm" className="h-8 justify-start">
                <ExternalLink className="mr-2 h-4 w-4" />
                Details
              </Button>
            </div>
          </div>
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
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t p-4">
        <Button variant="ghost" size="sm" className="h-8">
          <Users className="mr-2 h-4 w-4" />
          Team
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <ExternalLink className="mr-2 h-4 w-4" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
