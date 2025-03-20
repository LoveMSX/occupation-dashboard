
export interface IDashboardData {
  totalEmployees: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSales: number;
  wonSales: number;
  pendingSales: number;
  occupancyRate: number;
  ongoingProjects: number;
  upcomingProjects: number;
  completedPercentage: number;
  ongoingPercentage: number;
  upcomingPercentage: number;
  occupationOverYear: any[];
  topEmployees: ItopEmployee[];
  projectsByStatus: any[];
  projectsByType: IRateProjectCategories[];
  projectsByClient: any[];
  recentProjects: IRecentProject[];
}

export interface ItopEmployee {
  employee_id: number;
  employee_name: string;
  position: string;
  projects: {
    nom_projet: string;
    statut: string;
  }[];
  average_occupancy_top: string;
}

export interface IRateProjectCategories {
  name: string;
  value: number;
}

export interface IRecentProject {
  project_id: number;
  project_name: string;
  client_name: string;
  status: string;
  team_count: number;
  start_date: string;
  end_date: string;
}
