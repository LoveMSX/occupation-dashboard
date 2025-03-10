import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { salesApi, SalesOperationRequest } from "@/services/api";

interface SalesCSVImportFormProps {
  onClose: () => void;
}

export const SalesCSVImportForm = ({ onClose }: SalesCSVImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
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

        const sales: SalesOperationRequest[] = results.data.map((row: CSVRow) => ({
          nom_du_projet: row["Nom du projet"] || "",
          client: row.Client || "",
          date_reception: row["Date réception"] || new Date().toISOString().split("T")[0],
          tjm: row.TJM || undefined,
          chiffrage_jh: row["Chiffrage JH"] || undefined,
          statut: row.Statut as "en_cours" | "envoye" | "gagne" | "perdu" | "en_attente" || "en_cours",
          commerciale: row.Commerciale || undefined,
          personne_en_charge_msx: row["Personne en charge MSX"] || undefined,
          type_projet: row["Type projet"] || undefined,
          remarques: row.Remarques || undefined,
          url: row.URL || undefined
        }));

        try {
          // Create sales in batches
          for (let i = 0; i < sales.length; i += 10) {
            const batch = sales.slice(i, i + 10);
            await Promise.all(batch.map(sale => salesApi.createSalesOperation(sale)));
          }
          
          toast.success(`${sales.length} opportunités importées avec succès`);
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
