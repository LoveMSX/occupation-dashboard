
import { SalesOperationResponse } from '@/types/sales';

interface SalesByStatus {
  status: string;
  count: number;
  percentage: number;
}

interface SalesByClient {
  commercial: string;
  value: number;
}

interface SalesByProject {
  type: string;
  count: number;
  percentage: number;
}

interface SalesMetrics {
  totalOpportunities: number;
  totalValue: number;
  averageTJM: number;
  wonRate: number;
  lostRate: number;
  inProgressRate: number;
  byStatus: SalesByStatus[];
  byCommercial: SalesByClient[];
  byType: SalesByProject[];
  recentOpportunities: SalesOperationResponse[];
}

export function analyzeSalesData(salesData: SalesOperationResponse[]): SalesMetrics {
  if (!salesData || salesData.length === 0) {
    return {
      totalOpportunities: 0,
      totalValue: 0,
      averageTJM: 0,
      wonRate: 0,
      lostRate: 0,
      inProgressRate: 0,
      byStatus: [],
      byCommercial: [],
      byType: [],
      recentOpportunities: []
    };
  }

  // Total number of opportunities
  const totalOpportunities = salesData.length;

  // Calculate total value and average TJM
  let totalValue = 0;
  let tjmSum = 0;
  let tjmCount = 0;

  salesData.forEach(sale => {
    if (sale.tjm && sale.chiffrage_jh) {
      totalValue += sale.tjm * sale.chiffrage_jh;
      tjmSum += sale.tjm;
      tjmCount++;
    }
  });

  const averageTJM = tjmCount > 0 ? Math.round(tjmSum / tjmCount) : 0;

  // Calculate statistics by status
  const statusCounts: Record<string, number> = {};
  salesData.forEach(sale => {
    const status = sale.statut;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const wonCount = statusCounts['gagne'] || 0;
  const lostCount = statusCounts['perdu'] || 0;
  const inProgressCount = statusCounts['en_cours'] || 0;

  const wonRate = totalOpportunities > 0 ? (wonCount / totalOpportunities) * 100 : 0;
  const lostRate = totalOpportunities > 0 ? (lostCount / totalOpportunities) * 100 : 0;
  const inProgressRate = totalOpportunities > 0 ? (inProgressCount / totalOpportunities) * 100 : 0;

  // Create by status array for charts
  const byStatus: SalesByStatus[] = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: totalOpportunities > 0 ? (count / totalOpportunities) * 100 : 0
  }));

  // Group by commercial
  const commercialCounts: Record<string, number> = {};
  salesData.forEach(sale => {
    const commercial = sale.commercial || 'Unknown';
    commercialCounts[commercial] = (commercialCounts[commercial] || 0) + 1;
  });

  const byCommercial: SalesByClient[] = Object.entries(commercialCounts)
    .map(([commercial, value]) => ({ commercial, value }))
    .sort((a, b) => b.value - a.value);

  // Group by project type
  const typeCounts: Record<string, number> = {};
  salesData.forEach(sale => {
    const type = sale.type_projet || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const byType: SalesByProject[] = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: totalOpportunities > 0 ? (count / totalOpportunities) * 100 : 0
  }));

  // Get recent opportunities (last 5)
  const recentOpportunities = [...salesData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return {
    totalOpportunities,
    totalValue,
    averageTJM,
    wonRate,
    lostRate,
    inProgressRate,
    byStatus,
    byCommercial,
    byType,
    recentOpportunities
  };
}

export function generateSalesInsights(analysis: SalesMetrics): string {
  if (!analysis || analysis.totalOpportunities === 0) {
    return "Aucune donnée de vente disponible pour l'analyse.";
  }

  const {
    totalOpportunities,
    totalValue,
    averageTJM,
    wonRate,
    lostRate,
    inProgressRate,
    byStatus,
    byCommercial,
    byType
  } = analysis;

  // Format numbers
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(num);
  };

  const formatPercentage = (num: number): string => {
    return `${Math.round(num)}%`;
  };

  // Generate insights text
  let insights = `# Analyse des Ventes\n\n`;

  // Summary section
  insights += `## Résumé\n\n`;
  insights += `- **Nombre total d'opportunités**: ${totalOpportunities}\n`;
  insights += `- **Valeur totale**: ${formatNumber(totalValue)}\n`;
  insights += `- **TJM moyen**: ${formatNumber(averageTJM)}\n`;
  insights += `- **Taux de réussite**: ${formatPercentage(wonRate)}\n`;
  insights += `- **Taux d'échec**: ${formatPercentage(lostRate)}\n`;
  insights += `- **En cours**: ${formatPercentage(inProgressRate)}\n\n`;

  // By status section
  insights += `## Répartition par statut\n\n`;
  byStatus.forEach(status => {
    insights += `- **${status.status}**: ${status.count} (${formatPercentage(status.percentage)})\n`;
  });
  insights += '\n';

  // By commercial section
  insights += `## Top commerciaux\n\n`;
  byCommercial.slice(0, 5).forEach(commercial => {
    insights += `- **${commercial.commercial}**: ${commercial.value} opportunités\n`;
  });
  insights += '\n';

  // By project type section
  insights += `## Répartition par type de projet\n\n`;
  byType.forEach(type => {
    insights += `- **${type.type}**: ${type.count} (${formatPercentage(type.percentage)})\n`;
  });
  insights += '\n';

  // Recommendations
  insights += `## Recommandations\n\n`;
  
  // Success rate recommendations
  if (wonRate < 30) {
    insights += `- **Améliorer le taux de réussite**: Le taux actuel de ${formatPercentage(wonRate)} est assez bas. Analysez les raisons des échecs et mettez en place des mesures correctives.\n`;
  } else if (wonRate > 70) {
    insights += `- **Taux de réussite élevé**: Avec ${formatPercentage(wonRate)}, vous avez un excellent taux de conversion. Envisagez d'augmenter vos tarifs ou d'être plus sélectif dans vos opportunités.\n`;
  }
  
  // TJM recommendations
  if (averageTJM < 500) {
    insights += `- **Augmenter le TJM**: Votre TJM moyen de ${formatNumber(averageTJM)} est relativement bas. Concentrez-vous sur des projets à plus forte valeur ajoutée.\n`;
  } else if (averageTJM > 800) {
    insights += `- **TJM élevé**: Avec un TJM moyen de ${formatNumber(averageTJM)}, vous êtes bien positionné. Vérifiez que votre proposition de valeur reste alignée avec ces tarifs.\n`;
  }
  
  // Commercial focus
  if (byCommercial.length > 0) {
    const topCommercial = byCommercial[0];
    if (topCommercial.value > totalOpportunities * 0.5) {
      insights += `- **Diversifier les sources d'opportunités**: ${topCommercial.commercial} représente une grande partie des opportunités. Développez d'autres canaux pour réduire la dépendance.\n`;
    }
  }
  
  // Project type focus
  if (byType.length > 0) {
    const topType = byType.sort((a, b) => b.count - a.count)[0];
    insights += `- **Type de projet dominant**: Les projets "${topType.type}" représentent ${formatPercentage(topType.percentage)} de vos opportunités. Evaluez si cette spécialisation est stratégique.\n`;
  }

  return insights;
}
