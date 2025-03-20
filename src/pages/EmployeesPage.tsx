import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "@/services/api";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { SkillsSummaryPanel } from "@/components/employees/SkillsSummaryPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, BarChart2, PieChart, Table as TableIcon, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { CSVImportForm } from "@/components/import/CSVImportForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GSheetSync } from "@/components/import/GSheetSync";
import { gsheetApi } from "@/services/api/gsheetApi";

type ViewMode = "cards" | "table" | "chart";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<ViewMode>("cards");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: employees = [], isLoading, isError, error } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getAllEmployees
  });

  const handleGSheetSync = async (spreadsheetId: string) => {
    try {
      const result = await gsheetApi.syncOccupation(spreadsheetId);
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ['occupation'] });
        toast.success('Synchronisation des taux d\'occupation réussie');
      }
    } catch (error) {
      window.console.error('Occupation sync error:', error);
      toast.error('Erreur lors de la synchronisation des taux d\'occupation');
      throw error;
    }
  };

  // Filtrage des employés
  const filteredEmployees = employees.filter((employee) => {
    const searchFields = [
      employee?.name?.toLowerCase() || "",
      employee?.position?.toLowerCase() || "",
      employee?.email?.toLowerCase() || "",
    ];
    return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
  });

  // Calcul des statistiques de compétences
  const calculateSkillsStats = () => {
    const skillsMap = new Map<string, number>();
    
    if (filteredEmployees.length === 0) {
      return [];
    }

    filteredEmployees.forEach(employee => {
      if (Array.isArray(employee.competences_2024)) {
        employee.competences_2024.forEach(skill => {
          if (skill && skill.trim()) {
            skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
          }
        });
      }
    });

    return Array.from(skillsMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / filteredEmployees.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  };

   // Gestion des erreurs
  if (isError && error) {
    toast.error(`Erreur lors du chargement des ressources: ${error.message}`);
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div>
              {/* Barre de recherche et filtres */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, poste, email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle ressource
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle ressource</DialogTitle>
                        <DialogDescription>
                          Remplissez les informations pour ajouter une nouvelle ressource
                        </DialogDescription>
                      </DialogHeader>
                      {/* TODO: Add EmployeeForm component here */}
                    </DialogContent>
                  </Dialog>

                  <GSheetSync 
                    pageId="employees" 
                    onSync={handleGSheetSync} 
                  />

                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Importer des ressources</DialogTitle>
                        <DialogDescription>
                          Uploadez un fichier CSV pour importer plusieurs ressources
                        </DialogDescription>
                      </DialogHeader>
                      <CSVImportForm onClose={() => setIsImportDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Boutons de vue */}
                <div className="flex gap-2">
                  <Button
                    variant={currentView === "cards" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("cards")}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Cartes
                  </Button>
                  <Button
                    variant={currentView === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("table")}
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                  <Button
                    variant={currentView === "chart" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("chart")}
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Statistiques
                  </Button>
                </div>
              </div>

              {/* Affichage du contenu selon la vue sélectionnée */}
              {currentView === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard key={employee.id} employee={employee} />
                  ))}
                </div>
              )}

              {currentView === "table" && (
                <EmployeeTable employees={filteredEmployees} />
              )}

              {currentView === "chart" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Statistiques des compétences */}
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Distribution des Compétences</h3>
                    <div className="space-y-4">
                      {calculateSkillsStats().length > 0 ? (
                        calculateSkillsStats().map((skill) => (
                          <div key={skill.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {skill.count} ressource{skill.count > 1 ? 's' : ''} ({skill.percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full">
                              <div
                                className="h-2 bg-primary rounded-full"
                                style={{
                                  width: `${skill.percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Aucune compétence trouvée
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statistiques des postes */}
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Distribution des Postes</h3>
                    <div className="space-y-4">
                      {Object.entries(
                        filteredEmployees.reduce((acc, employee) => {
                          acc[employee.position] = (acc[employee.position] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([position, count]) => (
                        <div key={position}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{position}</span>
                            <span className="text-sm text-muted-foreground">
                              {count} ressource{count > 1 ? 's' : ''} ({((count / filteredEmployees.length) * 100).toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{
                                width: `${(count / filteredEmployees.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};
