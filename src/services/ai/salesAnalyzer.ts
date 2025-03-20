
import { SalesOperationResponse } from '@/services/api';

export interface SalesAnalysis {
  totalOppCount: number;
  totalAmount: number;
  avgTJM: number;
  avgJH: number;
  statusDistribution: Record<string, number>;
  topClients: { name: string; count: number }[];
  monthlyTrends: { month: string; count: number; amount: number }[];
  performance: string;
}

export const analyzeSalesData = (sales: SalesOperationResponse[]): SalesAnalysis => {
  if (!sales || sales.length === 0) {
    return {
      totalOppCount: 0,
      totalAmount: 0,
      avgTJM: 0,
      avgJH: 0,
      statusDistribution: {},
      topClients: [],
      monthlyTrends: [],
      performance: 'No data available'
    };
  }

  // Analyze total opportunities and amounts
  const totalOppCount = sales.length;
  let totalAmount = 0;
  let totalTJM = 0;
  let totalJH = 0;
  const statusCount: Record<string, number> = {};
  const clientCount: Record<string, number> = {};
  const monthlyData: Record<string, { count: number; amount: number }> = {};

  sales.forEach(sale => {
    const amount = (sale.tjm || 0) * (sale.chiffrage_jh || 0);
    totalAmount += amount;
    totalTJM += sale.tjm || 0;
    totalJH += sale.chiffrage_jh || 0;

    // Count by status
    const status = sale.statut;
    statusCount[status] = (statusCount[status] || 0) + 1;

    // Count by client
    const client = sale.client;
    clientCount[client] = (clientCount[client] || 0) + 1;

    // Group by month
    const date = new Date(sale.date_reception);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { count: 0, amount: 0 };
    }
    monthlyData[monthYear].count += 1;
    monthlyData[monthYear].amount += amount;
  });

  // Calculate averages
  const avgTJM = totalTJM / totalOppCount;
  const avgJH = totalJH / totalOppCount;

  // Transform data for response
  const topClients = Object.entries(clientCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const monthlyTrends = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      count: data.count,
      amount: data.amount
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Evaluate performance
  const wonOpportunities = statusCount['gagne'] || 0;
  const winRate = totalOppCount > 0 ? (wonOpportunities / totalOppCount) * 100 : 0;
  
  let performance = '';
  if (winRate >= 70) {
    performance = 'Excellent';
  } else if (winRate >= 50) {
    performance = 'Good';
  } else if (winRate >= 30) {
    performance = 'Average';
  } else {
    performance = 'Needs improvement';
  }

  const stats = {
    totalOppCount,
    totalAmount,
    avgTJM,
    avgJH,
    statusDistribution: statusCount,
    topClients,
    monthlyTrends,
    performance
  };

  return stats as SalesAnalysis;
};

export const generateSalesInsights = (analysis: SalesAnalysis): string => {
  if (analysis.totalOppCount === 0) {
    return 'No sales data available for analysis.';
  }

  // Format numbers for display
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('fr-FR').format(Math.round(value * 100) / 100);

  // Generate status breakdown text
  const statusText = Object.entries(analysis.statusDistribution)
    .map(([status, count]) => {
      const percentage = (count / analysis.totalOppCount) * 100;
      return `- ${status}: ${count} (${percentage.toFixed(1)}%)`;
    })
    .join('\n');

  // Generate client breakdown text
  const clientsText = analysis.topClients
    .map(client => `- ${client.name}: ${client.count} opportunités`)
    .join('\n');

  // Generate insights
  return `
ANALYSE DES VENTES

Aperçu général
--------------
Nombre total d'opportunités: ${analysis.totalOppCount}
Valeur totale: ${formatCurrency(analysis.totalAmount)}
TJM moyen: ${formatCurrency(analysis.avgTJM)}
Charge moyenne (JH): ${formatNumber(analysis.avgJH)}

Répartition par statut
---------------------
${statusText}

Principaux clients
----------------
${clientsText}

Performance globale
----------------
${analysis.performance}

Recommandations
--------------
${getRecommendations(analysis)}
`;
};

function getRecommendations(analysis: SalesAnalysis): string {
  const recommendations = [];

  // Win rate based recommendations
  const totalOpps = analysis.totalOppCount;
  const wonOpps = analysis.statusDistribution['gagne'] || 0;
  const pendingOpps = analysis.statusDistribution['en_cours'] || 0;
  const lostOpps = analysis.statusDistribution['perdu'] || 0;
  
  const winRate = totalOpps > 0 ? (wonOpps / totalOpps) * 100 : 0;
  
  if (winRate < 30) {
    recommendations.push("- Examiner les raisons des échecs commerciaux pour améliorer le taux de réussite.");
  }
  
  if (pendingOpps > totalOpps * 0.5) {
    recommendations.push("- Accélérer le suivi des opportunités en cours pour éviter les délais trop longs.");
  }
  
  // TJM-based recommendations
  if (analysis.avgTJM < 600) {
    recommendations.push("- Envisager une stratégie de valorisation des prestations pour augmenter le TJM moyen.");
  }
  
  // Client concentration recommendations
  if (analysis.topClients.length > 0 && analysis.topClients[0].count > totalOpps * 0.3) {
    recommendations.push("- Diversifier le portefeuille client pour réduire la dépendance au client principal.");
  }
  
  // Add general recommendations if specific ones are insufficient
  if (recommendations.length < 2) {
    recommendations.push("- Maintenir un suivi régulier des opportunités commerciales.");
    recommendations.push("- Analyser les facteurs de succès des projets gagnés pour les reproduire.");
  }
  
  return recommendations.join('\n');
}
