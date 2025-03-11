
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/services/employeeApi";
import { EmployeeGrid } from "@/components/employees/EmployeeGrid";
import { SkillsSummaryPanel } from "@/components/employees/EmployeeCard";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  Filter,
  X,
  Download,
  RefreshCw
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";

type ViewMode = "grid" | "list";

export default function EmployeesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  
  // Fetch employees data
  const { data: employees = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getAllEmployees
  });

  const handleSkillFilter = (skill: string) => {
    setActiveSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleLocationFilter = (location: string) => {
    setActiveLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location) 
        : [...prev, location]
    );
  };

  const clearFilters = () => {
    setActiveSkills([]);
    setActiveLocations([]);
    setSearchTerm("");
  };

  // Extract unique skills and locations from employees
  const allSkills = Array.from(new Set(
    employees.flatMap(emp => emp.competences_2024 || [])
  )).sort();
  
  const allLocations = Array.from(new Set(
    employees.map(emp => emp.location).filter(Boolean) as string[]
  )).sort();

  // Filter employees based on search term, skills, locations and tab
  const filteredEmployees = employees.filter((employee) => {
    // Text search filter
    const matchesSearch = !searchTerm || [
      employee?.name?.toLowerCase() || "",
      employee?.position?.toLowerCase() || "",
      employee?.email?.toLowerCase() || "",
    ].some(field => field.includes(searchTerm.toLowerCase()));
    
    // Skills filter
    const matchesSkills = activeSkills.length === 0 || 
      activeSkills.every(skill => 
        employee.competences_2024?.includes(skill)
      );
    
    // Location filter
    const matchesLocation = activeLocations.length === 0 || 
      (employee.location && activeLocations.includes(employee.location));
    
    // Tab filter
    const matchesTab = selectedTab === "all" || 
      (selectedTab === "available" && employee.occupancyRate < 70) || 
      (selectedTab === "occupied" && employee.occupancyRate >= 70);
    
    return matchesSearch && matchesSkills && matchesLocation && matchesTab;
  });

  const handleExportCSV = () => {
    // Placeholder for export functionality
    toast.success("Exporting employee data");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed");
  };

  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </Layout>
  );

  if (isError) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-xl font-semibold text-destructive mb-4">Error loading employees</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">{t('resources')}</CardTitle>
                <CardDescription>
                  {t('manage.employees.description')}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('refresh')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('export.csv')}
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add.employee')}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Search and filters row */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('search.employees')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        {t('filters')}
                        {(activeSkills.length > 0 || activeLocations.length > 0) && (
                          <Badge variant="secondary" className="ml-2">
                            {activeSkills.length + activeLocations.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{t('filter.resources')}</SheetTitle>
                        <SheetDescription>
                          {t('filter.description')}
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="py-4 space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">{t('skills')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {allSkills.map(skill => (
                              <Badge 
                                key={skill}
                                variant={activeSkills.includes(skill) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleSkillFilter(skill)}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">{t('location')}</h3>
                          <div className="flex flex-wrap gap-2">
                            {allLocations.map(location => (
                              <Badge 
                                key={location}
                                variant={activeLocations.includes(location) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleLocationFilter(location)}
                              >
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button variant="outline" onClick={clearFilters}>
                            {t('clear.filters')}
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  
                  <Select
                    value={viewMode}
                    onValueChange={(value) => setViewMode(value as ViewMode)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder={t('view')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <div className="flex items-center">
                          <Grid className="mr-2 h-4 w-4" />
                          {t('grid.view')}
                        </div>
                      </SelectItem>
                      <SelectItem value="list">
                        <div className="flex items-center">
                          <List className="mr-2 h-4 w-4" />
                          {t('list.view')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Active filters display */}
              {(activeSkills.length > 0 || activeLocations.length > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('active.filters')}:</span>
                  
                  {activeSkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleSkillFilter(skill)} 
                      />
                    </Badge>
                  ))}
                  
                  {activeLocations.map(location => (
                    <Badge key={location} variant="secondary" className="gap-1">
                      {location}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleLocationFilter(location)} 
                      />
                    </Badge>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={clearFilters}
                  >
                    {t('clear.all')}
                  </Button>
                </div>
              )}
              
              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="all">
                    {t('all')}
                    <Badge variant="secondary" className="ml-2">
                      {employees.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="available">
                    {t('available')}
                    <Badge variant="secondary" className="ml-2">
                      {employees.filter(e => e.occupancyRate < 70).length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="occupied">
                    {t('occupied')}
                    <Badge variant="secondary" className="ml-2">
                      {employees.filter(e => e.occupancyRate >= 70).length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <EmployeeGrid 
                    employees={filteredEmployees}
                    viewMode={viewMode}
                  />
                </TabsContent>
                
                <TabsContent value="available">
                  <EmployeeGrid 
                    employees={filteredEmployees}
                    viewMode={viewMode}
                  />
                </TabsContent>
                
                <TabsContent value="occupied">
                  <EmployeeGrid 
                    employees={filteredEmployees}
                    viewMode={viewMode}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        {/* Skills Summary Section */}
        {employees.length > 0 && (
          <SkillsSummaryPanel employees={employees} />
        )}
      </div>
    </Layout>
  );
}
