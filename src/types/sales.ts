
export interface SalesOperationRequest {
  nom_du_projet: string;
  client: string;
  date_reception: string;
  tjm?: string;
  chiffrage_jh?: string;
  statut: "en_cours" | "envoye" | "gagne" | "perdu" | "en_attente";
  commerciale?: string;
  personne_en_charge_msx?: string;
  type_projet?: string;
  remarques?: string;
  url?: string;
}

export interface SalesOperationResponse extends SalesOperationRequest {
  id: number;
  created_at: string;
  updated_at: string;
}
