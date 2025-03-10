import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Papa from "papaparse";
import { employeeApi } from "@/services/api";
import { EmployeeRequest } from "@/services/api";

interface CSVImportFormProps {
  onClose: () => void;
}

export const CSVImportForm = ({ onClose }: CSVImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Appelation",
      "Poste",
      "Email",
      "Téléphone",
      "Compétences",
      "Location",
      "Date entrée",
      "Manager",
      "Taux d'occupation"
    ].join(",");

    const csvContent = `${headers}\nJohn Doe,Développeur Full-Stack,john.doe@example.com,0612345678,"React, Node.js, TypeScript",Madagascar,${new Date().toISOString().split("T")[0]},Jane Smith,85`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_employees.csv";
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
          Appelation?: string;
          Poste?: string;
          Email?: string;
          Téléphone?: string;
          Compétences?: string;
          Location?: string;
          "Date entrée"?: string;
          Manager?: string;
          "Taux d'occupation"?: string;
        }

        const employees: EmployeeRequest[] = results.data.map((row: CSVRow) => ({
          appelation: row.Appelation || "",
          poste: row.Poste || "",
          email: row.Email || "",
          phone: row.Téléphone || "",
          competences_2024: row.Compétences ? row.Compétences.split(",").map((s: string) => s.trim()) : [],
          nom_prenoms_copie_jira: row.Appelation || "",
          location: row.Location || "Madagascar",
          date_debauche: row["Date entrée"] || new Date().toISOString().split("T")[0],
          manager: row.Manager || "",
          occupancyRate: parseInt(row["Taux d'occupation"] || "85"),
          projects: []
        }));

        try {
          // Create employees in batches
          for (let i = 0; i < employees.length; i += 10) {
            const batch = employees.slice(i, i + 10);
            await Promise.all(batch.map(employee => employeeApi.createEmployee(employee)));
          }
          
          toast.success(`${employees.length} ressources importées avec succès`);
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
