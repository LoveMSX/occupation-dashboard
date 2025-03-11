
export interface Project {
  id: number;
  nom_projet: string;
  client: string;
  statut: string;
  categorie_projet: string;
  localite: string;
  date_debut: string;
  date_fin_prevu: string;
  date_fin_reelle?: string;
  description_bc: string;
  tjm: string;
  charge_vendu_jours: string;
  cp: string;
  bu: string;
  created_at: string;
  updated_at: string;
  // Mapped properties for compatibility
  name: string;
  description: string;
  status: "ongoing" | "completed" | "planned" | "standby";
  category: "TMA" | "Regie" | "Forfait" | "Other";
  location: "Local" | "Offshore" | "Hybrid";
  startDate: string;
  endDate: string;
  progress: number;
  manager: {
    id: number;
    name: string;
    avatar: string;
  };
  team?: { id: number; name: string; avatar: string }[];
}

export interface ProjectRequest {
  nom_projet: string;
  client: string;
  statut: string;
  categorie_projet: string;
  localite: string;
  date_debut: string;
  date_fin_prevu: string;
  date_fin_reelle?: string;
  description_bc: string;
  tjm: string;
  charge_vendu_jours: string;
  cp: string;
  bu: string;
  technologie?: string;
  secteur?: string;
}
