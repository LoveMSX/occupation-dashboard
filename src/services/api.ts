
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
