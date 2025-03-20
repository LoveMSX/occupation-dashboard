
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { projectApi, employeeApi } from "@/services/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  Clock,
  Edit,
  Trash2,
  User,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Building,
  Tag,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistance, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/components/LanguageProvider";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    client: string;
    status: string;
    category?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
    teamCount?: number;
    completionRate?: number;
    location?: string;
    manager?: string;
    tasks?: {
      name: string;
      status: string;
      assignee?: string;
      dueDate?: string;
    }[];
  };
  viewMode?: "grid" | "list";
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
  const { t } = useLanguage();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: () => projectApi.deleteProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(`${project.name} a été supprimé avec succès`);
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });

  // Query to fetch project team members
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["project-team", project.id],
    queryFn: () => projectApi.getProjectEmployees(project.id),
    enabled: isDetailsOpen, // Only fetch when the details dialog is open
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "en cours":
        return "bg-blue-500";
      case "completed":
      case "terminé":
        return "bg-green-500";
      case "on hold":
      case "en pause":
        return "bg-yellow-500";
      case "cancelled":
      case "annulé":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "en cours":
        return "default";
      case "completed":
      case "terminé":
        return "success";
      case "on hold":
      case "en pause":
        return "secondary";
      case "cancelled":
      case "annulé":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "en cours":
        return <Clock className="h-4 w-4" />;
      case "completed":
      case "terminé":
        return <CheckCircle className="h-4 w-4" />;
      case "on hold":
      case "en pause":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
      case "annulé":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (viewMode === "list") {
    return (
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-muted-foreground">{project.client}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status}
            </Badge>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>{project.teamCount || 0}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Tag className="mr-1 h-4 w-4" />
              <span>{project.category || t("other")}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarClock className="mr-1 h-4 w-4" />
              <span>
                {project.startDate
                  ? format(new Date(project.startDate), "MMM yyyy", {
                      locale: fr,
                    })
                  : t("not.specified")}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // For the dialog
  const taskStatusData = project.tasks
    ? [
        {
          name: t("completed"),
          value: project.tasks.filter((t) => t.status === "completed").length,
        },
        {
          name: t("in.progress"),
          value: project.tasks.filter((t) => t.status === "in_progress").length,
        },
        {
          name: t("pending"),
          value: project.tasks.filter((t) => t.status === "pending").length,
        },
      ]
    : [
        { name: t("completed"), value: 3 },
        { name: t("in.progress"), value: 5 },
        { name: t("pending"), value: 2 },
      ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{project.client}</span>
            </div>
            {project.category && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{project.category}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {project.teamCount
                  ? `${project.teamCount} ${
                      project.teamCount === 1
                        ? t("team.member")
                        : t("team.members")
                    }`
                  : t("no.team.members")}
              </span>
            </div>
            {project.completionRate !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("completion")}</span>
                  <span>{project.completionRate}%</span>
                </div>
                <Progress value={project.completionRate} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsDetailsOpen(true)}>
            {t("details")}
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{project.name}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="team">{t("team")}</TabsTrigger>
              <TabsTrigger value="tasks">{t("tasks")}</TabsTrigger>
              <TabsTrigger value="metrics">{t("metrics")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">{t("project.details")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("client")}:
                      </span>
                      <span>{project.client}</span>
                    </div>
                    {project.category && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("category")}:
                        </span>
                        <span>{project.category}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("status")}:
                      </span>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    {project.manager && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("manager")}:
                        </span>
                        <span>{project.manager}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("location")}:
                        </span>
                        <span>{project.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t("timeline")}</h3>
                  <div className="space-y-2">
                    {project.startDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("start.date")}:
                        </span>
                        <span>
                          {format(new Date(project.startDate), "PP", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    )}
                    {project.endDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("end.date")}:
                        </span>
                        <span>
                          {format(new Date(project.endDate), "PP", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    )}
                    {project.startDate && project.endDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("duration")}:
                        </span>
                        <span>
                          {formatDistance(
                            new Date(project.startDate),
                            new Date(project.endDate),
                            { locale: fr }
                          )}
                        </span>
                      </div>
                    )}
                    {project.budget !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("budget")}:
                        </span>
                        <span>
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(project.budget)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {project.description && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">{t("description")}</h3>
                  <p className="text-sm">{project.description}</p>
                </div>
              )}

              {project.completionRate !== undefined && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">{t("progress")}</h3>
                  <div className="flex justify-between text-sm">
                    <span>{t("completion")}</span>
                    <span>{project.completionRate}%</span>
                  </div>
                  <Progress value={project.completionRate} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="team">
              <div className="space-y-4">
                <h3 className="font-medium">{t("team.members")}</h3>
                {isLoadingTeam ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("name")}</TableHead>
                          <TableHead>{t("role")}</TableHead>
                          <TableHead>{t("department")}</TableHead>
                          <TableHead className="text-right">
                            {t("allocation")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{member.name}</span>
                            </TableCell>
                            <TableCell>{member.position}</TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell className="text-right">
                              {member.allocation || "100%"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-md border p-4 text-center text-muted-foreground">
                    {t("no.team.members.assigned")}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="space-y-4">
                <h3 className="font-medium">{t("tasks")}</h3>
                {project.tasks && project.tasks.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("task")}</TableHead>
                          <TableHead>{t("status")}</TableHead>
                          <TableHead>{t("assignee")}</TableHead>
                          <TableHead className="text-right">
                            {t("due.date")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.tasks.map((task, index) => (
                          <TableRow key={index}>
                            <TableCell>{task.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(task.status)}
                              >
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{task.assignee}</TableCell>
                            <TableCell className="text-right">
                              {task.dueDate
                                ? format(new Date(task.dueDate), "PP", {
                                    locale: fr,
                                  })
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-md border p-4 text-center text-muted-foreground">
                    {t("no.tasks.available")}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-4">{t("task.status")}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">{t("allocation")}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          Array.isArray(teamMembers) ? 
                          teamMembers.slice(0, 5).map((member) => ({
                            name: member.name.split(" ")[0],
                            allocation: member.allocation
                              ? parseInt(member.allocation)
                              : 100,
                          })) : []
                        }
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="allocation" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirm.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirm.delete.project.message").replace(
                "{name}",
                project.name
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
