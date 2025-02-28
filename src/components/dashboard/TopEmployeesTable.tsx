
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data for the table
const employees = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Senior Developer",
    avatar: "https://i.pravatar.cc/150?img=1",
    occupancyRate: 98,
    projects: [
      { name: "Mobile App", status: "active" },
      { name: "API Development", status: "active" },
    ],
  },
  {
    id: 2,
    name: "Maria Garcia",
    position: "UX Designer",
    avatar: "https://i.pravatar.cc/150?img=5",
    occupancyRate: 95,
    projects: [
      { name: "Website Redesign", status: "active" },
      { name: "Mobile App", status: "active" },
    ],
  },
  {
    id: 3,
    name: "David Kim",
    position: "Project Manager",
    avatar: "https://i.pravatar.cc/150?img=3",
    occupancyRate: 92,
    projects: [
      { name: "CRM System", status: "active" },
      { name: "Website Redesign", status: "pending" },
    ],
  },
  {
    id: 4,
    name: "Sarah Chen",
    position: "Backend Developer",
    avatar: "https://i.pravatar.cc/150?img=10",
    occupancyRate: 88,
    projects: [
      { name: "API Development", status: "active" },
      { name: "Database Migration", status: "active" },
    ],
  },
  {
    id: 5,
    name: "James Wilson",
    position: "DevOps Engineer",
    avatar: "https://i.pravatar.cc/150?img=8",
    occupancyRate: 85,
    projects: [
      { name: "Infrastructure Upgrade", status: "active" },
      { name: "CI/CD Pipeline", status: "pending" },
    ],
  },
];

export function TopEmployeesTable() {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Top Performing Employees</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead className="text-right">Occupancy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {employee.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {employee.position}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.projects.map((project, index) => (
                      <Badge
                        key={index}
                        variant={project.status === "active" ? "default" : "outline"}
                        className="text-xs font-normal"
                      >
                        {project.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-medium">{employee.occupancyRate}%</span>
                    <Progress 
                      value={employee.occupancyRate} 
                      className="h-1.5 w-24" 
                      indicatorClassName={cn(
                        employee.occupancyRate > 95 ? "bg-success" :
                        employee.occupancyRate > 85 ? "bg-primary" :
                        employee.occupancyRate > 75 ? "bg-warning" : "bg-danger"
                      )}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
