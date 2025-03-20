
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
  department?: string; // Added department field to fix the data errors
  competences_2024?: string[];
  occupancyRate?: number;
  projects?: {
    id?: number;
    name: string;
    status: string;
    client?: string;
    category?: string;
  }[];
}
