import { FC } from "react";
import { Briefcase, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { IDashboardData } from "@/pages/Index";
import { StatCard } from "./StatCard";

interface ProjectStatsProps {
  data: Pick<
    IDashboardData,
    "ongoingProjects" | "totalProjects" | "completedProjects" | "upcomingProjects" | "ongoingPercentage" | "completedPercentage" | "upcomingPercentage"
  >;
}

export function ProjectStats({ data }: ProjectStatsProps) {
  const { 
    ongoingProjects, 
    totalProjects, 
    completedProjects, 
    upcomingProjects, 
    ongoingPercentage, 
    completedPercentage, 
    upcomingPercentage 
  } = data;

  return (
    <>
      <StatCard
        title="Total des Projets"
        value={totalProjects.toString()}
        icon={Briefcase}
        variant="primary"
      />
      <StatCard
        title="Projets en Cours"
        value={ongoingProjects.toString()}
        percentageChange={ongoingPercentage}
        icon={Clock}
        variant="info"
      />
      <StatCard
        title="Projets Terminés"
        value={completedProjects.toString()}
        percentageChange={completedPercentage}
        icon={CheckCircle}
        variant="success"
      />
      <StatCard
        title="Projets en Attente"
        value={upcomingProjects.toString()}
        percentageChange={upcomingPercentage}
        icon={AlertCircle}
        variant="warning"
      />
    </>
  );
}
