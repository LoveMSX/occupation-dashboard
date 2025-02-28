
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Briefcase, Mail, Phone, MapPin, Tag, Building, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmployeeData {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  joinDate: string;
  manager?: string;
  skills?: string[];
  occupancyRate: number;
  projects: { 
    id: number; 
    name: string; 
    status: string;
    client?: string;
    category?: string;
  }[];
}

interface EmployeeCardProps {
  employee: EmployeeData;
  viewMode?: "grid" | "list";
}

export function EmployeeCard({ employee, viewMode = "grid" }: EmployeeCardProps) {
  // Function to determine color based on occupancy rate
  const getOccupancyColor = (rate: number) => {
    if (rate > 90) return "bg-success";
    if (rate > 75) return "bg-primary";
    if (rate > 50) return "bg-warning";
    return "bg-danger";
  };
  
  // Function to determine badge variant based on occupancy rate
  const getOccupancyBadgeVariant = (rate: number) => {
    if (rate >= 80) return "default";
    return "outline";
  };
  
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center p-4">
          <Avatar className="h-12 w-12 mr-4 border-2 border-background">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback className="text-base">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-base">{employee.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{employee.position}</span>
                  <span className="mx-1">•</span>
                  <span>{employee.department}</span>
                  {employee.location && (
                    <>
                      <span className="mx-1">•</span>
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{employee.location}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <Badge variant={getOccupancyBadgeVariant(employee.occupancyRate)}>
                  {employee.occupancyRate}% Occupied
                </Badge>
                <div className="w-32 mt-1">
                  <Progress 
                    value={employee.occupancyRate} 
                    className="h-1.5" 
                    indicatorClassName={getOccupancyColor(employee.occupancyRate)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex mt-2 text-sm">
              <div className="flex items-center mr-4">
                <Mail className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{employee.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{employee.phone}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {employee.projects.slice(0, 3).map((project) => (
                <Badge
                  key={project.id}
                  variant={project.status === "active" ? "default" : "outline"}
                  className="text-xs"
                >
                  {project.name}
                </Badge>
              ))}
              {employee.projects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{employee.projects.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="ml-4 flex">
            <Button variant="ghost" size="sm" className="h-8">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <Briefcase className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback className="text-lg">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end">
            <Badge variant={getOccupancyBadgeVariant(employee.occupancyRate)}>
              {employee.occupancyRate}% Occupied
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {employee.department}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.position}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.phone}</span>
          </div>
          {employee.location && (
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{employee.location}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Occupancy</span>
            <span>{employee.occupancyRate}%</span>
          </div>
          <Progress 
            value={employee.occupancyRate} 
            className="h-2" 
            indicatorClassName={getOccupancyColor(employee.occupancyRate)}
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Current Projects</div>
          <div className="flex flex-wrap gap-1.5">
            {employee.projects.map((project) => (
              <Badge
                key={project.id}
                variant={project.status === "active" ? "default" : "outline"}
                className="text-xs font-normal"
              >
                {project.name}
              </Badge>
            ))}
          </div>
        </div>
        
        {employee.skills && employee.skills.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {employee.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs font-normal bg-muted/50"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t p-4">
        <Button variant="ghost" size="sm" className="h-8">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <Briefcase className="mr-2 h-4 w-4" />
          Projects
        </Button>
      </CardFooter>
    </Card>
  );
}
