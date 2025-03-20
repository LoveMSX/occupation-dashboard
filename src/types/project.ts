
export interface ProjectData {
  id: number;
  name: string;
  client: string;
  status: string;
  category?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  team?: TeamMember[];
  budget?: BudgetInfo;
  manager?: ManagerInfo;
  locality?: string;
  location?: string;
  progress?: number;
}

export interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

export interface BudgetInfo {
  planned: number;
  consumed: number;
  currency: string;
}

export interface ManagerInfo {
  id: number;
  name: string;
  avatar: string;
}

export interface ProjectCardProps {
  project: ProjectData;
  viewMode?: 'grid' | 'list';
  onDelete?: () => Promise<void>;
}
