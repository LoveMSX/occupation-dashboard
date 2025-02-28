
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Month abbreviations for headers
const MONTHS = [
  { id: "jan", en: "Jan", fr: "Jan" },
  { id: "feb", en: "Feb", fr: "Fév" },
  { id: "mar", en: "Mar", fr: "Mar" },
  { id: "apr", en: "Apr", fr: "Avr" },
  { id: "may", en: "May", fr: "Mai" },
  { id: "jun", en: "Jun", fr: "Jun" },
  { id: "jul", en: "Jul", fr: "Jul" },
  { id: "aug", en: "Aug", fr: "Aoû" },
  { id: "sep", en: "Sep", fr: "Sep" },
  { id: "oct", en: "Oct", fr: "Oct" },
  { id: "nov", en: "Nov", fr: "Nov" },
  { id: "dec", en: "Dec", fr: "Déc" },
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

// Sample data structure based on the provided image
interface EmployeeAllocation {
  id: string;
  name: string;
  projects: EmployeeProject[];
  totalProduction: number;
  utilizationRate: number;
}

interface EmployeeProject {
  id: string;
  name: string;
  allocations: Record<string, number>; // Month -> days allocated
  total: number;
  percentage: number;
}

// Sample data structured from the image
const employeeData: EmployeeAllocation[] = [
  {
    id: "98765",
    name: "Smith, John",
    projects: [
      {
        id: "P100",
        name: "Digital Transformation",
        allocations: {
          jan: 18,
          feb: 15,
          mar: 20,
          apr: 18,
          may: 16,
          jun: 18,
          jul: 14,
          aug: 16,
          sep: 19,
          oct: 20,
          nov: 18,
          dec: 16,
        },
        total: 208,
        percentage: 80,
      },
      {
        id: "P101",
        name: "IT Infrastructure",
        allocations: {
          jan: 4,
          feb: 5,
          mar: 3,
          apr: 3,
          may: 2,
          jun: 3,
          jul: 6,
          aug: 5,
          sep: 3,
          oct: 3,
          nov: 0,
          dec: 3,
        },
        total: 40,
        percentage: 15,
      },
    ],
    totalProduction: 248,
    utilizationRate: 95,
  },
  {
    id: "34567",
    name: "Garcia, Maria",
    projects: [
      {
        id: "P102",
        name: "New CRM Implementation",
        allocations: {
          jan: 16,
          feb: 18,
          mar: 20,
          apr: 18,
          may: 18,
          jun: 16,
          jul: 8,
          aug: 16,
          sep: 19,
          oct: 18,
          nov: 15,
          dec: 12,
        },
        total: 194,
        percentage: 75,
      },
      {
        id: "P103",
        name: "Data Migration",
        allocations: {
          jan: 6,
          feb: 2,
          mar: 3,
          apr: 3,
          may: 0,
          jun: 0,
          jul: 8,
          aug: 5,
          sep: 3,
          oct: 5,
          nov: 6,
          dec: 8,
        },
        total: 49,
        percentage: 19,
      },
    ],
    totalProduction: 243,
    utilizationRate: 93,
  },
  {
    id: "45678",
    name: "Johnson, David",
    projects: [
      {
        id: "P104",
        name: "Mobile App Development",
        allocations: {
          jan: 22,
          feb: 20,
          mar: 22,
          apr: 20,
          may: 22,
          jun: 21,
          jul: 12,
          aug: 21,
          sep: 22,
          oct: 23,
          nov: 21,
          dec: 10,
        },
        total: 236,
        percentage: 90,
      },
    ],
    totalProduction: 236,
    utilizationRate: 90,
  },
  {
    id: "56789",
    name: "Chen, Li",
    projects: [
      {
        id: "P105",
        name: "UI/UX Redesign",
        allocations: {
          jan: 15,
          feb: 16,
          mar: 18,
          apr: 15,
          may: 16,
          jun: 14,
          jul: 10,
          aug: 12,
          sep: 14,
          oct: 18,
          nov: 16,
          dec: 15,
        },
        total: 179,
        percentage: 68,
      },
      {
        id: "P106",
        name: "Web Portal",
        allocations: {
          jan: 7,
          feb: 4,
          mar: 5,
          apr: 6,
          may: 6,
          jun: 5,
          jul: 4,
          aug: 5,
          sep: 6,
          oct: 5,
          nov: 5,
          dec: 5,
        },
        total: 63,
        percentage: 24,
      },
    ],
    totalProduction: 242,
    utilizationRate: 92,
  },
];

export function OccupancyTable() {
  const { language, t } = useLanguage();
  const [expandedEmployees, setExpandedEmployees] = useState<Record<string, boolean>>({});

  const toggleEmployeeExpand = (employeeId: string) => {
    setExpandedEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const getTotalWorkingDays = () => {
    return Object.values(WORKING_DAYS).reduce((total, days) => total + days, 0);
  };

  // Calculate total allocation percentage based on working days
  const calculateUtilization = (total: number) => {
    const allWorkingDays = getTotalWorkingDays();
    return Math.round((total / allWorkingDays) * 100);
  };

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
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map(employee => (
                <>
                  <TableRow 
                    key={employee.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleEmployeeExpand(employee.id)}
                  >
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      <div className="flex items-center">
                        <div className={`mr-2 transition-transform ${expandedEmployees[employee.id] ? 'rotate-90' : ''}`}>
                          ▶
                        </div>
                        {employee.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({employee.id})
                        </span>
                      </div>
                    </TableCell>
                    {MONTHS.map(month => {
                      const monthId = month.id as keyof typeof WORKING_DAYS;
                      const totalMonthAllocation = employee.projects.reduce(
                        (sum, project) => sum + (project.allocations[monthId] || 0),
                        0
                      );
                      const workingDays = WORKING_DAYS[monthId];
                      const utilization = Math.round((totalMonthAllocation / workingDays) * 100);
                      
                      return (
                        <TableCell 
                          key={`${employee.id}-${month.id}`} 
                          className="text-center px-2"
                        >
                          <div className="flex flex-col items-center">
                            <span className={cn(
                              utilization > 100 ? "text-danger font-medium" :
                              utilization < 70 ? "text-warning" : ""
                            )}>
                              {totalMonthAllocation}
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
                      {employee.totalProduction}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        employee.utilizationRate > 95 ? "text-success font-medium" :
                        employee.utilizationRate < 80 ? "text-warning font-medium" : ""
                      )}>
                        {employee.utilizationRate}%
                      </span>
                    </TableCell>
                  </TableRow>
                  
                  {/* Project rows (shown when employee is expanded) */}
                  {expandedEmployees[employee.id] && employee.projects.map(project => (
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
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
