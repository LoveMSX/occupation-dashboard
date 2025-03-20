
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { projectApi, ProjectRequest } from "@/services/api";
import { useCsvParser } from "@/hooks/use-csv-parser";

interface ProjectCSVImportFormProps {
  onClose: () => void;
}

// Define the CSV row structure
interface ProjectCSVRow {
  "Nom du projet"?: string;
  Client?: string;
  Statut?: string;
  Catégorie?: string;
  Localisation?: string;
  "Date début"?: string;
  "Date fin prévue"?: string;
  "Date fin réelle"?: string;
  Description?: string;
  TJM?: string;
  "Charge vendue"?: string;
  CP?: string;
  Technologie?: string;
  Secteur?: string;
  BU?: string;
}

export const ProjectCSVImportForm = ({ onClose }: ProjectCSVImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { parseCSV, isLoading } = useCsvParser<ProjectRequest>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const transformProjectRow = (row: Record<string, string>): ProjectRequest => {
    // Sanitize numeric values
    const tjm = row["TJM"] ? 
      row["TJM"].toString().replace(/[^\d.,]/g, '').replace(',', '.') : "0";
    
    const chargeVendue = row["Charge vendue"] ? 
      row["Charge vendue"].toString().replace(/[^\d.,]/g, '').replace(',', '.') : "0";
    
    return {
      nom_projet: row["Nom du projet"] || "",
      client: row["Client"] || "",
      statut: row["Statut"] || "ongoing",
      categorie_projet: row["Catégorie"] || "TMA",
      localite: row["Localisation"] || "Local",
      date_debut: row["Date début"] || new Date().toISOString().split("T")[0],
      date_fin_prevu: row["Date fin prévue"] || new Date().toISOString().split("T")[0],
      date_fin_reelle: row["Date fin réelle"] || null,
      description_bc: row["Description"] || "",
      tjm: tjm,
      charge_vendu_jours: chargeVendue,
      cp: row["CP"] || "",
      technologie: row["Technologie"] || "",
      secteur: row["Secteur"] || "",
      bu: row["BU"] || "MSX"
    };
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    try {
      await parseCSV(file, {
        transform: transformProjectRow,
        onComplete: async (projects) => {
          try {
            let successCount = 0;
            let errorMessages: string[] = [];
            
            for (const project of projects) {
              try {
                // Skip projects without required fields
                if (!project.nom_projet || !project.client) {
                  errorMessages.push(`Projet sans nom ou client: ${project.nom_projet || "Sans nom"}`);
                  continue;
                }
                
                await projectApi.createProject(project);
                successCount++;
              } catch (projectError) {
                const errorMsg = `Erreur pour "${project.nom_projet}": ${projectError instanceof Error ? projectError.message : 'Unknown error'}`;
                console.error(errorMsg);
                errorMessages.push(errorMsg);
              }
            }
            
            if (successCount > 0) {
              toast.success(`${successCount} projets importés avec succès`);
              if (errorMessages.length > 0) {
                toast.error(`${errorMessages.length} projets n'ont pas pu être importés`);
              }
              onClose();
            } else {
              toast.error(`Aucun projet n'a pu être importé. Vérifiez les erreurs dans la console.`);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Erreur lors de l'importation: ${errorMessage}`);
          }
        }
      });
    } catch (error) {
      console.error("CSV parsing error:", error);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Nom du projet",
      "Client",
      "Statut",
      "Catégorie",
      "Localisation",
      "Date début",
      "Date fin prévue",
      "Date fin réelle",
      "Description",
      "TJM",
      "Charge vendue",
      "CP",
      "Technologie",
      "Secteur",
      "BU"
    ].join(",");

    const csvContent = `${headers}\nProjet Example,Client Example,ongoing,TMA,Local,${new Date().toISOString().split("T")[0]},${new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0]},,Description example,750,10,John Doe,React,Finance,MSX`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_projets.csv";
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="csvFile">Fichier CSV</Label>
          <Button
            variant="link"
            className="text-sm"
            onClick={handleDownloadTemplate}
          >
            Télécharger le template
          </Button>
        </div>
        <Input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleImport} disabled={isLoading}>
          {isLoading ? "Importation..." : "Importer"}
        </Button>
      </div>
    </div>
  );
};
