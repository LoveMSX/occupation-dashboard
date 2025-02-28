
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Briefcase, Mail, Phone, MapPin, Tag, Building, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false);

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

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Fonction pour envoyer un email
  const handleSendEmail = () => {
    window.location.href = `mailto:${employee.email}`;
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
              <div className="flex items-center mr-4 cursor-pointer hover:text-primary transition-colors" onClick={handleSendEmail}>
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
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  <User className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Profil de la ressource</DialogTitle>
                  <DialogDescription>
                    Informations détaillées sur {employee.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-4 py-4">
                  <Avatar className="h-16 w-16 border-2 border-background">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback className="text-lg">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Département</p>
                    <p className="text-sm text-muted-foreground">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Localisation</p>
                    <p className="text-sm text-muted-foreground">{employee.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">{employee.phone || "Non renseigné"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date d'embauche</p>
                    <p className="text-sm text-muted-foreground">{formatDate(employee.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Manager</p>
                    <p className="text-sm text-muted-foreground">{employee.manager || "Non renseigné"}</p>
                  </div>
                </div>
                {employee.skills && employee.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Compétences</p>
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
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                    Fermer
                  </Button>
                  <Button onClick={handleSendEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    Contacter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isProjectsDialogOpen} onOpenChange={setIsProjectsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  <Briefcase className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Projets de {employee.name}</DialogTitle>
                  <DialogDescription>
                    Liste des projets actuels et passés
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    {employee.projects.length > 0 ? (
                      employee.projects.map((project) => (
                        <div key={project.id} className="flex items-start p-3 border rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium">{project.name}</h4>
                              <Badge 
                                variant={project.status === "active" ? "default" : 
                                       project.status === "completed" ? "outline" : "secondary"} 
                                className="ml-2"
                              >
                                {project.status === "active" ? "Actif" : 
                                 project.status === "completed" ? "Terminé" : "En attente"}
                              </Badge>
                            </div>
                            {project.client && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Client: {project.client}
                              </p>
                            )}
                            {project.category && (
                              <Badge variant="outline" className="mt-2">
                                {project.category}
                              </Badge>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              toast.success(`Détails du projet ${project.name} affichés`);
                            }}
                          >
                            Détails
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Aucun projet associé à cette ressource
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProjectsDialogOpen(false)}>
                    Fermer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
          <div className="flex items-center text-sm cursor-pointer hover:text-primary transition-colors" onClick={handleSendEmail}>
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
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Profil de la ressource</DialogTitle>
              <DialogDescription>
                Informations détaillées sur {employee.name}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-4 py-4">
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback className="text-lg">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Département</p>
                <p className="text-sm text-muted-foreground">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Localisation</p>
                <p className="text-sm text-muted-foreground">{employee.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">{employee.phone || "Non renseigné"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date d'embauche</p>
                <p className="text-sm text-muted-foreground">{formatDate(employee.joinDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Manager</p>
                <p className="text-sm text-muted-foreground">{employee.manager || "Non renseigné"}</p>
              </div>
            </div>
            {employee.skills && employee.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Compétences</p>
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
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                Fermer
              </Button>
              <Button onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Contacter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isProjectsDialogOpen} onOpenChange={setIsProjectsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Projets de {employee.name}</DialogTitle>
              <DialogDescription>
                Liste des projets actuels et passés
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                {employee.projects.length > 0 ? (
                  employee.projects.map((project) => (
                    <div key={project.id} className="flex items-start p-3 border rounded-md">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge 
                            variant={project.status === "active" ? "default" : 
                                   project.status === "completed" ? "outline" : "secondary"} 
                            className="ml-2"
                          >
                            {project.status === "active" ? "Actif" : 
                             project.status === "completed" ? "Terminé" : "En attente"}
                          </Badge>
                        </div>
                        {project.client && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Client: {project.client}
                          </p>
                        )}
                        {project.category && (
                          <Badge variant="outline" className="mt-2">
                            {project.category}
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          toast.success(`Détails du projet ${project.name} affichés`);
                        }}
                      >
                        Détails
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun projet associé à cette ressource
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProjectsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
