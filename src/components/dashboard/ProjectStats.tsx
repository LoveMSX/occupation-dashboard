
import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Briefcase, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { projectsData } from "@/data/projectsData";

export function ProjectStats() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    upcomingProjects: 0,
    ongoingPercentage: 0,
    completedPercentage: 0,
    upcomingPercentage: 0
  });

  useEffect(() => {
    // Calculer les statistiques des projets
    const total = projectsData.length;
    const ongoing = projectsData.filter(p => p.status === "ongoing").length;
    const completed = projectsData.filter(p => p.status === "completed").length;
    const standby = projectsData.filter(p => p.status === "standby").length;
    
    // Calcul des pourcentages de progression par rapport au mois dernier (simulé)
    // En réalité, ces valeurs seraient calculées en comparant avec des données historiques
    const ongoingPercentage = 5.2;
    const completedPercentage = 2.8;
    const upcomingPercentage = 3.6;
    
    setStats({
      totalProjects: total,
      ongoingProjects: ongoing,
      completedProjects: completed,
      upcomingProjects: standby,
      ongoingPercentage,
      completedPercentage,
      upcomingPercentage
    });
  }, []);

  return (
    <>
      <StatCard
        title="Total des Projets"
        value={stats.totalProjects.toString()}
        percentageChange={stats.ongoingPercentage}
        icon={<Briefcase className="h-5 w-5" />}
        variant="primary"
      />
      <StatCard
        title="Projets en Cours"
        value={stats.ongoingProjects.toString()}
        percentageChange={stats.ongoingPercentage}
        icon={<Clock className="h-5 w-5" />}
        variant="info"
      />
      <StatCard
        title="Projets Terminés"
        value={stats.completedProjects.toString()}
        percentageChange={stats.completedPercentage}
        icon={<CheckCircle className="h-5 w-5" />}
        variant="success"
      />
      <StatCard
        title="Projets en Attente"
        value={stats.upcomingProjects.toString()}
        percentageChange={stats.upcomingPercentage}
        icon={<AlertCircle className="h-5 w-5" />}
        variant="warning"
      />
    </>
  );
}
