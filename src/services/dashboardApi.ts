
import axios from 'axios';
import config from '@/config';
import { enhancedEmployeesData } from '@/data/employeesData';
import { IDashboardData, ItopEmployee, IRecentProject, IRateProjectCategories } from '@/types/dashboard';

// Define the data structure for occupancy table
export interface OccupancyTableData {
  employeeId: number;
  employee_name: string;
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
  total: number;
}

const API_URL = config.apiUrl;

// Create a stub for API calls
export const dashboardApi = {
  getGloabalData: async (): Promise<IDashboardData> => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      return response.data as IDashboardData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error instanceof Error ? error.message : String(error));
      // Return mock data with the correct shape
      return {
        totalEmployees: 28,
        totalProjects: 15,
        activeProjects: 8,
        completedProjects: 7,
        totalSales: 25,
        wonSales: 12,
        pendingSales: 5,
        occupancyRate: 85,
        ongoingProjects: 8,
        upcomingProjects: 4,
        completedPercentage: 35,
        ongoingPercentage: 40,
        upcomingPercentage: 25,
        occupationOverYear: [],
        topEmployees: [],
        projectsByStatus: [],
        projectsByType: [],
        projectsByClient: [],
        recentProjects: []
      };
    }
  },

  getOccupancyRate: async (): Promise<OccupancyTableData[]> => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/occupancy`);
      return response.data as OccupancyTableData[] || [];
    } catch (error) {
      console.error('Error fetching occupancy rate:', error instanceof Error ? error.message : String(error));
      // Generate mock data from enhancedEmployeesData
      return enhancedEmployeesData.slice(0, 10).map(employee => {
        // Generate random occupancy rates for each month
        const january = Math.floor(Math.random() * 30) + 70;
        const february = Math.floor(Math.random() * 30) + 70;
        const march = Math.floor(Math.random() * 30) + 70;
        const april = Math.floor(Math.random() * 30) + 70;
        const may = Math.floor(Math.random() * 30) + 70;
        const june = Math.floor(Math.random() * 30) + 70;
        const july = Math.floor(Math.random() * 30) + 70;
        const august = Math.floor(Math.random() * 30) + 70;
        const september = Math.floor(Math.random() * 30) + 70;
        const october = Math.floor(Math.random() * 30) + 70;
        const november = Math.floor(Math.random() * 30) + 70;
        const december = Math.floor(Math.random() * 30) + 70;
        
        // Calculate total
        const total = Math.floor((january + february + march + april + may + june +
                      july + august + september + october + november + december) / 12);
        
        return {
          employeeId: employee.id,
          employee_name: employee.name,
          january,
          february,
          march,
          april,
          may,
          june,
          july,
          august,
          september,
          october,
          november,
          december,
          total
        };
      });
    }
  },

  getEmployeeOccupation: async (employeeId: number) => {
    try {
      const response = await axios.get(`${API_URL}/occupation/employee/${employeeId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching occupation for employee ${employeeId}:`, error instanceof Error ? error.message : String(error));
      return []; // Return an empty array in case of an error
    }
  }
};

export default dashboardApi;
