import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translations dictionary
const translations = {
  en: {
    // General
    "app.name": "MSX Dashboard",
    dashboard: "Dashboard",
    employees: "Employees",
    resources: "Resources",
    projects: "Projects",
    analytics: "Analytics",
    import: "Import Data",
    settings: "Settings",
    logout: "Logout",
    search: "Search...",
    notifications: "Notifications",
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",

    // Dashboard
    "total.employees": "Total Resources",
    "active.projects": "Active Projects",
    "avg.occupancy": "Avg. Occupancy",
    utilization: "Utilization",
    "from.last.month": "from last month",

    // Analytics
    "occupancy.rate": "Occupancy Rate",
    "project.distribution": "Project Distribution",
    "occupancy.rate.analytics": "Occupancy Rate Analytics",
    "project.distribution.analytics": "Project Distribution Analytics",
    "monthly.occupancy.trend": "Monthly Occupancy Trend",
    "occupancy.vs.utilization":
      "Occupancy rate vs. utilization over the past year",
    "occupancy.by.department": "Occupancy by Department",
    "avg.occupancy.departments":
      "Average occupancy rate across different departments",
    "occupancy.by.seniority": "Occupancy by Seniority",
    "occupancy.seniority.levels":
      "Occupancy rates across different seniority levels",
    "current.vs.previous": "Current vs. Previous Quarter",
    "comparison.quarters": "Comparison of occupancy trends between quarters",

    // Projects
    "project.distribution.by.type": "Project Distribution by Type",
    "breakdown.projects.category": "Breakdown of projects by category",
    "employee.distribution.projects": "Resource Distribution Across Projects",
    "employee.allocation.projects": "Resource allocation across major projects",
    "project.allocation.department": "Project Allocation By Department",
    "heatmap.projects.departments": "Heatmap of projects across departments",
    "project.duration.distribution": "Project Duration Distribution",
    "projects.duration.category": "Number of projects by duration category",

    // Employees
    employee: "Employee",
    "add.employee": "Add Employee",
    "delete.employee": "Delete Employee",
    edit: "Edit",
    "edit.employee": "Edit Employee",
    save: "Save",
    skills: "Skills",
    "join.date": "Join Date",

    // Settings
    language: "Language",
    english: "English",
    french: "French",
    "account.information": "Account Information",
    "update.account.details": "Update your account details and preferences",
    appearance: "Appearance",
    "customize.dashboard": "Customize how the dashboard looks and feels",
    "security.settings": "Security Settings",
    "manage.password.security": "Manage your password and account security",
    "data.management": "Data Management",
    "configure.data.storage": "Configure data storage and retention policies",
    "api.access": "API Access",
    "manage.api.keys": "Manage API keys and integrations",
    "save.changes": "Save Changes",
    "changes.saved": "Changes saved successfully",
  },
  fr: {
    // General
    "app.name": "Tableau de Bord MSX",
    dashboard: "Tableau de Bord",
    employees: "Employés",
    resources: "Ressources",
    projects: "Projets",
    analytics: "Analyses",
    import: "Importer des Données",
    settings: "Paramètres",
    logout: "Déconnexion",
    search: "Rechercher...",
    notifications: "Notifications",
    monthly: "Mensuel",
    quarterly: "Trimestriel",
    yearly: "Annuel",

    // Dashboard
    "total.employees": "Total des Ressources",
    "active.projects": "Projets Actifs",
    "avg.occupancy": "Occupation Moyenne",
    utilization: "Utilisation",
    "from.last.month": "depuis le mois dernier",

    // Analytics
    "occupancy.rate": "Taux d'Occupation",
    "project.distribution": "Répartition des Projets",
    "occupancy.rate.analytics": "Analyses des Taux d'Occupation",
    "project.distribution.analytics": "Analyses de Répartition des Projets",
    "monthly.occupancy.trend": "Tendance Mensuelle d'Occupation",
    "occupancy.vs.utilization":
      "Taux d'occupation vs. utilisation au cours de l'année passée",
    "occupancy.by.department": "Occupation par Département",
    "avg.occupancy.departments":
      "Taux d'occupation moyen entre les différents départements",
    "occupancy.by.seniority": "Occupation par Ancienneté",
    "occupancy.seniority.levels":
      "Taux d'occupation entre les différents niveaux d'ancienneté",
    "current.vs.previous": "Trimestre Actuel vs. Précédent",
    "comparison.quarters":
      "Comparaison des tendances d'occupation entre trimestres",

    // Projects
    "project.distribution.by.type": "Répartition des Projets par Type",
    "breakdown.projects.category": "Répartition des projets par catégorie",
    "employee.distribution.projects": "Répartition des Ressources par Projet",
    "employee.allocation.projects":
      "Allocation des ressources sur les principaux projets",
    "project.allocation.department": "Allocation des Projets par Département",
    "heatmap.projects.departments":
      "Carte thermique des projets par département",
    "project.duration.distribution": "Répartition par Durée de Projet",
    "projects.duration.category": "Nombre de projets par catégorie de durée",

    // Employees
    employee: "Employé",
    "add.employee": "Ajouter un employé",
    "delete.employee": "Supprimer l'employé",
    edit: "Modifier",
    "edit.employee": "Modifier l'employé",
    save: "Enregistrer",
    skills: "Compétences",
    "join.date": "Date d'embauche",

    // Settings
    language: "Langue",
    english: "Anglais",
    french: "Français",
    "account.information": "Informations du Compte",
    "update.account.details":
      "Mettre à jour les détails et préférences de votre compte",
    appearance: "Apparence",
    "customize.dashboard": "Personnaliser l'apparence du tableau de bord",
    "security.settings": "Paramètres de Sécurité",
    "manage.password.security":
      "Gérer votre mot de passe et la sécurité du compte",
    "data.management": "Gestion des Données",
    "configure.data.storage":
      "Configurer les politiques de stockage et de conservation des données",
    "api.access": "Accès API",
    "manage.api.keys": "Gérer les clés API et les intégrations",
    "save.changes": "Sauvegarder les Modifications",
    "changes.saved": "Modifications enregistrées avec succès",
    "skills.summary": "Résumé des compétences",
    count: "Nombre",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Try to load language from localStorage on initial render
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Translate function
  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
