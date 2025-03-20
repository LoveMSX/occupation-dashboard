
export interface SalesOpportunity {
  id: number;
  projectName: string;
  client: string;
  receptionDate: string;
  tjm: number;
  budget: string | number;
  status: "Envoyé" | "En cours" | "Gagné" | "Perdu" | "Attente élément";
  commercial: string;
}

export const salesOpportunities: SalesOpportunity[] = [
  {
    id: 1,
    projectName: "Suivi commerciale mobile",
    client: "S2PC",
    receptionDate: "2025-02-03",
    tjm: 120,
    budget: 42,
    status: "Envoyé",
    commercial: "Elodie"
  },
  {
    id: 2,
    projectName: "Gestion Approvisionnement",
    client: "STAR",
    receptionDate: "2025-02-02",
    tjm: 120,
    budget: 141,
    status: "Envoyé",
    commercial: "Herizo"
  },
  {
    id: 3,
    projectName: "Meca Managment",
    client: "IDrental",
    receptionDate: "2025-01-30",
    tjm: 120,
    budget: 66,
    status: "Envoyé",
    commercial: "Jean Yann"
  },
  {
    id: 4,
    projectName: "ChatBot",
    client: "Smartlight",
    receptionDate: "2025-02-05",
    tjm: 120,
    budget: 61,
    status: "Envoyé",
    commercial: "Anna"
  },
  {
    id: 5,
    projectName: "Telecommande batterie",
    client: "Solar Smart System",
    receptionDate: "2025-02-05",
    tjm: 120,
    budget: 37.66,
    status: "En cours",
    commercial: "Lola"
  },
  {
    id: 6,
    projectName: "Centre de service",
    client: "Jawad",
    receptionDate: "2025-02-06",
    tjm: 200,
    budget: "780-1000 JH (7 à 9 ETP)",
    status: "Envoyé",
    commercial: "Lola"
  },
  {
    id: 7,
    projectName: "Sport AnyWhere",
    client: "Sport Anywhere",
    receptionDate: "2025-02-18",
    tjm: 200,
    budget: 2000,
    status: "En cours",
    commercial: "Lola"
  },
  {
    id: 8,
    projectName: "GasyNet",
    client: "GasyNet",
    receptionDate: "2025-02-12",
    tjm: 100,
    budget: "1ETP",
    status: "En cours",
    commercial: "Herizo"
  },
  {
    id: 9,
    projectName: "Mobile flutter locale",
    client: "Habibo",
    receptionDate: "2025-02-10",
    tjm: 120,
    budget: 2,
    status: "Gagné",
    commercial: "Lola"
  },
  {
    id: 10,
    projectName: "Mobile Flutter: Tookta",
    client: "Phet-Nowbrains",
    receptionDate: "2025-02-14",
    tjm: 180,
    budget: 37,
    status: "En cours",
    commercial: "Lola"
  },
  {
    id: 11,
    projectName: "Prodigy",
    client: "Prodigy",
    receptionDate: "2025-01-27",
    tjm: 70,
    budget: "1ETP",
    status: "Gagné",
    commercial: "MP"
  },
  {
    id: 12,
    projectName: "Plume",
    client: "Tetralink",
    receptionDate: "2025-01-30",
    tjm: 225,
    budget: "1ETP",
    status: "Gagné",
    commercial: "PPA"
  },
  {
    id: 13,
    projectName: "Red on line",
    client: "Infopro",
    receptionDate: "2024-12-18",
    tjm: 140,
    budget: 6.5,
    status: "Gagné",
    commercial: ""
  },
  {
    id: 14,
    projectName: "Gutenberg agency",
    client: "Gutenburg",
    receptionDate: "2025-01-14",
    tjm: 180,
    budget: 3,
    status: "Gagné",
    commercial: ""
  },
  {
    id: 15,
    projectName: "Gutenberg agency",
    client: "Gutenburg",
    receptionDate: "2025-02-07",
    tjm: 180,
    budget: 15,
    status: "Gagné",
    commercial: ""
  },
  {
    id: 16,
    projectName: "ENC Trade",
    client: "Maison SORAK ENC",
    receptionDate: "2025-02-11",
    tjm: 0,
    budget: "",
    status: "Attente élément",
    commercial: "Elodie"
  },
  {
    id: 17,
    projectName: "Mobile en offline",
    client: "ARIMA à Tamatave",
    receptionDate: "2025-02-14",
    tjm: 120,
    budget: 19,
    status: "En cours",
    commercial: "Jean Yann"
  },
  {
    id: 18,
    projectName: "APERO",
    client: "VIVALTO HOME",
    receptionDate: "2025-02-11",
    tjm: 200,
    budget: 10,
    status: "Gagné",
    commercial: "Rindra"
  },
  {
    id: 19,
    projectName: "Kucing",
    client: "Kucing",
    receptionDate: "2025-01-13",
    tjm: 200,
    budget: 185,
    status: "En cours",
    commercial: "Rindra"
  },
  {
    id: 20,
    projectName: "Centre de service Upgrade Mongo, ES, nod",
    client: "",
    receptionDate: "2025-02-20",
    tjm: 0,
    budget: "",
    status: "En cours",
    commercial: "Nandrianina"
  },
  {
    id: 21,
    projectName: "Renouvellement Assurance Automobile",
    client: "ASSURANCES ARO",
    receptionDate: "2025-01-09",
    tjm: 120,
    budget: 15,
    status: "Gagné",
    commercial: ""
  }
];
