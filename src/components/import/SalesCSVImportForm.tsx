
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { salesApi, SalesOperationRequest } from "@/services/api";
import { useCsvParser } from "@/hooks/use-csv-parser";

interface SalesCSVImportFormProps {
  onClose: () => void;
}

// Define a type for the CSV row structure
interface SalesCSVRow {
  "Nom du projet"?: string;
  Client?: string;
  "Date réception"?: string;
  TJM?: string;
  "Chiffrage JH"?: string;
  Statut?: string;
  Commerciale?: string;
  "Personne en charge MSX"?: string;
  "Type projet"?: string;
  Remarques?: string;
  URL?: string;
}

export const SalesCSVImportForm = ({ onClose }: SalesCSVImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { parseCSV, isLoading } = useCsvParser<SalesOperationRequest>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const transformSalesRow = (row: Record<string, string>): SalesOperationRequest => {
    // Parse tjm to number or use 0 as default
    const tjm = row.TJM ? parseFloat(row.TJM.replace(/[^\d.,]/g, '').replace(',', '.')) : 0;
    
    // Parse chiffrage_jh to number or use 0 as default
    const chiffrage_jh = row["Chiffrage JH"] ? 
      parseFloat(row["Chiffrage JH"].replace(/[^\d.,]/g, '').replace(',', '.')) : 0;
    
    // Ensure statut is a valid enum value
    const validStatus = ['en_cours', 'envoye', 'gagne', 'perdu', 'en_attente'] as const;
    const status = row.Statut?.toLowerCase() as typeof validStatus[number] || "en_cours";
    
    return {
      nom_du_projet: row["Nom du projet"] || "",
      client: row.Client || "",
      date_reception: row["Date réception"] || new Date().toISOString().split("T")[0],
      tjm: tjm,
      chiffrage_jh: chiffrage_jh,
      statut: status,
      commerciale: row.Commerciale || "",
      personne_en_charge_msx: row["Personne en charge MSX"] || "",
      type_projet: row["Type projet"] || "",
      remarques: row.Remarques || "",
      url: row.URL || ""
    };
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    try {
      await parseCSV(file, {
        transform: transformSalesRow,
        onComplete: async (salesData) => {
          try {
            // Create sales in batches
            for (let i = 0; i < salesData.length; i += 10) {
              const batch = salesData.slice(i, i + 10);
              await Promise.all(batch.map(sale => salesApi.createSalesOperation(sale)));
            }
            
            toast.success(`${salesData.length} opportunités importées avec succès`);
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
      "Nom du projet",
      "Client",
      "Date réception",
      "TJM",
      "Chiffrage JH",
      "Statut",
      "Commerciale",
      "Personne en charge MSX",
      "Type projet",
      "Remarques",
      "URL"
    ].join(",");

    const csvContent = `${headers}\nProjet Example,Client Example,${new Date().toISOString().split("T")[0]},750,10,En cours,John Doe,Jane Smith,Développement,Remarques example,https://example.com`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_opportunites.csv";
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
