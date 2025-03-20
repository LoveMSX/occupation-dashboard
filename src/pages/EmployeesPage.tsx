
import React, { useState, useEffect } from 'react';
import { EmployeeGrid } from '@/components/employees/EmployeeGrid';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { ViewModeToggle } from '@/components/employees/ViewModeToggle';
import { EmployeeSearch } from '@/components/employees/EmployeeSearch';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';
import { SkillsSummaryPanel } from '@/components/employees/SkillsSummaryPanel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus, Upload, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useLanguage } from '@/components/LanguageProvider';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { enhancedEmployeesData } from '@/data/employeesData';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Define the prop types for child components
export interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ViewModeToggleProps {
  mode: 'grid' | 'table';
  onChange: (mode: 'grid' | 'table') => void;
}

export interface EmployeeFiltersProps {
  departments: string[];
  positions: string[];
  skills: string[];
  locations: string[];
  filters: {
    departments: string[];
    positions: string[];
    skills: string[];
    locations: string[];
  };
  onChange: (filters: any) => void;
}

export interface EmployeeGridProps {
  employees: any[];
  viewMode: 'grid' | 'table';
}

export interface SkillsSummaryPanelProps {
  skills: string[];
  employees: any[];
}

// Create a mock employeeApi for now
const employeeApi = {
  getAllEmployees: async () => {
    // For demonstration, return the enhanced data
    return enhancedEmployeesData;
  }
};

export function EmployeesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    departments: [] as string[],
    positions: [] as string[],
    skills: [] as string[],
    locations: [] as string[],
  });
  const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { t } = useLanguage();
  
  // Use actual API data in production
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getAllEmployees,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredEmployees = React.useMemo(() => {
    return (employees as any[]).filter(employee => {
      // Apply search filter
      if (searchQuery && !employee.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply department filter
      if (filters.departments.length > 0 && !filters.departments.includes(employee.department)) {
        return false;
      }
      
      // Apply position filter
      if (filters.positions.length > 0 && !filters.positions.includes(employee.position)) {
        return false;
      }
      
      // Apply location filter
      if (filters.locations.length > 0 && !filters.locations.includes(employee.location)) {
        return false;
      }
      
      // Apply skills filter
      if (filters.skills.length > 0 && !filters.skills.some(skill => employee.skills?.includes(skill))) {
        return false;
      }
      
      return true;
    });
  }, [employees, searchQuery, filters]);

  // Extract unique values for filters
  const departmentOptions = React.useMemo(() => {
    const departments = new Set<string>();
    (employees as any[]).forEach(employee => {
      if (employee.department) {
        departments.add(employee.department);
      }
    });
    return Array.from(departments);
  }, [employees]);

  const positionOptions = React.useMemo(() => {
    const positions = new Set<string>();
    (employees as any[]).forEach(employee => {
      if (employee.position) {
        positions.add(employee.position);
      }
    });
    return Array.from(positions);
  }, [employees]);

  const locationOptions = React.useMemo(() => {
    const locations = new Set<string>();
    (employees as any[]).forEach(employee => {
      if (employee.location) {
        locations.add(employee.location);
      }
    });
    return Array.from(locations);
  }, [employees]);

  const skillOptions = React.useMemo(() => {
    const skills = new Set<string>();
    (employees as any[]).forEach(employee => {
      employee.skills?.forEach((skill: string) => {
        skills.add(skill);
      });
    });
    return Array.from(skills);
  }, [employees]);

  const handleAddEmployee = () => {
    toast.success('Employé ajouté avec succès');
    setAddEmployeeDialogOpen(false);
  };

  const handleImportEmployees = () => {
    toast.success('Importation réussie');
    setImportDialogOpen(false);
  };

  if (isLoading) return <div className="p-4">Chargement des données...</div>;

  if (error) return <div className="p-4 text-red-500">Erreur lors du chargement des données</div>;

  return (
    <SidebarProvider>
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('Employees Management')}</h1>
          <div className="flex space-x-2">
            <Dialog open={addEmployeeDialogOpen} onOpenChange={setAddEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('Add Employee')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>{t('Add New Employee')}</DialogTitle>
                <EmployeeForm onClose={() => setAddEmployeeDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  {t('Import')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>{t('Import Employees')}</DialogTitle>
                {/* Import form would go here */}
                <div className="pt-4">
                  <Button onClick={handleImportEmployees}>{t('Import')}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <EmployeeSearch 
              value={searchQuery} 
              onChange={setSearchQuery} 
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className={filterOpen ? 'bg-muted' : ''}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('Filter')}
              {filters.departments.length > 0 || filters.positions.length > 0 || 
               filters.skills.length > 0 || filters.locations.length > 0 ? (
                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {filters.departments.length + filters.positions.length + 
                   filters.skills.length + filters.locations.length}
                </span>
              ) : null}
            </Button>
            <ViewModeToggle 
              mode={viewMode} 
              onChange={setViewMode} 
            />
          </div>
        </div>
        
        {filterOpen && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-md">{t('Filter Options')}</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeFilters 
                departments={departmentOptions}
                positions={positionOptions}
                skills={skillOptions}
                locations={locationOptions}
                filters={filters}
                onChange={setFilters}
              />
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-grow">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">{t('All Employees')}</TabsTrigger>
                <TabsTrigger value="active">{t('Active')}</TabsTrigger>
                <TabsTrigger value="available">{t('Available')}</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-2">
                {filteredEmployees.length > 0 ? (
                  viewMode === 'grid' ? (
                    <EmployeeGrid 
                      employees={filteredEmployees} 
                      viewMode={viewMode} 
                    />
                  ) : (
                    <EmployeeTable employees={filteredEmployees} />
                  )
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('No employees match your filters')}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="active" className="mt-2">
                <div className="text-center py-8 text-muted-foreground">{t('Active employees content')}</div>
              </TabsContent>
              <TabsContent value="available" className="mt-2">
                <div className="text-center py-8 text-muted-foreground">{t('Available employees content')}</div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="xl:w-96">
            <SkillsSummaryPanel 
              skills={skillOptions} 
              employees={filteredEmployees} 
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default EmployeesPage;
