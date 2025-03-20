
export interface EmployeeData {
  id: number;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  joinDate?: string;
  manager?: string;
  skills?: string[];
  department?: string;
  competences_2024?: string[];
  occupancyRate?: number;
  projects?: ProjectRef[];
}

// Define a type for project references within employee data
export interface ProjectRef {
  id?: number;
  name: string;
  status: string;
  client?: string;
  category?: string;
}
