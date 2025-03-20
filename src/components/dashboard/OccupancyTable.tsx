
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { enhancedEmployeesData } from "@/data/employeesData";
import { dashboardApi } from "@/services/api";

// Month abbreviations for headers
const MONTHS = [
  { id: "january", en: "Jan", fr: "Jan" },
  { id: "february", en: "Feb", fr: "Fév" },
  { id: "march", en: "Mar", fr: "Mar" },
  { id: "april", en: "Apr", fr: "Avr" },
  { id: "may", en: "May", fr: "Mai" },
  { id: "june", en: "Jun", fr: "Jun" },
  { id: "july", en: "Jul", fr: "Jul" },
  { id: "august", en: "Aug", fr: "Aoû" },
  { id: "september", en: "Sep", fr: "Sep" },
  { id: "october", en: "Oct", fr: "Oct" },
  { id: "november", en: "Nov", fr: "Nov" },
  { id: "december", en: "Dec", fr: "Déc" },
];

// Working days per month (typical business days)
const WORKING_DAYS = {
  jan: 22,
  feb: 20,
  mar: 23,
  apr: 21,
  may: 22,
  jun: 21,
  jul: 22,
  aug: 21,
  sep: 22,
  oct: 23,
  nov: 21,
  dec: 20,
};

// Generate allocation data based on real employees
const generateEmployeeAllocations = () => {
  return enhancedEmployeesData.slice(0, 10).map(employee => {
    // Generate random allocations for each month
    const allocations: Record<string, number> = {};
    let totalProduction = 0;
    
    // Create 1-2 random projects for each employee
    const projects = employee.projects.map(project => {
      const projectAllocations: Record<string, number> = {};
      let projectTotal = 0;
      
      MONTHS.forEach(month => {
        const monthId = month.id as keyof typeof WORKING_DAYS;
        const workingDays = WORKING_DAYS[monthId];
        // Generate a random allocation between 0.4 and 0.95 of working days
        const allocationFactor = 0.4 + Math.random() * 0.55;
        const daysAllocated = Math.floor(workingDays * allocationFactor);
        projectAllocations[monthId] = daysAllocated;
        projectTotal += daysAllocated;
      });
      
      return {
        id: project.id.toString(),
        name: project.name,
        allocations: projectAllocations,
        total: projectTotal,
        percentage: Math.round((projectTotal / getTotalWorkingDays()) * 100)
      };
    });
    
    // Calculate total production days across all projects
    projects.forEach(project => {
      totalProduction += project.total;
    });
    
    // Calculate utilization rate based on total production days
    const utilizationRate = calculateUtilization(totalProduction);
    
    return {
      id: employee.id.toString(),
      name: employee.name,
      projects,
      totalProduction,
      utilizationRate
    };
  });
};

const getTotalWorkingDays = () => {
  return Object.values(WORKING_DAYS).reduce((total, days) => total + days, 0);
};

// Calculate total allocation percentage based on working days
const calculateUtilization = (total: number) => {
  const allWorkingDays = getTotalWorkingDays();
  return Math.round((total / allWorkingDays) * 100);
};

// Generate employee allocation data
export interface OccupancyTableData {
  employeeId: number;
  employee_name: string;
  january: number,
  february: number,
  march: number,
  april: number,
  may: number,
  june: number,
  july: number,
  august: number,
  september: number,
  october: number,
  november: number,
  december: number,
  total: number
}

const employeeData = generateEmployeeAllocations();

export function OccupancyTable() {

  const { language, t } = useLanguage();

  const { getOccupancyRate } = dashboardApi;

  const [ dataOccupancyRate, setDataOccupancyRate ] = useState<OccupancyTableData[]>([]);
  
  const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({});

  const toggleEmployeeExpand = (employeeId: string) => {
    setExpandedEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const getDataTable = async ()=>{
    const result = await getOccupancyRate();
    setDataOccupancyRate(result);
  }

  useEffect(()=>{
    console.log("in occuppancy table")
    getDataTable();
  },[]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-muted/50 pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Employee Occupancy Matrix</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[200px] font-medium sticky left-0 bg-muted/30 z-10">
                  Employee / Project
                </TableHead>
                {MONTHS.map(month => (
                  <TableHead key={month.id} className="text-center whitespace-nowrap px-2">
                    {language === 'en' ? month.en : month.fr}
                    <span className="block text-xs text-muted-foreground">
                      ({WORKING_DAYS[month.id as keyof typeof WORKING_DAYS]} days)
                    </span>
                  </TableHead>
                ))}
                <TableHead className="text-right">Total</TableHead>
                {/* <TableHead className="text-right">%</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataOccupancyRate?.map(employee => (
                <>
                  <TableRow 
                    key={employee.employeeId} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleEmployeeExpand(employee.employeeId.toString())}
                  >
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      <div className="flex items-center">
                        <div className={`mr-2 transition-transform ${expandedEmployees[employee.id] ? 'rotate-90' : ''}`}>
                          ▶
                        </div>
                        {employee.employee_name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({employee.employeeId})
                        </span>
                      </div>
                    </TableCell>
                    {MONTHS.map(month => {
                      const monthId = month.id as keyof typeof WORKING_DAYS;
                      const workingDays = WORKING_DAYS[monthId];
                      const utilization = Math.ceil(employee[month.id]);
                      
                      return (
                        <TableCell 
                          key={`${employee.employeeId}-${month.id}`} 
                          className="text-center px-2"
                        >
                          <div className="flex flex-col items-center">
                            <span className={cn(
                              utilization > 100 ? "text-danger font-medium" :
                              utilization < 70 ? "text-warning" : ""
                            )}>
                              {employee.total}
                            </span>
                            <div className="w-full mt-1">
                              <Progress 
                                value={Math.min(utilization, 100)} 
                                className="h-1" 
                                indicatorClassName={cn(
                                  utilization > 100 ? "bg-danger" :
                                  utilization > 90 ? "bg-success" :
                                  utilization > 70 ? "bg-primary" : "bg-warning"
                                )}
                              />
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right font-medium">
                      {employee.total}
                    </TableCell>
                    {/* <TableCell className="text-right">
                      <span className={cn(
                        employee.utilizationRate > 95 ? "text-success font-medium" :
                        employee.utilizationRate < 80 ? "text-warning font-medium" : ""
                      )}>
                        {employee.utilizationRate}%
                      </span>
                    </TableCell> */}
                  </TableRow>
                  
                  {/* Project rows (shown when employee is expanded) */}
                  {/* {expandedEmployees[employee.id] && employee.projects.map(project => (
                    <TableRow key={`${employee.id}-${project.id}`} className="bg-muted/10">
                      <TableCell className="pl-8 sticky left-0 bg-muted/10 z-10">
                        <span className="font-medium">{project.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({project.id})
                        </span>
                      </TableCell>
                      {MONTHS.map(month => (
                        <TableCell 
                          key={`${employee.id}-${project.id}-${month.id}`} 
                          className="text-center text-muted-foreground px-2"
                        >
                          {project.allocations[month.id as keyof typeof project.allocations] || 0}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-muted-foreground">
                        {project.total}
                      </TableCell>
                      <TableCell className="text-right">
                        {project.percentage}%
                      </TableCell>
                    </TableRow>
                  ))} */}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

const fetchEmployeeOccupation = async (employeeId: number) => {
  try {
    const data = await api.getEmployeeOccupation(employeeId);
    return data || []; // Assure qu'on retourne toujours un tableau
  } catch (error) {
    window.console.error('Error fetching employee occupation:', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};
