import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employeeApi, EmployeeRequest } from "@/services/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


interface EmployeeFormProps {
  onClose: () => void;
}

export function EmployeeForm({ onClose }: EmployeeFormProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeRequest>({
    appelation: "",
    poste: "",
    email: "",
    phone: "",
    competences_2024: [],
    nom_prenoms_copie_jira: "",
    location: "Madagascar",
    date_debauche: new Date().toISOString().split("T")[0],
    manager: "",
    occupancyRate: 85,
    projects: []
  });

  const addEmployeeMutation = useMutation({
    mutationFn: (employee: EmployeeRequest) => employeeApi.createEmployee(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Ressource ajoutée avec succès');
      onClose();
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    addEmployeeMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appelation">Nom complet</Label>
          <Input
            id="appelation"
            value={formData.appelation}
            onChange={(e) => setFormData({ ...formData, appelation: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="poste">Poste</Label>
          <Input
            id="poste"
            value={formData.poste}
            onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => setFormData({ ...formData, location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Madagascar">Madagascar</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Maurice">Maurice</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_debauche">Date d'entrée</Label>
          <Input
            id="date_debauche"
            type="date"
            value={formData.date_debauche}
            onChange={(e) => setFormData({ ...formData, date_debauche: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manager">Manager</Label>
          <Input
            id="manager"
            value={formData.manager}
            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupancyRate">Taux d'occupation (%)</Label>
          <Input
            id="occupancyRate"
            type="number"
            min="0"
            max="100"
            value={formData.occupancyRate}
            onChange={(e) => setFormData({ ...formData, occupancyRate: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer"}
        </Button>
      </div>
    </form>
  );
}