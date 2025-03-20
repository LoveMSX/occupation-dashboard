
export interface ProjectData {
  id: number;
  name: string;
  client: string;
  status: string;
  category?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  team?: any[];
  budget?: number;
  manager?: string;
  locality?: string;
}
