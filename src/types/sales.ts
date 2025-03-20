
export interface SalesOperationResponse {
  id: number;
  nom_du_projet: string;
  client: string;
  date_reception: string;
  tjm: number;
  chiffrage_jh: number;
  statut: 'en_cours' | 'envoye' | 'gagne' | 'perdu' | 'en_attente';
  commercial: string;
  personne_en_charge_msx: string;
  type_projet: string;
  remarques: string;
  url: string;
  created_at: string;
  updated_at: string;
}
