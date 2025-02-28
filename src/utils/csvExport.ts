
/**
 * Convertit un tableau d'objets en chaîne CSV
 * @param data Tableau d'objets à convertir
 * @param columns Liste des colonnes à inclure (les clés de l'objet)
 * @param columnNames Liste des noms de colonnes à afficher (titres)
 * @returns Chaîne au format CSV
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  columns: (keyof T)[],
  columnNames: string[]
): string {
  if (!data || !data.length) return '';
  
  // Créer l'en-tête
  let csvContent = columnNames.join(',') + '\r\n';
  
  // Ajouter les données
  data.forEach((item) => {
    const row = columns.map((key) => {
      // Traiter les valeurs spéciales (virgules, guillemets, etc.)
      const value = item[key];
      let formattedValue = value === null || value === undefined ? '' : String(value);
      
      // Entourer de guillemets si la valeur contient des virgules ou des guillemets
      if (formattedValue.includes(',') || formattedValue.includes('"')) {
        formattedValue = `"${formattedValue.replace(/"/g, '""')}"`;
      }
      
      return formattedValue;
    });
    
    csvContent += row.join(',') + '\r\n';
  });
  
  return csvContent;
}

/**
 * Télécharge une chaîne au format CSV
 * @param csvContent Contenu CSV à télécharger
 * @param filename Nom du fichier
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Ajouter BOM pour l'encodage UTF-8 correct (pour Excel)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  // Ajouter au DOM, cliquer et supprimer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Libérer l'URL
  URL.revokeObjectURL(url);
}
