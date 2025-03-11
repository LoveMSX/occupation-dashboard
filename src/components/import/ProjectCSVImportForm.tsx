import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { projectApi, ProjectRequest } from "@/services/api";
import type { CSVRow } from "@/types/csv";

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

    Papa.parse<CSVRow>(file, {
      header: true,
      complete: async (results) => {
        const projects: ProjectRequest[] = results.data.map((row: CSVRow) => ({
          nom_projet: row["Nom du projet"] || "",
          client: row.Client || "",
          statut: row.Statut || "ongoing",
          categorie_projet: row["Catégorie"] || "TMA",
          localite: row.Localisation || "Local",
          date_debut: row["Date début"] || new Date().toISOString().split("T")[0],
          date_fin_prevu: row["Date fin prévue"] || new Date().toISOString().split("T")[0],
          date_fin_reelle: row["Date fin réelle"],
          description_bc: row.Description || "",
          tjm: row.TJM || "0",
          charge_vendu_jours: row["Charge vendue"] || "0",
          cp: row.CP || "",
          technologie: row.Technologie || "",
          secteur: row.Secteur || "",
          bu: row.BU || "MSX"
        }));

        try {
          // Create projects in batches
          for (let i = 0; i < projects.length; i += 10) {
            const batch = projects.slice(i, i + 10);
            await Promise.all(batch.map(project => projectApi.createProject(project)));
          }
          
          toast.success(`${projects.length} projets importés avec succès`);
          onClose();
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Erreur lors de l'importation: ${error.message}`);
          } else {
            toast.error("Une erreur inattendue s'est produite");
          }
        } finally {
          setIsLoading(false);
        }
      },
      error: (error) => {
        if (error instanceof Error) {
          toast.error(`Erreur lors de la lecture du fichier CSV: ${error.message}`);
        } else {
          toast.error("Une erreur inattendue s'est produite lors de la lecture du fichier");
        }
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
