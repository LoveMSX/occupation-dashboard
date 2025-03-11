
// Export all API services from this central file
export * from './apiConfig';
export * from './employeeApi';
export * from './projectApi';
export * from './salesApi';
export * from './resourceApi';

// Export type definitions for use across the application
export type { EmployeeData, EmployeeRequest, ProjectReference, OccupationData } from '@/types/employee';
export type { Project, ProjectRequest } from '@/types/project';
export type { SalesOperationRequest, SalesOperationResponse } from '@/types/sales';
export type { ResourceRequest } from '@/types/resource';
