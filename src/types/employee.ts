
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
  skills: string[];
  occupancyRate: number;
  projects?: ProjectReference[];
}

export interface ProjectReference {
  id: number;
  name: string;
  status: "ongoing" | "completed" | "planned" | "standby";
}

export interface EmployeeRequest {
  appelation: string;
  poste: string;
  email: string;
  phone?: string;
  location?: string;
  date_debauche?: string;
  manager?: string;
  occupancyRate?: number;
  competences_2024?: string[];
  nom_prenoms_copie_jira?: string;
  projects?: any[];
}

export interface OccupationData {
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
