import axios from 'axios';
import config from '@/config';

// Create a standard API client
const API_URL = config.apiUrl;
const api = axios.create({
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
    // Check if the error is from axios
    if (error && error.response) {
      console.error('API Error Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    } else {
      console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
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
  tjm?: number;
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
  tjm?: number;
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
  utilizationRate: number;
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

// Employee API
export const employeeApi = {
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error instanceof Error ? error.message : String(error));
      return [];
    }
  },

  getEmployeeById: async (id: number) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  },

  createEmployee: async (employee: EmployeeRequest) => {
    try {
      const response = await api.post('/employees', employee);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  updateEmployee: async (id: number, employee: Partial<EmployeeRequest>) => {
    try {
      const response = await api.put(`/employees/${id}`, employee);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  deleteEmployee: async (id: number) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  getEmployeeOccupation: async (employeeId: number) => {
    try {
      const response = await api.get(`/occupation/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching occupation for employee ${employeeId}:`, error instanceof Error ? error.message : String(error));
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
      console.error('Error fetching projects:', error instanceof Error ? error.message : String(error));
      return [];
    }
  },

  getProjectById: async (id: number) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  },

  createProject: async (project: ProjectRequest) => {
    try {
      const response = await api.post('/projects', project);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  updateProject: async (id: number, project: Partial<ProjectRequest>) => {
    try {
      const response = await api.put(`/projects/${id}`, project);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  },
  
  getProjectEmployees: async (projectId: number) => {
    try {
      const response = await api.get(`/projects/${projectId}/employees`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employees for project ${projectId}:`, error instanceof Error ? error.message : String(error));
      return [];
    }
  },
};

// Sales API
export const salesApi = {
  getAllSalesOperations: async () => {
    try {
      const response = await api.get('/sales');
      return response.data as SalesOperationResponse[];
    } catch (error) {
      console.error('Error fetching sales operations:', error instanceof Error ? error.message : String(error));
      return [];
    }
  },

  getSalesOperationById: async (id: number) => {
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sales operation ${id}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  },

  createSalesOperation: async (salesOperation: SalesOperationRequest) => {
    try {
      const response = await api.post('/sales', salesOperation);
      return response.data;
    } catch (error) {
      console.error('Error creating sales operation:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  updateSalesOperation: async (id: number, salesOperation: Partial<SalesOperationRequest>) => {
    try {
      const response = await api.put(`/sales/${id}`, salesOperation);
      return response.data;
    } catch (error) {
      console.error(`Error updating sales operation ${id}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  deleteSalesOperation: async (id: number) => {
    try {
      const response = await api.delete(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting sales operation ${id}:`, error instanceof Error ? error.message : String(error));
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
      console.error('Error fetching resources:', error instanceof Error ? error.message : String(error));
      return [];
    }
  },

  getResourceById: async (id: number) => {
    try {
      const response = await api.get(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource ${id}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  },
  
  createResource: async (resource: ResourceRequest) => {
    try {
      const response = await api.post('/resources', resource);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  },
  
  updateResource: async (id: number, resource: Partial<ResourceRequest>) => {
    try {
      const response = await api.put(`/resources/${id}`, resource);
      return response.data;
    } catch (error) {
      console.error(`Error updating resource ${id}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  },
  
  deleteResource: async (id: number) => {
    try {
      const response = await api.delete(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting resource ${id}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  },
};

// Dashboard API
export const dashboardApi = {
  getGlobalData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error instanceof Error ? error.message : String(error));
      // Return default data structure
      return {
        totalEmployees: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalSales: 0,
        wonSales: 0,
        pendingSales: 0,
        occupancyRate: 0,
        ongoingProjects: 0,
        upcomingProjects: 0,
        completedPercentage: 0,
        ongoingPercentage: 0,
        upcomingPercentage: 0,
        occupationOverYear: [],
        topEmployees: [],
        projectsByStatus: [],
        projectsByType: [],
        projectsByClient: [],
        recentProjects: []
      };
    }
  },
  
  getOccupancyRate: async () => {
    try {
      const response = await api.get('/dashboard/occupancy');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching occupancy rate:', error instanceof Error ? error.message : String(error));
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
      console.error('Error checking API health:', error instanceof Error ? error.message : String(error));
      return { status: 'error' };
    }
  }
};

export default api;
