
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { resourceApi } from "@/services/resourceApi";
import { ResourceRequest } from "@/types/resource";
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
      "Date Entrée",
      "Date Sortie",
      "Salaire Base",
      "Prime",
      "Type Prime",
      "Charge",
      "Coût Standard",
      "Commentaire"
    ].join(",");

    const csvContent = `${headers}\nJohn,Doe,john.doe@example.com,0612345678,CDI,Développeur,MSX,Senior,${new Date().toISOString().split("T")[0]},,4000,500,Variable,80,350,Nouvel employé`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_ressources.csv";
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
        const resources: ResourceRequest[] = results.data.map((row: any) => ({
          prenom: row.Prénom || "",
          nom: row.Nom || "",
          email: row.Email || "",
          telephone: row.Téléphone || "",
          statut: row.Statut || "CDI",
          poste: row.Poste || "",
          bu: row.BU || "MSX",
          niveau: row.Niveau || "",
          date_entree: row["Date Entrée"] || new Date().toISOString().split("T")[0],
          date_sortie: row["Date Sortie"],
          salaire_base: row["Salaire Base"],
          prime: row.Prime,
          type_prime: row["Type Prime"],
          charge: row.Charge,
          cout_standard: row["Coût Standard"],
          commentaire: row.Commentaire || ""
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
