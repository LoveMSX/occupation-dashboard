
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCsvParser } from "@/hooks/use-csv-parser";

interface ResourceCSVImportFormProps {
  onClose: () => void;
}

// Define the ResourceRequest interface
interface ResourceRequest {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  statut: string;
  poste: string;
  bu: string;
  niveau: string;
  date_entree: string;
  date_sortie?: string;
  manager: string;
  client_actuel: string;
  projet_actuel: string;
  tjm: number;
  disponibilite: string;
  remarques: string;
  commentaire: string;
}

// Create a resourceApi object with necessary methods
const resourceApi = {
  createResource: async (resource: ResourceRequest) => {
    console.log("Creating resource:", resource);
    return resource;
  }
};

export const ResourceCSVImportForm = ({ onClose }: ResourceCSVImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { parseCSV, isLoading } = useCsvParser<ResourceRequest>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const transformResourceRow = (row: Record<string, string>): ResourceRequest => {
    return {
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
      manager: row["Manager"] || "",
      client_actuel: row["Client actuel"] || "",
      projet_actuel: row["Projet actuel"] || "",
      tjm: Number(row["TJM"] || "0"),
      disponibilite: row["Disponibilité"] || "",
      remarques: row["Remarques"] || "",
      commentaire: row["Commentaire"] || ""
    };
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    try {
      await parseCSV(file, {
        transform: transformResourceRow,
        onComplete: async (resources) => {
          try {
            // Create resources in batches
            for (let i = 0; i < resources.length; i += 10) {
              const batch = resources.slice(i, i + 10);
              await Promise.all(batch.map(resource => resourceApi.createResource(resource)));
            }
            
            toast.success(`${resources.length} ressources importées avec succès`);
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
      "Manager",
      "Client actuel",
      "Projet actuel",
      "TJM",
      "Disponibilité",
      "Remarques",
      "Commentaire"
    ].join(",");

    const csvContent = `${headers}\nJohn,Doe,john.doe@example.com,0612345678,CDI,Développeur Full-Stack,MSX,Senior,${new Date().toISOString().split("T")[0]},,Jane Smith,Client Example,Projet Example,750,Fin du mois,Excellent développeur,Anglais courant`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_ressources.csv";
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
