import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResourceCSVImportForm } from "@/components/import/ResourceCSVImportForm";

export function ResourcesPage() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Importer CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importer des ressources</DialogTitle>
          <DialogDescription>
            Importez vos ressources à partir d'un fichier CSV.
            Téléchargez le template pour voir le format attendu.
          </DialogDescription>
        </DialogHeader>
        <ResourceCSVImportForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
