import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { resourceApi, ResourceRequest } from "@/services/api";

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
      "Date entrée",
      "Date sortie",
      "TJM",
      "Salaire",
      "Technologie principale",
      "Technologies secondaires",
      "Localisation",
      "Mobilité",
      "Commentaire"
    ].join(",");

    const csvContent = `${headers}\nJohn,Doe,john.doe@example.com,0612345678,CDI,Développeur Full-Stack,MSX,Senior,${new Date().toISOString().split("T")[0]},,750,45000,React,"Node.js, TypeScript",Paris,Oui,Excellent développeur`;
    
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
        interface CSVRow {
          "Prénom"?: string;
          "Nom"?: string;
          "Email"?: string;
          "Téléphone"?: string;
          "Statut"?: string;
          "Poste"?: string;
          "BU"?: string;
          "Niveau"?: string;
          "Date entrée"?: string;
          "Date sortie"?: string;
          "TJM"?: string;
          "Salaire"?: string;
          "Technologie principale"?: string;
          "Technologies secondaires"?: string;
          "Localisation"?: string;
          "Mobilité"?: string;
          "Commentaire"?: string;
        }

        const resources: ResourceRequest[] = results.data.map((row: CSVRow) => ({
          prenom: row["Prénom"] || "",
          nom: row["Nom"] || "",
          email: row["Email"] || "",
          telephone: row["Téléphone"] || "",
          statut: row["Statut"] || "CDI",
          poste: row["Poste"] || "",
          bu: row["BU"] || "MSX",
          niveau: row["Niveau"] || "Junior",
          date_entree: row["Date entrée"] || new Date().toISOString().split("T")[0],
          date_sortie: row["Date sortie"] || undefined,
          tjm: row["TJM"] || "0",
          salaire: row["Salaire"] || "0",
          technologie_principale: row["Technologie principale"] || "",
          technologies_secondaires: row["Technologies secondaires"]?.split(",").map(tech => tech.trim()) || [],
          localisation: row["Localisation"] || "Paris",
          mobilite: row["Mobilité"]?.toLowerCase() === "oui",
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
          toast.error(`Erreur lors de l'importation: ${error.message}`);
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