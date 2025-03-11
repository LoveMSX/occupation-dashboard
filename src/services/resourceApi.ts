
import { apiClient } from './apiConfig';
import type { ResourceRequest } from '@/types/resource';

export const resourceApi = {
  createResource: async (resource: ResourceRequest): Promise<void> => {
    await apiClient.post('/resources', resource);
  }
};
