import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { projectApi, ProjectRequest } from "@/services/api";

interface ProjectCSVImportFormProps {
  onClose: () => void;
}

export const ProjectCSVImportForm = ({ onClose }: ProjectCSVImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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

  const handleImport = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        interface CSVRow {
          [key: string]: string;
        }

        try {
          // Validate data before processing
          if (!results.data || results.data.length === 0) {
            throw new Error("Le fichier CSV ne contient pas de données valides");
          }

          const projects = [];
          
          // Process each row individually to avoid issues with the entire batch
          for (const row of results.data) {
            if (!row || typeof row !== 'object' || Object.keys(row).length === 0) {
              continue;
            }
            
            const csvRow = row as CSVRow;
            
            // Sanitize numeric values
            const tjm = csvRow["TJM"] ? 
              csvRow["TJM"].toString().replace(/[^\d.,]/g, '').replace(',', '.') : "0";
            
            const chargeVendue = csvRow["Charge vendue"] ? 
              csvRow["Charge vendue"].toString().replace(/[^\d.,]/g, '').replace(',', '.') : "0";
            
            // Create a clean project object with only the necessary fields
            const project = {
              nom_projet: csvRow["Nom du projet"] || "",
              client: csvRow["Client"] || "",
              statut: csvRow["Statut"] || "ongoing",
              categorie_projet: csvRow["Catégorie"] || "TMA",
              localite: csvRow["Localisation"] || "Local",
              date_debut: csvRow["Date début"] || new Date().toISOString().split("T")[0],
              date_fin_prevu: csvRow["Date fin prévue"] || new Date().toISOString().split("T")[0],
              date_fin_reelle: csvRow["Date fin réelle"] || null,
              description_bc: csvRow["Description"] || "",
              tjm: tjm,
              charge_vendu_jours: chargeVendue,
              cp: csvRow["CP"] || "",
              technologie: csvRow["Technologie"] || "",
              secteur: csvRow["Secteur"] || "",
              bu: csvRow["BU"] || "MSX"
            };
            
            projects.push(project);
          }

          if (projects.length === 0) {
            throw new Error("Aucun projet valide n'a été trouvé dans le fichier CSV");
          }

          // Create projects one by one
          let successCount = 0;
          let errorMessages = [];
          
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
              const errorMsg = `Erreur pour "${project.nom_projet}": ${projectError.message}`;
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
          toast.error(`Erreur lors de l'importation: ${error.message || "Erreur inconnue"}`);
        } finally {
          setIsLoading(false);
        }
      },
      error: (error) => {
        toast.error(`Erreur lors de la lecture du fichier CSV: ${error.message}`);
        setIsLoading(false);
      }
    });
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
