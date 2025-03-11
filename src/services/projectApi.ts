
import { apiClient } from './apiConfig';
import type { Project, ProjectRequest } from '@/types/project';

export const projectApi = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return (Array.isArray(response.data) ? response.data : [response.data]).map((project: any) => ({
      ...project,
      name: project.nom_projet || '',
      description: project.description_bc || '',
      status: mapStatus(project.statut || 'ongoing'),
      category: (project.categorie_projet || 'Other') as "TMA" | "Regie" | "Forfait" | "Other",
      location: (project.localite || 'Local') as "Local" | "Offshore" | "Hybrid",
      startDate: project.date_debut || '',
      endDate: project.date_fin_prevu || '',
      progress: 0,
      manager: {
        id: 0,
        name: project.cp || '',
        avatar: "",
      },
      team: []
    }));
  },

  createProject: async (project: ProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/projects', project);
    const projectData = response.data;
    return {
      ...projectData,
      name: projectData.nom_projet || '',
      description: projectData.description_bc || '',
      status: mapStatus(projectData.statut || 'ongoing'),
      category: (projectData.categorie_projet || 'Other') as "TMA" | "Regie" | "Forfait" | "Other",
      location: (projectData.localite || 'Local') as "Local" | "Offshore" | "Hybrid",
      startDate: projectData.date_debut || '',
      endDate: projectData.date_fin_prevu || '',
      progress: 0,
      manager: {
        id: 0,
        name: projectData.cp || '',
        avatar: "",
      },
      team: []
    };
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  }
};

// Helper function to map status values
function mapStatus(status: string): "ongoing" | "completed" | "planned" | "standby" {
  switch (status.toLowerCase()) {
    case 'ongoing':
    case 'en cours':
      return 'ongoing';
    case 'completed':
    case 'terminé':
    case 'termine':
      return 'completed';
    case 'planned':
    case 'planifié':
    case 'planifie':
      return 'planned';
    case 'standby':
    case 'en attente':
      return 'standby';
    default:
      return 'ongoing';
  }
}
