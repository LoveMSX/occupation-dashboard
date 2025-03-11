
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { resourceApi, ResourceRequest } from "@/services/api";
import type { CSVRow } from "@/types/csv";

interface ResourceCSVImportFormProps {
  onClose: () => void;
}

export const ResourceCSVImportForm = ({ onClose }: ResourceCSVImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "Statut",
      "Poste",
      "BU",
      "Niveau",
      "Date d'entrée",
      "Date de sortie",
      "Salaire base",
      "Prime",
      "Type prime",
      "Charge",
      "Coût standard",
      "Commentaire"
    ].join(",");

    const csvContent = `${headers}\nJohn,Doe,john.doe@example.com,+33612345678,CDI,Développeur,MSX,Senior,${new Date().toISOString().split("T")[0]},,3500,500,Annuelle,2100,600,Exemple de commentaire`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_resources.csv";
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
      complete: async (results) => {
        const resources: ResourceRequest[] = (results.data as CSVRow[]).map((row: CSVRow) => ({
          prenom: row["Prénom"] || "",
          nom: row["Nom"] || "",
          email: row["Email"] || "",
          telephone: row["Téléphone"] || "",
          statut: row["Statut"] || "",
          poste: row["Poste"] || "",
          bu: row["BU"] || "MSX",
          niveau: row["Niveau"] || "",
          date_entree: row["Date d'entrée"] || new Date().toISOString().split("T")[0],
          date_sortie: row["Date de sortie"],
          salaire_base: row["Salaire base"],
          prime: row["Prime"],
          type_prime: row["Type prime"],
          charge: row["Charge"],
          cout_standard: row["Coût standard"],
          commentaire: row["Commentaire"] || ""
        }));

        try {
          // Create resources in batches
          for (let i = 0; i < resources.length; i += 10) {
            const batch = resources.slice(i, i + 10);
            await Promise.all(batch.map(resource => resourceApi.createResource(resource)));
          }
          
          toast.success(`${resources.length} ressources importées avec succès`);
          onClose();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite";
          toast.error(`Erreur lors de l'importation: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      },
      error: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite";
        toast.error(`Erreur lors de la lecture du fichier CSV: ${errorMessage}`);
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
