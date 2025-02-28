
import { EmployeeData } from "@/components/employees/EmployeeCard";

// Configuration de l'API - à remplacer par votre URL réelle
const API_URL = "http://localhost:3001/api";

// Interface pour les requêtes de création/mise à jour d'employé
export interface EmployeeRequest {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  manager?: string;
  skills: string[];
  occupancyRate: number;
  avatar?: string;
}

// Interface pour les données de projet
export interface ProjectRequest {
  name: string;
  description: string;
  status: "ongoing" | "completed" | "standby" | "planned";
  client: string;
  category: string;
  location: string;
  startDate: string;
  endDate?: string;
  progress: number;
  manager?: { id: number; name: string; avatar?: string };
  team?: Array<{ id: number; name: string; avatar?: string; role?: string }>;
}

// Interface pour les opérations de vente (avant-vente)
export interface SalesOperationRequest {
  projectName: string;
  client: string;
  receptionDate: string;
  tjm?: number;
  budget?: string | number;
  status: "Envoyé" | "En cours" | "Gagné" | "Perdu" | "Attente élément";
  commercial?: string;
  description?: string;
}

// Interface pour les réponses d'opérations de vente
export interface SalesOperationResponse {
  id: number;
  projectName: string;
  client: string;
  receptionDate: string;
  tjm: number;
  budget: string | number;
  status: "Envoyé" | "En cours" | "Gagné" | "Perdu" | "Attente élément";
  commercial: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Service API pour les employés
export const employeeApi = {
  // Récupérer tous les employés
  async getAllEmployees(): Promise<EmployeeData[]> {
    try {
      const response = await fetch(`${API_URL}/employees`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des employés');
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Récupérer un employé par son ID
  async getEmployeeById(id: number): Promise<EmployeeData> {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'employé ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Créer un nouvel employé
  async createEmployee(employee: EmployeeRequest): Promise<EmployeeData> {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'employé");
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Mettre à jour un employé existant
  async updateEmployee(id: number, employee: Partial<EmployeeRequest>): Promise<EmployeeData> {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'employé");
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Supprimer un employé
  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'employé");
      }
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
};

// Service API pour les projets
export const projectApi = {
  // Récupérer tous les projets
  async getAllProjects() {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des projets');
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Récupérer un projet par son ID
  async getProjectById(id: number) {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du projet ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Créer un nouveau projet
  async createProject(project: ProjectRequest) {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création du projet");
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Mettre à jour un projet existant
  async updateProject(id: number, project: Partial<ProjectRequest>) {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du projet");
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Supprimer un projet
  async deleteProject(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du projet");
      }
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Récupérer les employés d'un projet
  async getProjectEmployees(id: number) {
    try {
      const response = await fetch(`${API_URL}/projects/${id}/employees`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des employés du projet ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Récupérer les projets d'un employé
  async getProjectsByEmployeeId(employeeId: number) {
    try {
      const response = await fetch(`${API_URL}/employees/${employeeId}/projects`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des projets de l'employé ${employeeId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
};

// Service API pour les opérations de vente (avant-vente)
export const salesApi = {
  // Récupérer toutes les opérations de vente
  async getAllSalesOperations(): Promise<SalesOperationResponse[]> {
    try {
      const response = await fetch(`${API_URL}/sales-operations`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des opportunités commerciales');
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Récupérer une opération de vente par son ID
  async getSalesOperationById(id: number): Promise<SalesOperationResponse> {
    try {
      const response = await fetch(`${API_URL}/sales-operations/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'opportunité commerciale ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Créer une nouvelle opération de vente
  async createSalesOperation(operation: SalesOperationRequest): Promise<SalesOperationResponse> {
    try {
      const response = await fetch(`${API_URL}/sales-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'opportunité commerciale");
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Mettre à jour une opération de vente existante
  async updateSalesOperation(id: number, operation: Partial<SalesOperationRequest>): Promise<SalesOperationResponse> {
    try {
      const response = await fetch(`${API_URL}/sales-operations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'opportunité commerciale");
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Supprimer une opération de vente
  async deleteSalesOperation(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/sales-operations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'opportunité commerciale");
      }
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Récupérer les opérations de vente d'un employé (commercial)
  async getSalesOperationsByEmployeeId(employeeId: number): Promise<SalesOperationResponse[]> {
    try {
      const response = await fetch(`${API_URL}/sales-operations/employee/${employeeId}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des opportunités du commercial ${employeeId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
  
  // Récupérer les opérations de vente par statut
  async getSalesOperationsByStatus(status: string): Promise<SalesOperationResponse[]> {
    try {
      const response = await fetch(`${API_URL}/sales-operations?status=${status}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des opportunités avec le statut ${status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
};

// Service de vérification de la santé du serveur
export const healthApi = {
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL.replace('/api', '')}/health`);
      if (!response.ok) {
        throw new Error('Le serveur ne répond pas correctement');
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};
