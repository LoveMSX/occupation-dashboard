import { OccupancyTableData } from "@/components/dashboard/OccupancyTable";
import type { EmployeeData } from "@/components/employees/EmployeeCard";
import config from "@/config";
import { IDashboardData } from "@/pages/Index";
import axios from "axios";

// Configuration de l'API - à remplacer par votre URL réelle
// Fixed API URL for employees endpoint
const API_URL = config.apiUrl;

interface APIEmployeeResponse {
  id: number;
  appelation: string;
  poste: string;
  email: string;
  phone: string;
  nom_prenoms_copie_jira: string;
  location: string;
  date_debauche: string;
  manager?: string;
  competences_2024: string; // Changé de string[] à string
  occupancyRate: number;
  projects: {
    id: number;
    name: string;
    status: string;
    client?: string;
    category?: string;
  }[];
}

// Interface for API employee update/create requests
interface APIEmployeeUpdateRequest {
  appelation?: string;
  poste?: string;
  email?: string;
  phone?: string;
  nom_prenoms_copie_jira?: string;
  location?: string;
  date_debauche?: string;
  manager?: string;
  competences_2024?: string[];
  occupancyRate?: number;
}

// Interface for creating a new employee (all fields required except manager)
interface APIEmployeeCreateRequest
  extends Omit<Required<APIEmployeeUpdateRequest>, "manager"> {
  manager?: string;
}

// Helper to handle API errors
const handleApiError = (response: Response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Interface pour les requêtes de création/mise à jour d'employé
export interface EmployeeRequest {
  appelation: string;
  poste: string;
  email: string;
  phone: string;
  nom_prenoms_copie_jira: string;
  location: string;
  date_debauche: string;
  manager?: string;
  competences_2024: string[];
  occupancyRate: number;
  projects: {
    id: number;
    name: string;
    status: string;
    client?: string;
    category?: string;
  }[];
  avatar?: string;
}

// Interface pour les données de projet
interface APIProjectResponse {
  id: number;
  nom_projet: string;
  client: string;
  statut: string;
  categorie_projet: string;
  localite: string;
  date_debut: string;
  date_fin_prevu: string;
  date_fin_reelle?: string;
  description_bc?: string;
  tjm: string;
  charge_vendu_jours: string;
  cp: string;
  technologie?: string;
  secteur?: string;
  bu: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRequest {
  nom_projet: string;
  client: string;
  statut: string;
  categorie_projet: string;
  localite: string;
  date_debut: string;
  date_fin_prevu: string;
  date_fin_reelle?: string;
  description_bc?: string;
  tjm: string;
  charge_vendu_jours: string;
  cp: string;
  technologie?: string;
  secteur?: string;
  bu: string;
}

// Interface pour les opérations de vente
export interface SalesOperationRequest {
  nom_du_projet: string;
  client: string;
  date_reception: string;
  tjm: number;
  chiffrage_jh: number;
  statut: string;
  commerciale: string;
  personne_en_charge_msx: string;
  type_projet: string;
  remarques: string;
  url: string;
}

export interface SalesOperationResponse extends SalesOperationRequest {
  id: number;
  created_at: string;
  updated_at: string;
}

// Service API pour les employés
export const employeeApi = {
  // Récupérer tous les employés
  async getAllEmployees(): Promise<EmployeeData[]> {
    try {
      const response = await fetch(`${API_URL}/employees`);
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const employees: APIEmployeeResponse[] = await response.json();

      return employees.map((emp) => ({
        id: emp.id,
        name: emp.appelation,
        position: emp.poste,
        email: emp.email,
        phone: emp.phone,
        location: emp.location,
        joinDate: emp.date_debauche,
        manager: emp.manager,
        competences_2024: emp.competences_2024
          ? emp.competences_2024.split(",").map((skill) => skill.trim())
          : [],
        occupancyRate: emp.occupancyRate,
        projects: emp.projects || [],
      }));
    } catch (error) {
      console.error("API error:", error);
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
      const emp: APIEmployeeResponse = await response.json();

      return {
        id: emp.id,
        name: emp.appelation,
        position: emp.poste,
        email: emp.email,
        phone: emp.phone,
        avatar: emp.nom_prenoms_copie_jira
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
              emp.nom_prenoms_copie_jira
            )}&background=random`
          : undefined,
        location: emp.location,
        joinDate: emp.date_debauche,
        manager: emp.manager,
        skills: Array.isArray(emp.competences_2024) ? emp.competences_2024 : [],
        occupancyRate: emp.occupancyRate,
        projects: (emp.projects || []).map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status.toLowerCase(),
          client: project.client,
          category: project.category,
        })),
      };
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Créer un nouvel employé
  async createEmployee(employee: EmployeeRequest): Promise<EmployeeData> {
    try {
      // Use the French field names directly from EmployeeRequest
      const apiEmployee: APIEmployeeCreateRequest = {
        appelation: employee.appelation,
        poste: employee.poste,
        email: employee.email,
        phone: employee.phone,
        nom_prenoms_copie_jira: employee.nom_prenoms_copie_jira,
        location: employee.location,
        date_debauche: employee.date_debauche,
        manager: employee.manager,
        competences_2024: employee.competences_2024,
        occupancyRate: employee.occupancyRate,
      };

      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiEmployee),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'employé");
      }
      const emp: APIEmployeeResponse = await response.json();
      return {
        id: emp.id,
        name: emp.appelation,
        position: emp.poste,
        email: emp.email,
        phone: emp.phone,
        avatar: emp.nom_prenoms_copie_jira
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
              emp.nom_prenoms_copie_jira
            )}&background=random`
          : undefined,
        location: emp.location,
        joinDate: emp.date_debauche,
        manager: emp.manager,
        skills: Array.isArray(emp.competences_2024) ? emp.competences_2024 : [],
        occupancyRate: emp.occupancyRate,
        projects: (emp.projects || []).map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status.toLowerCase(),
          client: project.client,
          category: project.category,
        })),
      };
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  getEmployeeOccupation: async (employeeId: number): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_URL}/occupation/employee/${employeeId}`, {
        validateStatus: (status) => status < 500, // Accepte tous les codes < 500
      });

      // Si la réponse est 204 No Content ou données vides
      if (!response.data || response.status === 204) {
        return [];
      }

      // Vérification du type de données reçues
      if (typeof response.data === 'string') {
        try {
          const parsed = JSON.parse(response.data);
          return Array.isArray(parsed) ? parsed : [];
        } catch (parseError) {
          window.console.error('JSON parse error:', parseError);
          return [];
        }
      }

      // Si les données sont déjà un objet JavaScript
      return Array.isArray(response.data) ? response.data : [];

    } catch (error) {
      window.console.error('API error in getEmployeeOccupation:', error);
      if (axios.isAxiosError(error)) {
        window.console.error('Response data:', error.response?.data);
        window.console.error('Status:', error.response?.status);
      }
      return []; // Retourne un tableau vide en cas d'erreur
    }
  },
  // Mettre à jour un employé existant
  async updateEmployee(
    id: number,
    employee: Partial<EmployeeRequest>
  ): Promise<EmployeeData> {
    try {
      // Use the French field names directly from EmployeeRequest
      const apiEmployee: APIEmployeeUpdateRequest = {};
      if (employee.appelation !== undefined)
        apiEmployee.appelation = employee.appelation;
      if (employee.poste !== undefined) apiEmployee.poste = employee.poste;
      if (employee.email !== undefined) apiEmployee.email = employee.email;
      if (employee.phone !== undefined) apiEmployee.phone = employee.phone;
      if (employee.nom_prenoms_copie_jira !== undefined)
        apiEmployee.nom_prenoms_copie_jira = employee.nom_prenoms_copie_jira;
      if (employee.location !== undefined)
        apiEmployee.location = employee.location;
      if (employee.date_debauche !== undefined)
        apiEmployee.date_debauche = employee.date_debauche;
      if (employee.manager !== undefined)
        apiEmployee.manager = employee.manager;
      if (employee.competences_2024 !== undefined)
        apiEmployee.competences_2024 = employee.competences_2024;
      if (employee.occupancyRate !== undefined)
        apiEmployee.occupancyRate = employee.occupancyRate;

      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiEmployee),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'employé");
      }
      const emp: APIEmployeeResponse = await response.json();
      return {
        id: emp.id,
        name: emp.appelation,
        position: emp.poste,
        email: emp.email,
        phone: emp.phone,
        avatar: emp.nom_prenoms_copie_jira
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
              emp.nom_prenoms_copie_jira
            )}&background=random`
          : undefined,
        location: emp.location,
        joinDate: emp.date_debauche,
        manager: emp.manager,
        skills: Array.isArray(emp.competences_2024) ? emp.competences_2024 : [],
        occupancyRate: emp.occupancyRate,
        projects: (emp.projects || []).map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status.toLowerCase(),
          client: project.client,
          category: project.category,
        })),
      };
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Supprimer un employé
  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'employé");
      }
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // async getEmployeeOccupation(employeeId: number): Promise<OccupationData[]> {
  //   try {
  //     const response = await fetch(`${API_URL}/occupation?employee_id=${employeeId}`);
  //     if (!response.ok) {
  //       throw new Error(`Erreur lors de la récupération de l'occupation de l'employé ${employeeId}`);
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     console.error('API error:', error);
  //     throw error;
  //   }
  // }
  async getEmployeeOccupation(employeeId: number): Promise<OccupationData[]> {
    try {
      const response = await fetch(`${API_URL}/occupation?employee_id=${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'occupation de l'employé ${employeeId}`);
      }
      
      const data = await response.json();
      
      // If the response is empty or null, return an empty array
      if (!data) {
        return [];
      }
      
      return data;
    } catch (error) {
      console.error("API error:", error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },
};

// Service API pour les projets
export const projectApi = {
  // Récupérer tous les projets
  async getAllProjects() {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des projets");
      }
      const data: APIProjectResponse[] = await response.json();

      return data.map((proj) => ({
        id: proj.id,
        name: proj.nom_projet,
        client: proj.client,
        status: (() => {
          const statusMap: Record<
            string,
            "ongoing" | "completed" | "standby" | "planned"
          > = {
            "en cours": "ongoing",
            terminé: "completed",
            "en attente": "standby",
            planifié: "planned",
          };
          return statusMap[proj.statut?.toLowerCase() || ""] || "ongoing";
        })(),
        category: proj.categorie_projet,
        location: proj.localite,
        startDate: proj.date_debut,
        endDate: proj.date_fin_prevu,
        actualEndDate: proj.date_fin_reelle,
        description: proj.description_bc || "",
        dailyRate: parseFloat(proj.tjm),
        soldDays: parseFloat(proj.charge_vendu_jours),
        projectManager: proj.cp,
        technology: proj.technologie || "Non spécifié",
        sector: proj.secteur || "Non spécifié",
        businessUnit: proj.bu,
        createdAt: proj.created_at,
        updatedAt: proj.updated_at,
      }));
    } catch (error) {
      console.error("API error:", error);
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
      console.error("API error:", error);
      throw error;
    }
  },

  // Créer un nouveau projet
  async createProject(project: ProjectRequest) {
    try {
      // Create a sanitized copy of the project to avoid circular references
      const sanitizedProject = {
        nom_projet: project.nom_projet,
        client: project.client,
        statut: project.statut,
        categorie_projet: project.categorie_projet,
        localite: project.localite,
        date_debut: project.date_debut,
        date_fin_prevu: project.date_fin_prevu,
        date_fin_reelle: project.date_fin_reelle,
        description_bc: project.description_bc,
        tjm: project.tjm,
        charge_vendu_jours: project.charge_vendu_jours,
        cp: project.cp,
        technologie: project.technologie,
        secteur: project.secteur,
        bu: project.bu
      };
      
      window.console.log("Creating project:", sanitizedProject.nom_projet);
      
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedProject),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        let errorMessage = `Server error: ${response.status}`;
        
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData?.message || errorMessage;
          } catch (e) {
            // If not JSON, use the raw text
            errorMessage = `${errorMessage} - ${errorText.substring(0, 100)}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Mettre à jour un projet existant
  async updateProject(id: number, project: Partial<ProjectRequest>) {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du projet");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Supprimer un projet
  async deleteProject(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du projet");
      }
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Récupérer les employés d'un projet
  async getProjectEmployees(id: number): Promise<ProjectEmployeeResponse[]> {
    try {
      const response = await fetch(`${API_URL}/project-employees?projectId=${id}`);
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des employés du projet ${id}`);
      }
      
      const data = await response.json();
      
      return data.map((emp: any) => ({
        id: emp.id,
        name: emp.appelation || emp.name || "Inconnu",
        position: emp.poste || emp.position || "Poste non spécifié",
        avatar: emp.nom_prenoms_copie_jira
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
              emp.nom_prenoms_copie_jira
            )}&background=random`
          : undefined
      }));
    } catch (error) {
      console.error(`API error getting project ${id} employees:`, error);
      return []; // Return empty array instead of throwing to prevent UI crashes
    }
  },
};

// Service API pour les opportunités de vente
export const salesApi = {
  // Récupérer toutes les opportunités
  async getAllSalesOperations(): Promise<SalesOperationResponse[]> {
    try {
      const response = await fetch(`${API_URL}/sales`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des opportunités commerciales: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Récupérer une opportunité par son ID
  async getSalesOperationById(id: number): Promise<SalesOperationResponse> {
    try {
      const response = await fetch(`${API_URL}/sales/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'opportunité ${id}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Récupérer les opportunités par commercial
  async getSalesOperationsByCommercial(commercial: string): Promise<SalesOperationResponse[]> {
    try {
      const response = await fetch(`${API_URL}/sales/commercial/${encodeURIComponent(commercial)}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des opportunités du commercial: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Créer une nouvelle opportunité
  async createSalesOperation(operation: SalesOperationRequest): Promise<SalesOperationResponse> {
    try {
      const response = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(operation),
      });
      if (!response.ok) {
        throw new Error(`Erreur lors de la création: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Mettre à jour une opportunité existante
  async updateSalesOperation(
    id: number,
    operation: Partial<SalesOperationRequest>
  ): Promise<SalesOperationResponse> {
    try {
      const response = await fetch(`${API_URL}/sales/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(operation),
      });
      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  // Supprimer une opportunité
  async deleteSalesOperation(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/sales/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },
};

export const dashboardApi = {
  getGloabalData: async (): Promise<IDashboardData> => {
    try {
      const response = await axios.get(`${API_URL}/occupation/dashboard`);
      return response.data as IDashboardData;
    } catch (error: any) {
      // Utiliser window.console pour éviter les conflits
      window.console.error(
        "API call failed:",
        error?.message,
        error?.response?.status,
        error?.response?.data
      );
      throw error;
    }
  },
  getOccupancyRate: async (): Promise<OccupancyTableData[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/occupation/occupationByEmployee`
      );
      return response.data as OccupancyTableData[];
    } catch (error: any) {
      // Utiliser window.console pour éviter les conflits
      window.console.error(
        "API call failed:",
        error?.message,
        error?.response?.status,
        error?.response?.data
      );
      throw error;
    }
  },
};

export interface ProjectRequest {
  nom_projet: string;
}
// Service de vérification de la santé du serveur
export const healthApi = {
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL.replace("/api", "")}/`);
      if (!response.ok) {
        throw new Error("Le serveur ne répond pas correctement");
      }
      return await response.json();
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  },
};

// Add this interface and export it
export interface Project {
  id: number;
  name: string;
  client: string;
  status: "ongoing" | "completed" | "standby" | "planned";
  category: "TMA" | "Regie" | "Forfait" | "Other";
  location: "Local" | "Offshore" | "Hybrid";
  startDate: string;
  endDate: string;
  actualEndDate?: string;
  description: string;
  dailyRate: number;
  soldDays: number;
  projectManager: string;
  technology?: string;
  sector?: string;
  businessUnit: string;
  createdAt: string;
  updatedAt: string;
  progress?: number;
  manager?: {
    id: number;
    name: string;
    avatar?: string;
  };
  team: {
    id: number;
    name: string;
    role?: string;
    avatar?: string;
    startDate?: string;
    endDate?: string;
    allocation?: number;
  }[];
}

// Add these interfaces
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
  tjm: string;
  salaire: string;
  technologie_principale: string;
  technologies_secondaires: string[];
  localisation: string;
  mobilite: boolean;
  commentaire: string;
}

// Add the resourceApi service
export const resourceApi = {
  getAllResources: async () => {
    const response = await fetch("/api/resources");
    if (!response.ok) {
      throw new Error("Failed to fetch resources");
    }
    return response.json();
  },

  createResource: async (resource: ResourceRequest) => {
    const response = await fetch("/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    if (!response.ok) {
      throw new Error("Failed to create resource");
    }
    return response.json();
  },
};

export interface OccupationData {
  occupation_id: number;
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
}

// Assurez-vous que l'interface pour les employés du projet est définie
interface ProjectEmployeeResponse {
  id: number;
  name: string;
  position: string;
  avatar?: string;
}
