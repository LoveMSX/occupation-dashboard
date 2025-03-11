
import { apiClient } from './apiConfig';
import type { SalesOperationRequest, SalesOperationResponse } from '@/types/sales';

export const salesApi = {
  getAllSalesOperations: async (): Promise<SalesOperationResponse[]> => {
    const response = await apiClient.get('/sales');
    const data = response.data as SalesOperationResponse[];
    return Array.isArray(data) ? data : [data];
  },

  createSalesOperation: async (operation: SalesOperationRequest): Promise<SalesOperationResponse> => {
    const response = await apiClient.post('/sales', operation);
    return response.data as SalesOperationResponse;
  },

  updateSalesOperation: async (id: number, operation: Partial<SalesOperationRequest>): Promise<SalesOperationResponse> => {
    const response = await apiClient.patch(`/sales/${id}`, operation);
    return response.data as SalesOperationResponse;
  },

  deleteSalesOperation: async (id: number): Promise<void> => {
    await apiClient.delete(`/sales/${id}`);
  }
};
