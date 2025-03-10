
import axios from 'axios';
import type { EmployeeData } from "@/components/employees/EmployeeCard";

const API_URL = "http://localhost:3000/api";

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

export interface SalesOperationRequest {
  nom_du_projet: string;
  client: string;
  date_reception: string;
  tjm?: string;
  chiffrage_jh?: string;
  statut: "en_cours" | "envoye" | "gagne" | "perdu" | "en_attente";
  commerciale?: string;
  personne_en_charge_msx?: string;
  type_projet?: string;
  remarques?: string;
  url?: string;
}

export interface SalesOperationResponse extends SalesOperationRequest {
  id: number;
  created_at: string;
  updated_at: string;
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

export const salesApi = {
  getAllSalesOperations: async (): Promise<SalesOperationResponse[]> => {
    const response = await axios.get(`${API_URL}/sales`);
    const data = response.data as SalesOperationResponse[];
    return Array.isArray(data) ? data : [data];
  },

  createSalesOperation: async (operation: SalesOperationRequest): Promise<SalesOperationResponse> => {
    const response = await axios.post(`${API_URL}/sales`, operation);
    return response.data as SalesOperationResponse;
  },

  updateSalesOperation: async (id: number, operation: Partial<SalesOperationRequest>): Promise<SalesOperationResponse> => {
    const response = await axios.patch(`${API_URL}/sales/${id}`, operation);
    return response.data as SalesOperationResponse;
  },

  deleteSalesOperation: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/sales/${id}`);
  }
};

export const employeeApi = {
  getAllEmployees: async (): Promise<EmployeeData[]> => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      const employees = Array.isArray(response.data) ? response.data : [response.data];
      
      return employees.map((emp: any) => ({
        id: emp.id,
        name: emp.appelation || emp.nom_prenoms_copie_jira || 'Unknown',
        position: emp.poste || emp.position || '',
        email: emp.email || '',
        phone: emp.phone || '',
        avatar: emp.avatar || '',
        location: emp.location || '',
        joinDate: emp.date_debauche || emp.joinDate || new Date().toISOString(),
        manager: emp.manager || '',
        skills: Array.isArray(emp.competences_2024) 
          ? emp.competences_2024 
          : typeof emp.competences_2024 === 'string'
            ? emp.competences_2024.split(',').map(s => s.trim())
            : [],
        occupancyRate: emp.occupancyRate || 0,
        projects: Array.isArray(emp.projects) ? emp.projects : []
      }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/employees/${id}`);
  },

  createEmployee: async (employee: EmployeeRequest): Promise<EmployeeData> => {
    const response = await axios.post(`${API_URL}/employees`, employee);
    return response.data as EmployeeData;
  },

  getEmployeeOccupation: (employeeId: number): Promise<OccupationData[]> => {
    return fetch(`/api/employees/${employeeId}/occupation`)
      .then(res => res.json());
  },

  getAllEmployeesOccupation: async (): Promise<OccupationData[]> => {
    const response = await axios.get(`${API_URL}/employees/occupation`);
    return response.data as OccupationData[];
  }
};

export interface ProjectRequest {
  nom_projet: string;
  client: string;
  statut: string;
  categorie_projet: string;
  localite: string;
  date_debut: string;
  date_fin_prevu: string;
  date_fin_reelle?: string;
  description_bc: string;
  tjm: string;
  charge_vendu_jours: string;
  cp: string;
  technologie?: string;
  secteur?: string;
  bu: string;
}

export interface Project {
  id: number;
  nom_projet: string;
  client: string;
  statut: string;
  categorie_projet: string;
  localite: string;
  date_debut: string;
  date_fin_prevu: string;
  date_fin_reelle?: string;
  description_bc: string;
  tjm: string;
  charge_vendu_jours: string;
  cp: string;
  bu: string;
  created_at: string;
  updated_at: string;
}

export const projectApi = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await axios.get(`${API_URL}/projects`);
    return Array.isArray(response.data) ? response.data : [response.data];
  },
  createProject: async (project: ProjectRequest): Promise<Project> => {
    const response = await axios.post(`${API_URL}/projects`, project);
    return response.data as Project;
  },
  deleteProject: async (id: number): Promise<void> => {
    const response = await axios.delete(`${API_URL}/projects/${id}`);
    return response.data;
  }
};
