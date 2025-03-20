
// Fix the import and type issues, changing nullable values to optional

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

interface ProjectCSVRow {
  [key: string]: string;
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
    return {
      nom_projet: row["nom_projet"] || "",
      client: row["client"] || "",
      statut: row["statut"] || "en_cours",
      categorie_projet: row["categorie_projet"] || "Autre",
      localite: row["localite"] || "Local",
      date_debut: row["date_debut"] || new Date().toISOString().split("T")[0],
      date_fin_prevu: row["date_fin_prevu"] || "",
      date_fin_reelle: row["date_fin_reelle"] || undefined, // Changed from null to undefined
      description_bc: row["description_bc"] || "",
      tjm: row["tjm"] || "0",
      charge_vendu_jours: row["charge_vendu_jours"] || "0",
      cp: row["cp"] || "",
      technologie: row["technologie"] || undefined,
      secteur: row["secteur"] || undefined,
      bu: row["bu"] || ""
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
        onComplete: async (projectsData) => {
          try {
            // Create projects in batches
            for (let i = 0; i < projectsData.length; i += 5) {
              const batch = projectsData.slice(i, i + 5);
              
              for (const project of batch) {
                try {
                  await projectApi.createProject(project);
                  toast.success(`Projet "${project.nom_projet}" importé avec succès`);
                } catch (projectError) {
                  const errorMessage = projectError instanceof Error ? projectError.message : 'Unknown error';
                  toast.error(`Erreur lors de l'importation du projet "${project.nom_projet}": ${errorMessage}`);
                }
              }
            }
            
            onClose();
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
      "nom_projet",
      "client",
      "statut",
      "categorie_projet",
      "localite",
      "date_debut",
      "date_fin_prevu",
      "date_fin_reelle",
      "description_bc",
      "tjm",
      "charge_vendu_jours",
      "cp",
      "technologie",
      "secteur",
      "bu"
    ].join(",");

    const csvContent = `${headers}\nProjet Example,Client Example,en_cours,Forfait,Local,${new Date().toISOString().split("T")[0]},${new Date(Date.now() + 90*24*60*60*1000).toISOString().split("T")[0]},,Description,750,20,Chef de projet,React,Finance,IT`;
    
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
