
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
import { enhancedEmployeesData } from "@/data/employeesData";
import { ItopEmployee } from "@/pages/Index";

type TopEmployeesProps = {
  Employees : ItopEmployee[] | undefined
}

export function TopEmployeesTable({ Employees }:TopEmployeesProps ) {
  // Trier les employés par taux d'occupation et ne garder que les 5 premiers
  const topEmployees = [...Employees || []] 
  // const tempEmployes = [...enhancedEmployeesData]
  //   .sort((a, b) => b.occupancyRate - a.occupancyRate)
  //   .slice(0, 5);

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
            {topEmployees.map((employee) => (
              <TableRow key={employee.employee_id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.employee_name)}&background=random`} 
                        alt={employee.employee_name} 
                      />
                      <AvatarFallback>{employee.employee_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {employee.employee_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {employee.position}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.projects && employee.projects.length > 0 ? (
                      employee.projects.map((project, index) => (
                        <Badge
                          key={index}
                          variant={project.statut === "active" ? "default" : 
                                  project.statut === "completed" ? "outline" : "secondary"}
                          className="text-xs font-normal"
                        >
                          {project.nom_projet}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">Aucun projet</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-medium">{parseInt(employee.average_occupancy_top)}%</span>
                    <Progress 
                      value={parseInt(employee.average_occupancy_top)} 
                      className="h-1.5 w-24" 
                      indicatorClassName={cn(
                        parseInt(employee.average_occupancy_top) > 95 ? "bg-success" :
                        parseInt(employee.average_occupancy_top) > 85 ? "bg-primary" :
                        parseInt(employee.average_occupancy_top) > 75 ? "bg-warning" : "bg-danger"
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
