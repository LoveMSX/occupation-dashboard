
import React from 'react';
import { EmployeeCard, EmployeeData } from './EmployeeCard';

export interface EmployeeGridProps {
  employees: EmployeeData[];
  viewMode: 'grid' | 'list';
}

export function EmployeeGrid({ employees, viewMode }: EmployeeGridProps) {
  if (!employees || employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No employees found</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        : "space-y-4"
    }>
      {employees.map((employee) => (
        <EmployeeCard 
          key={employee.id} 
          employee={employee} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

export default EmployeeGrid;
