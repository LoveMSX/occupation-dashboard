
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/LanguageProvider";
import { IRecentProject } from "@/types/dashboard";
import { formatDistanceToNow } from "date-fns";

interface RecentProjectsProps {
  projectsData: IRecentProject[];
}

export function RecentProjects({ projectsData }: RecentProjectsProps) {
  const { t } = useLanguage();

  if (!projectsData || projectsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('Recent Projects')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('No recent projects')}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'en cours':
        return 'default';
      case 'completed':
      case 'terminé':
        return 'success';
      case 'pending':
      case 'en attente':
        return 'warning';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Recent Projects')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Project')}</TableHead>
              <TableHead>{t('Client')}</TableHead>
              <TableHead>{t('Status')}</TableHead>
              <TableHead className="text-right">{t('Team')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectsData.map((project) => (
              <TableRow key={project.project_id} className="group hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="group-hover:text-primary transition-colors">
                      {project.project_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {project.start_date && formatDistanceToNow(new Date(project.start_date), { addSuffix: true })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{project.client_name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="mr-2">{project.team_count}</span>
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
