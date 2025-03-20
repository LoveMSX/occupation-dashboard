
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import config from '@/config';

// Fix the isAxiosError check
if (axios.isAxiosError && axios.isAxiosError(error)) {
  window.console.error('Response data:', error.response?.data);
  window.console.error('Status:', error.response?.status);
}

// Create a standard API client
const API_URL = config.apiUrl;
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: config.apiTimeout || 30000
});

// Add API response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is an Axios error
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      window.console.error('API Error Response:', error.response?.data);
      window.console.error('Status:', error.response?.status);
    } else {
      window.console.error('Unexpected error:', error);
    }
    return Promise.reject(error);
  }
);

// Type Definitions
export interface EmployeeRequest {
  appelation: string;
  poste: string;
  email: string;
  phone: string;
  competences_2024: string[];
  nom_prenoms_copie_jira: string;
  location: string;
  date_debauche: string;
  manager: string;
  occupancyRate: number;
  projects: any[]; // Replace with proper project type when available
}

export interface ProjectRequest {
  nom_projet: string;
  client: string;
  statut: string;
  categorie_projet: string;
  localite: string;
  date_debut: string;
  date_fin_prevu: string;
  date_fin_reelle?: string | null;
  description_bc: string;
  description_projet: string;
  charge_projet: number;
  nombre_jours_vendus: number;
  budget: number;
  manager: string;
  bu: string;
}

export interface SalesOperationRequest {
  nom_du_projet: string;
  client: string;
  date_reception: string;
  tjm: number;
  chiffrage_jh: number;
  statut: 'en_cours' | 'envoye' | 'gagne' | 'perdu' | 'en_attente';
  commerciale: string;
  personne_en_charge_msx: string;
  type_projet: string;
  remarques: string;
  url: string;
}

export interface ResourceRequest {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  statut: string;
  poste: string;
  bu: string;
  niveau: string;
  date_entree: string;
  date_sortie?: string;
  manager: string;
  client_actuel: string;
  projet_actuel: string;
  tjm: number;
  disponibilite: string;
  remarques: string;
  commentaire: string;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  category?: string;
  team?: any[];
}

export interface OccupationData {
  id: number;
  employee_id: number;
  project_id: number;
  start_date: string;
  end_date: string;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  occupancyRate: number;
}

export interface SalesOperationResponse {
  id: number;
  nom_du_projet: string;
  client: string;
  date_reception: string;
  tjm: number;
  chiffrage_jh: number;
  statut: 'en_cours' | 'envoye' | 'gagne' | 'perdu' | 'en_attente';
  commercial: string;
  personne_en_charge_msx: string;
  type_projet: string;
  remarques: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface IDashboardData {
  totalEmployees: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSales: number;
  wonSales: number;
  pendingSales: number;
  occupancyRate: number;
}

// Employee API
export const employeeApi = {
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  getEmployeeById: async (id: number) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      return null;
    }
  },

  createEmployee: async (employee: EmployeeRequest) => {
    try {
      const response = await api.post('/employees', employee);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  updateEmployee: async (id: number, employee: Partial<EmployeeRequest>) => {
    try {
      const response = await api.put(`/employees/${id}`, employee);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }
  },

  deleteEmployee: async (id: number) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error);
      throw error;
    }
  },

  getEmployeeOccupation: async (employeeId: number) => {
    try {
      const response = await api.get(`/occupation/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching occupation for employee ${employeeId}:`, error);
      return [];
    }
  },
};

// Project API
export const projectApi = {
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  getProjectById: async (id: number) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  },

  createProject: async (project: ProjectRequest) => {
    try {
      const response = await api.post('/projects', project);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (id: number, project: Partial<ProjectRequest>) => {
    try {
      const response = await api.put(`/projects/${id}`, project);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  },
  
  getProjectEmployees: async (projectId: number) => {
    try {
      const response = await api.get(`/projects/${projectId}/employees`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employees for project ${projectId}:`, error);
      return [];
    }
  },
};

// Sales API
export const salesApi = {
  getAllSalesOperations: async () => {
    try {
      const response = await api.get('/sales');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales operations:', error);
      return [];
    }
  },

  getSalesOperationById: async (id: number) => {
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sales operation ${id}:`, error);
      return null;
    }
  },

  createSalesOperation: async (salesOperation: SalesOperationRequest) => {
    try {
      const response = await api.post('/sales', salesOperation);
      return response.data;
    } catch (error) {
      console.error('Error creating sales operation:', error);
      throw error;
    }
  },

  updateSalesOperation: async (id: number, salesOperation: Partial<SalesOperationRequest>) => {
    try {
      const response = await api.put(`/sales/${id}`, salesOperation);
      return response.data;
    } catch (error) {
      console.error(`Error updating sales operation ${id}:`, error);
      throw error;
    }
  },

  deleteSalesOperation: async (id: number) => {
    try {
      const response = await api.delete(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting sales operation ${id}:`, error);
      throw error;
    }
  },
};

// Resource API
export const resourceApi = {
  getAllResources: async () => {
    try {
      const response = await api.get('/resources');
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  },

  getResourceById: async (id: number) => {
    try {
      const response = await api.get(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource ${id}:`, error);
      return null;
    }
  },
  
  createResource: async (resource: ResourceRequest) => {
    try {
      const response = await api.post('/resources', resource);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },
  
  updateResource: async (id: number, resource: Partial<ResourceRequest>) => {
    try {
      const response = await api.put(`/resources/${id}`, resource);
      return response.data;
    } catch (error) {
      console.error(`Error updating resource ${id}:`, error);
      throw error;
    }
  },
  
  deleteResource: async (id: number) => {
    try {
      const response = await api.delete(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting resource ${id}:`, error);
      throw error;
    }
  },
};

// Dashboard API
export const dashboardApi = {
  getGloabalData: async (): Promise<IDashboardData> => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        totalEmployees: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalSales: 0,
        wonSales: 0,
        pendingSales: 0,
        occupancyRate: 0
      };
    }
  },

  getOccupancyRate: async () => {
    try {
      const response = await api.get('/dashboard/occupancy');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching occupancy rate:', error);
      return [];
    }
  },

  getEmployeeOccupation: async (employeeId: number) => {
    try {
      const response = await api.get(`/occupation/employee/${employeeId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching occupation for employee ${employeeId}:`, error);
      return [];
    }
  }
};

// Health API for system status checks
export const healthApi = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      return { status: 'error' };
    }
  }
};

export default api;
