
import { apiClient } from './apiConfig';
import type { EmployeeData, EmployeeRequest, OccupationData } from '@/types/employee';

export const employeeApi = {
  getAllEmployees: async (): Promise<EmployeeData[]> => {
    try {
      const response = await apiClient.get('/employees');
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
            ? emp.competences_2024.split(',').map((s: string) => s.trim())
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
    await apiClient.delete(`/employees/${id}`);
  },

  createEmployee: async (employee: EmployeeRequest): Promise<EmployeeData> => {
    const response = await apiClient.post('/employees', employee);
    return response.data as EmployeeData;
  },

  getEmployeeOccupation: async (employeeId: number): Promise<OccupationData[]> => {
    const response = await apiClient.get(`/employees/${employeeId}/occupation`);
    return response.data as OccupationData[];
  },

  getAllEmployeesOccupation: async (): Promise<OccupationData[]> => {
    const response = await apiClient.get('/employees/occupation');
    return response.data as OccupationData[];
  }
};
