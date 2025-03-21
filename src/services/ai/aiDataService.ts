
import { employeeApi, projectApi, salesApi } from '../api';
import { occupationApi } from '@/api/occupation';
import type { EmployeeData } from '@/types/employee';
import type { ProjectData } from '@/types/project';
import type { OccupationData } from '../api';

export interface DataQueryResult {
  data: unknown;
  error?: string;
  metadata?: {
    count?: number;
    timestamp: string;
    queryType: string;
  };
}

interface AnalysisResult {
  count?: number;
  type?: string;
  sample?: unknown[];
  value?: unknown;
}

export interface SalesOperationResponse {
  commercial: string;
  [key: string]: any;
}

export interface Project extends ProjectData {
  [key: string]: any;
}

export class AIDataService {
  private systemContext: {
    availableEndpoints: string[];
  };

  constructor() {
    // Toujours inclure tous les endpoints disponibles
    this.systemContext = {
      availableEndpoints: ['employees', 'projects', 'sales', 'occupation']
    };
  }

  async fetchAllData(): Promise<Record<string, DataQueryResult>> {
    const results: Record<string, DataQueryResult> = {};
    const timestamp = new Date().toISOString();

    // Fetch all data in parallel
    await Promise.all(
      this.systemContext.availableEndpoints.map(async (endpoint) => {
        try {
          let data: unknown;
          
          switch (endpoint) {
            case 'employees':
              data = await employeeApi.getAllEmployees();
              break;
            case 'projects':
              data = await projectApi.getAllProjects();
              break;
            case 'sales':
              data = await salesApi.getAllSalesOperations();
              break;
            case 'occupation':
              data = await occupationApi.getAllOccupation();
              break;
          }

          results[endpoint] = {
            data,
            metadata: {
              count: Array.isArray(data) ? data.length : 1,
              timestamp,
              queryType: 'GET_ALL'
            }
          };
        } catch (error) {
          results[endpoint] = {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            metadata: {
              timestamp,
              queryType: 'ERROR'
            }
          };
        }
      })
    );

    return results;
  }

  async analyzeData(data: unknown, analysisType: string): Promise<AnalysisResult> {
    // Implement data analysis logic here
    // This could include statistical analysis, trend detection, etc.
    switch (analysisType) {
      case 'summary':
        return this.generateSummary(data);
      case 'trends':
        return this.analyzeTrends(data);
      default:
        throw new Error(`Unsupported analysis type: ${analysisType}`);
    }
  }

  private generateSummary(data: unknown): AnalysisResult {
    if (Array.isArray(data)) {
      return {
        count: data.length,
        type: this.detectDataType(data[0]),
        sample: data.slice(0, 3)
      };
    }
    return {
      type: typeof data,
      value: data
    };
  }

  private analyzeTrends(data: unknown): AnalysisResult {
    // Implement trend analysis logic
    return {
      // Add trend analysis results
    };
  }

  private detectDataType(item: unknown): string {
    if (!item) return 'unknown';
    if (this.isEmployeeData(item)) return 'employee';
    if (this.isProject(item)) return 'project';
    if (this.isSalesOperation(item)) return 'sales';
    if (this.isOccupationData(item)) return 'occupation';
    return typeof item;
  }

  private isEmployeeData(item: unknown): item is EmployeeData {
    return typeof item === 'object' && item !== null && 'name' in item && 'position' in item;
  }

  private isProject(item: unknown): item is Project {
    return typeof item === 'object' && item !== null && 'name' in item && 'status' in item;
  }

  private isSalesOperation(item: unknown): item is SalesOperationResponse {
    return typeof item === 'object' && item !== null && 'commercial' in item;
  }

  private isOccupationData(item: unknown): item is OccupationData {
    return typeof item === 'object' && item !== null && 'occupancyRate' in item;
  }
}
