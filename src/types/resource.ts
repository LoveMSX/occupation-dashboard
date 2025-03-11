
export interface ResourceRequest {
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
  salaire_base?: string;
  prime?: string;
  type_prime?: string;
  charge?: string;
  cout_standard?: string;
  commentaire: string;
}
