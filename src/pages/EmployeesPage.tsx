
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { ViewModeToggle } from "@/components/employees/ViewModeToggle";
import { EmployeeGrid } from "@/components/employees/EmployeeGrid";
import { enhancedEmployeesData } from "@/data/employeesData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TableIcon, 
  BarChart2Icon, 
  LayoutGridIcon, 
  PieChartIcon, 
  CalendarDaysIcon,
  ListIcon,
  PlusIcon,
  Mail
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Définissons un type pour l'employé conforme aux attentes du système
interface NewEmployeeData {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  joinDate: string;
  manager?: string;
  skills: string[]; // Définir skills comme obligatoire
  occupancyRate: number;
  projects: { 
    id: number; 
    name: string; 
    status: string;
    client?: string;
    category?: string;
  }[];
}

const EmployeesPage = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentView, setCurrentView] = useState<"table" | "chart" | "cards" | "department" | "skills">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([...enhancedEmployeesData]);

  const [newEmployee, setNewEmployee] = useState({
    id: 0,
    name: "",
    position: "",
    department: "Engineering",
    email: "",
    phone: "",
    location: "Madagascar",
    joinDate: new Date().toISOString().split("T")[0],
    manager: "",
    skills: [] as string[],
    occupancyRate: 85,
    avatar: "",
  });
  
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || employee.location === locationFilter;
    const matchesSkill = skillFilter === "all" || employee.skills?.includes(skillFilter);
    
    return matchesSearch && matchesLocation && matchesSkill;
  });

  // Calculate data for department chart
  const departmentChartData = () => {
    const departmentCounts: Record<string, number> = {};
    
    employees.forEach(employee => {
      if (departmentCounts[employee.department]) {
        departmentCounts[employee.department]++;
      } else {
        departmentCounts[employee.department] = 1;
      }
    });
    
    return Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));
  };

  // Calculate data for skills chart
  const skillsChartData = () => {
    const skillCounts: Record<string, number> = {};
    
    employees.forEach(employee => {
      employee.skills?.forEach(skill => {
        if (skillCounts[skill]) {
          skillCounts[skill]++;
        } else {
          skillCounts[skill] = 1;
        }
      });
    });
    
    return Object.entries(skillCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 skills
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    // Valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    const newId = Math.max(...employees.map(emp => emp.id)) + 1;
    const skillsList = newEmployee.skills.length > 0 ? newEmployee.skills : 
                      ["React", "TypeScript"].slice(0, Math.floor(Math.random() * 2) + 1);
    
    // Create a sample project for the new employee
    const randomProject = {
      id: Math.floor(Math.random() * 100) + 1,
      name: `Project ${Math.floor(Math.random() * 1000) + 1}`,
      status: ["active", "pending", "completed"][Math.floor(Math.random() * 3)],
      client: "TechCorp Industries",
      category: ["Forfait", "TMA", "Regie"][Math.floor(Math.random() * 3)]
    };
    
    // Créer un nouvel employé avec le type attendu par le système
    const completeEmployee: NewEmployeeData = {
      ...newEmployee,
      id: newId,
      skills: skillsList,
      projects: [randomProject],
      occupancyRate: newEmployee.occupancyRate,
      joinDate: newEmployee.joinDate,
      avatar: newEmployee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmployee.name)}&background=random`,
    };

    setEmployees([completeEmployee, ...employees]);
    setIsAddDialogOpen(false);
    setNewEmployee({
      id: 0,
      name: "",
      position: "",
      department: "Engineering",
      email: "",
      phone: "",
      location: "Madagascar",
      joinDate: new Date().toISOString().split("T")[0],
      manager: "",
      skills: [],
      occupancyRate: 85,
      avatar: "",
    });
    toast.success("Ressource ajoutée avec succès");
  };

  const handleSkillChange = (skillInput: string) => {
    const skills = skillInput.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setNewEmployee({ ...newEmployee, skills });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
  
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">{t('resources')}</h1>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "table" ? "bg-accent" : ""}
                  onClick={() => {
                    setCurrentView("table");
                    setViewMode("list");
                  }}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Table
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "cards" ? "bg-accent" : ""}
                  onClick={() => {
                    setCurrentView("table");
                    setViewMode("grid");
                  }}
                >
                  <LayoutGridIcon className="h-4 w-4 mr-2" />
                  Cartes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "department" ? "bg-accent" : ""}
                  onClick={() => setCurrentView("department")}
                >
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Par département
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={currentView === "skills" ? "bg-accent" : ""}
                  onClick={() => setCurrentView("skills")}
                >
                  <BarChart2Icon className="h-4 w-4 mr-2" />
                  Par compétences
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 mb-6">
              <EmployeeSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              
              <div className="flex flex-wrap gap-2">
                <EmployeeFilters
                  employees={employees}
                  locationFilter={locationFilter}
                  setLocationFilter={setLocationFilter}
                  skillFilter={skillFilter}
                  setSkillFilter={setSkillFilter}
                />
                
                {currentView === "table" && (
                  <ViewModeToggle 
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                )}

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nouvelle ressource
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter une nouvelle ressource</DialogTitle>
                      <DialogDescription>
                        Veuillez remplir les informations pour créer une nouvelle ressource
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Nom et prénom"
                          className="col-span-3"
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="position" className="text-right">
                          Poste *
                        </Label>
                        <Input
                          id="position"
                          placeholder="Titre du poste"
                          className="col-span-3"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="adresse@email.com"
                          className="col-span-3"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+261 XX XXX XX"
                          className="col-span-3"
                          value={newEmployee.phone}
                          onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                          Département
                        </Label>
                        <Select
                          value={newEmployee.department}
                          onValueChange={(val) => setNewEmployee({ ...newEmployee, department: val })}
                        >
                          <SelectTrigger id="department" className="col-span-3">
                            <SelectValue placeholder="Département" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Support">Support</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Localisation
                        </Label>
                        <Select
                          value={newEmployee.location}
                          onValueChange={(val) => setNewEmployee({ ...newEmployee, location: val })}
                        >
                          <SelectTrigger id="location" className="col-span-3">
                            <SelectValue placeholder="Localisation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Madagascar">Madagascar</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="joinDate" className="text-right">
                          Date d'embauche
                        </Label>
                        <Input
                          id="joinDate"
                          type="date"
                          className="col-span-3"
                          value={newEmployee.joinDate}
                          onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="skills" className="text-right">
                          Compétences
                        </Label>
                        <Input
                          id="skills"
                          placeholder="React, TypeScript, Node.js (séparés par des virgules)"
                          className="col-span-3"
                          value={newEmployee.skills.join(', ')}
                          onChange={(e) => handleSkillChange(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="occupancyRate" className="text-right">
                          Taux d'occupation (%)
                        </Label>
                        <Input
                          id="occupancyRate"
                          type="number"
                          min="0"
                          max="100"
                          className="col-span-3"
                          value={newEmployee.occupancyRate}
                          onChange={(e) => setNewEmployee({ ...newEmployee, occupancyRate: parseInt(e.target.value) || 85 })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="manager" className="text-right">
                          Manager
                        </Label>
                        <Input
                          id="manager"
                          placeholder="Nom du manager"
                          className="col-span-3"
                          value={newEmployee.manager}
                          onChange={(e) => setNewEmployee({ ...newEmployee, manager: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddEmployee}>
                        Ajouter la ressource
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {currentView === "table" && (
              <EmployeeGrid 
                employees={filteredEmployees}
                viewMode={viewMode}
              />
            )}

            {currentView === "department" && (
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-bold mb-4">Répartition par département</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={140}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {departmentChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} ressources`, 'Nombre']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentView === "skills" && (
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h2 className="text-xl font-bold mb-4">Top 10 des compétences</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={skillsChartData()}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value) => [`${value} ressources`, 'Nombre']} />
                        <Legend />
                        <Bar dataKey="value" name="Nombre de ressources" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-4 text-sm text-muted-foreground">
              {filteredEmployees.length} ressources sur {employees.length} au total
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EmployeesPage;
