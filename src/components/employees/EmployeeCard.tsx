import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical, 
  User, 
  Edit, 
  Trash2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { employeeApi, projectApi } from "@/services/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/components/LanguageProvider";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ProjectReference } from "@/types/employee";

export interface EmployeeData {
  id: number;
  name: string;
  position: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
  joinDate: string;
  manager?: string;
  nom_prenom_copie_jira?: string;
  skills?: string[];
  competences_2024?: string[];
  occupancyRate: number;
  projects?: ProjectReference[];
}

interface OccupationData {
  employee_id: number;
  project_id: number;
  january?: number;
  february?: number;
  march?: number;
  april?: number;
  may?: number;
  june?: number;
  july?: number;
  august?: number;
  september?: number;
  october?: number;
  november?: number;
  december?: number;
}

interface EmployeeCardProps {
  employee: EmployeeData;
  viewMode?: "grid" | "list";
}

const getInitials = (name: string | undefined, nom_prenom_copie_jira?: string): string => {
  if (nom_prenom_copie_jira) {
    return nom_prenom_copie_jira
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

type MonthKey = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';

export function EmployeeCard({ employee, viewMode = "grid" }: EmployeeCardProps) {
  const { t } = useLanguage();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isOccupationDialogOpen, setIsOccupationDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: number) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success(`${employee.name} a été supprimé avec succès`);
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  const { data: occupationData, isLoading: isLoadingOccupation } = useQuery<OccupationData[]>({
    queryKey: ['employee-occupation', employee.id],
    queryFn: () => employeeApi.getEmployeeOccupation(employee.id),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAllProjects(),
    enabled: isOccupationDialogOpen,
  });

  const getProjectName = (projectId: number) => {
    const project = projects?.find(p => p.id === projectId);
    return project?.name || 'N/A';
  };

  const calculateMonthTotal = (month: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december') => {
    return occupationData
      ?.reduce((sum, o) => sum + (Number(o[month]) || 0), 0) || 0;
  };

  const WORKING_DAYS = {
    january: 22,
    february: 20,
    march: 23,
    april: 21,
    may: 22,
    june: 21,
    july: 22,
    august: 21,
    september: 22,
    october: 23,
    november: 21,
    december: 20,
  };

  const calculateTotalOccupancyRate = () => {
    if (!occupationData) return 0;

    const totalAllocatedDays = [
      'january', 'february', 'march', 'april',
      'may', 'june', 'july', 'august',
      'september', 'october', 'november', 'december'
    ].reduce((total, month) => total + calculateMonthTotal(month as MonthKey), 0);

    const totalWorkingDays = Object.values(WORKING_DAYS).reduce((sum, days) => sum + days, 0);
    
    return Math.round((totalAllocatedDays / totalWorkingDays) * 100);
  };

  const occupancyRate = calculateTotalOccupancyRate();

  const occupationDialog = (
    <Dialog open={isOccupationDialogOpen} onOpenChange={setIsOccupationDialogOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('employee.occupation').replace('{name}', employee.name)}</DialogTitle>
        </DialogHeader>
        {isLoadingOccupation ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('project')}</TableHead>
                  <TableHead>Jan</TableHead>
                  <TableHead>Fév</TableHead>
                  <TableHead>Mar</TableHead>
                  <TableHead>Avr</TableHead>
                  <TableHead>Mai</TableHead>
                  <TableHead>Jun</TableHead>
                  <TableHead>Jul</TableHead>
                  <TableHead>Aoû</TableHead>
                  <TableHead>Sep</TableHead>
                  <TableHead>Oct</TableHead>
                  <TableHead>Nov</TableHead>
                  <TableHead>Déc</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occupationData?.filter(occupation => occupation.employee_id === employee.id)
                  .map((occupation) => (
                    <TableRow key={`${employee.id}-${occupation.project_id}`}>
                      <TableCell className="font-medium">
                        {getProjectName(occupation.project_id)}
                      </TableCell>
                      <TableCell>{occupation.january || 0}</TableCell>
                      <TableCell>{occupation.february || 0}</TableCell>
                      <TableCell>{occupation.march || 0}</TableCell>
                      <TableCell>{occupation.april || 0}</TableCell>
                      <TableCell>{occupation.may || 0}</TableCell>
                      <TableCell>{occupation.june || 0}</TableCell>
                      <TableCell>{occupation.july || 0}</TableCell>
                      <TableCell>{occupation.august || 0}</TableCell>
                      <TableCell>{occupation.september || 0}</TableCell>
                      <TableCell>{occupation.october || 0}</TableCell>
                      <TableCell>{occupation.november || 0}</TableCell>
                      <TableCell>{occupation.december || 0}</TableCell>
                    </TableRow>
                  ))}
                <TableRow className="font-medium bg-muted/50">
                  <TableCell>{t('total')}</TableCell>
                  <TableCell>{calculateMonthTotal('january')}</TableCell>
                  <TableCell>{calculateMonthTotal('february')}</TableCell>
                  <TableCell>{calculateMonthTotal('march')}</TableCell>
                  <TableCell>{calculateMonthTotal('april')}</TableCell>
                  <TableCell>{calculateMonthTotal('may')}</TableCell>
                  <TableCell>{calculateMonthTotal('june')}</TableCell>
                  <TableCell>{calculateMonthTotal('july')}</TableCell>
                  <TableCell>{calculateMonthTotal('august')}</TableCell>
                  <TableCell>{calculateMonthTotal('september')}</TableCell>
                  <TableCell>{calculateMonthTotal('october')}</TableCell>
                  <TableCell>{calculateMonthTotal('november')}</TableCell>
                  <TableCell>{calculateMonthTotal('december')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const getOccupancyColor = (rate: number) => {
    if (rate > 90) return "bg-success";
    if (rate > 75) return "bg-primary";
    if (rate > 50) return "bg-warning";
    return "bg-danger";
  };
  
  const getOccupancyBadgeVariant = (rate: number) => {
    if (rate >= 80) return "default";
    return "outline";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${employee.email}`;
  };

  const handleDeleteEmployee = () => {
    deleteEmployeeMutation.mutate(employee.id);
  };

  const handleEditEmployee = () => {
    setIsEditDialogOpen(true);
  };
  
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center p-4">
          <Avatar className="h-12 w-12 mr-4 border-2 border-background">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback>
              {getInitials(employee.name, employee.nom_prenom_copie_jira)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
              <Badge variant={getOccupancyBadgeVariant(occupancyRate)}>
                {isLoadingOccupation ? "..." : `${occupancyRate}%`}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const occupationButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsOccupationDialogOpen(true)}
    >
      <Calendar className="h-4 w-4 mr-2" />
      {t('occupation')}
    </Button>
  );

  const deleteDialog = (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirm.delete.message').replace('{name}', employee.name)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteEmployee}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <>
      <Card>
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <Avatar>
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback>
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <Badge variant={getOccupancyBadgeVariant(occupancyRate)}>
              {isLoadingOccupation ? "..." : `${occupancyRate}%`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.position}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <span className="text-sm">{t('email')}: {employee.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              <span className="text-sm">{t('phone')}: {employee.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span className="text-sm">{t('location')}: {employee.location}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleEditEmployee}>
              <Edit className="mr-2 h-4 w-4" />
              {t('edit')}
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('delete')}
            </Button>
            {occupationButton}
          </div>
        </CardFooter>
      </Card>
      {occupationDialog}
      {deleteDialog}
    </>
  );
}

const calculateSkillsSummary = (employees: EmployeeData[]) => {
  const skillCounts: Record<string, number> = {};
  
  employees.forEach(employee => {
    employee.competences_2024?.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  
  return Object.entries(skillCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export function SkillsSummaryPanel({ employees }: { employees: EmployeeData[] }) {
  const { t } = useLanguage();
  const skillsData = calculateSkillsSummary(employees);

  return (
    <Card className="p-4">
      <CardContent className="pt-4">
        <h2 className="text-xl font-bold mb-4">{t('skills.summary')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {skillsData.map((skill, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground">
                  {skill.value} {t('resources')}
                </span>
              </div>
            ))}
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {skillsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} ${t('resources')}`, t('count')]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
