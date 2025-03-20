
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { projectsData } from "@/data/projectsData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { IRecentProject } from "@/pages/Index";

type RecentProjectsProps = {
  projectsData : IRecentProject[] | undefined;
}
export function RecentProjects({projectsData}:RecentProjectsProps) {
  // Récupérer les 5 projets les plus récents basés sur la date de début
  const recentProjects = [...projectsData ? projectsData : []]
    // .sort((a, b) => {
    //   return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    // })
    // .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "standby":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ongoing":
        return "En cours";
      case "completed":
        return "Terminé";
      case "standby":
        return "En attente";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projets Récents</CardTitle>
        <CardDescription>Vue d'ensemble des derniers projets ajoutés</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentProjects.map((project, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{project.nom_projet}</div>
                <Badge 
                  variant="outline" 
                  className={cn("font-normal", getStatusColor(project.statut))}
                >
                  {getStatusText(project.statut)}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Client: {project.client}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Progression: {project.progression}</span>
                <span>Catégorie: {project.categorie_projet}</span>
              </div>
              <Progress value={parseInt(project.progression)} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
