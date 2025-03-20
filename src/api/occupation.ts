import config from '@/config';

const API_URL = config.apiUrl;

export const occupationApi = {
  getAllOccupation: async () => {
    try {
      const response = await fetch(`${API_URL}/occupation`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text(); // First get the response as text
      if (!text) {
        return []; // Return empty array if response is empty
      }
      
      try {
        const data = JSON.parse(text); // Then try to parse it
        return data || [];
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error fetching occupation data:', error);
      return [];
    }
  },

  getOccupationById: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/occupation/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching occupation:', error);
      return null;
    }
  },

  getOccupationByEmployee: async (employeeId: number) => {
    try {
      const response = await fetch(`${API_URL}/occupation/employee/${employeeId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee occupation:', error);
      return [];
    }
  },

  getOccupationByProject: async (projectId: number) => {
    try {
      const response = await fetch(`${API_URL}/occupation/project/${projectId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text || text.trim() === '') {
        return [];
      }
      
      try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', text);
        return [];
      }
    } catch (error) {
      console.error('Error fetching project occupation:', error);
      return [];
    }
  },

  updateOccupation: async (id: number, occupationData: {
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
  }) => {
    try {
      const response = await fetch(`${API_URL}/occupation/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(occupationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        return null;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Error updating occupation:', error);
      throw error;
    }
  },
};
