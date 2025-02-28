
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, Users } from "lucide-react";
import { AvatarGroup } from "../ui/avatar-group";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description: string;
    status: "ongoing" | "completed" | "planned";
    startDate: string;
    endDate: string;
    progress: number;
    team: Array<{
      id: number;
      name: string;
      avatar?: string;
    }>;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    ongoing: "bg-success text-success-foreground",
    completed: "bg-muted text-muted-foreground",
    planned: "bg-warning text-warning-foreground",
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <Badge className={cn("capitalize", statusColors[project.status])}>
            {project.status}
          </Badge>
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
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{project.progress}% Complete</span>
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
