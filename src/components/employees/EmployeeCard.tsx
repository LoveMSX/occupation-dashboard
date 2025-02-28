
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Briefcase, Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  employee: {
    id: number;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    avatar?: string;
    occupancyRate: number;
    projects: { id: number; name: string; status: string }[];
  };
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
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
            <Badge variant={employee.occupancyRate >= 80 ? "default" : "outline"}>
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
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Occupancy</span>
            <span>{employee.occupancyRate}%</span>
          </div>
          <Progress 
            value={employee.occupancyRate} 
            className="h-2" 
            indicatorClassName={cn(
              employee.occupancyRate > 90 ? "bg-success" :
              employee.occupancyRate > 75 ? "bg-primary" :
              employee.occupancyRate > 50 ? "bg-warning" : "bg-danger"
            )}
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
