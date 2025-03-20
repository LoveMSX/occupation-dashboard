
import type { SalesOperationResponse } from '../api';

// Define interfaces for the sales analysis
interface SalesStats {
  totalOpportunities: number;
  totalTJM: number;
  totalJH: number;
  avgTJM: number;
  estimatedValue: number;
  byStatus: {
    en_cours: number;
    envoye: number;
    gagne: number;
    perdu: number;
    en_attente: number;
  };
  byMonth: Record<string, number>;
  byCommercial: Record<string, number>;
  byClient: Record<string, number>;
  byType: Record<string, number>;
}

interface TrendData {
  period: string;
  value: number;
}

interface SalesAnalysis {
  stats: SalesStats;
  winRatePercentage: number;
  avgDealSize: number;
  trendsByMonth: TrendData[];
  trendsByCommercial: Record<string, TrendData[]>;
  topClients: {client: string, value: number}[];
  topCommercials: {commercial: string, value: number}[];
}

/**
 * Analyze sales data to extract statistics and trends
 */
export const analyzeSalesData = (salesData: SalesOperationResponse[]): SalesAnalysis => {
  // Initialize statistics object
  const stats: SalesStats = {
    totalOpportunities: salesData.length,
    totalTJM: 0,
    totalJH: 0,
    avgTJM: 0,
    estimatedValue: 0,
    byStatus: {
      en_cours: 0,
      envoye: 0,
      gagne: 0,
      perdu: 0,
      en_attente: 0
    },
    byMonth: {},
    byCommercial: {},
    byClient: {},
    byType: {}
  };

  // Process sales data
  salesData.forEach(sale => {
    // Sum TJM and JH
    stats.totalTJM += sale.tjm || 0;
    stats.totalJH += sale.chiffrage_jh || 0;
    
    // Count by status
    if (sale.statut && stats.byStatus.hasOwnProperty(sale.statut)) {
      stats.byStatus[sale.statut as keyof typeof stats.byStatus]++;
    }
    
    // Group by month
    const month = sale.date_reception ? 
      new Date(sale.date_reception).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
      'Unknown';
    stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
    
    // Group by commercial
    const commercial = sale.commercial || 'Unknown';
    stats.byCommercial[commercial] = (stats.byCommercial[commercial] || 0) + 1;
    
    // Group by client
    const client = sale.client || 'Unknown';
    stats.byClient[client] = (stats.byClient[client] || 0) + 1;
    
    // Group by project type
    const type = sale.type_projet || 'Unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  });
  
  // Calculate averages
  stats.avgTJM = stats.totalOpportunities > 0 ? stats.totalTJM / stats.totalOpportunities : 0;
  stats.estimatedValue = stats.totalTJM * stats.totalJH;
  
  // Calculate win rate
  const winRatePercentage = calculateWinRate(stats);
  
  // Calculate average deal size
  const avgDealSize = calculateAvgDealSize(salesData);
  
  // Generate trends by month
  const trendsByMonth = generateTrendsByMonth(stats.byMonth);
  
  // Generate trends by commercial
  const trendsByCommercial = generateTrendsByCommercial(salesData);
  
  // Get top clients
  const topClients = getTopEntities(stats.byClient, 5);
  
  // Get top commercials
  const topCommercials = getTopEntities(stats.byCommercial, 5);
  
  return {
    stats,
    winRatePercentage,
    avgDealSize,
    trendsByMonth,
    trendsByCommercial,
    topClients,
    topCommercials
  };
};

/**
 * Calculate win rate percentage
 */
const calculateWinRate = (stats: SalesStats): number => {
  const totalCompleted = stats.byStatus.gagne + stats.byStatus.perdu;
  return totalCompleted > 0 ? (stats.byStatus.gagne / totalCompleted) * 100 : 0;
};

/**
 * Calculate average deal size
 */
const calculateAvgDealSize = (salesData: SalesOperationResponse[]): number => {
  const wonDeals = salesData.filter(sale => sale.statut === 'gagne');
  if (wonDeals.length === 0) return 0;
  
  const totalValue = wonDeals.reduce((sum, deal) => {
    return sum + (deal.tjm || 0) * (deal.chiffrage_jh || 0);
  }, 0);
  
  return totalValue / wonDeals.length;
};

/**
 * Generate trends by month
 */
const generateTrendsByMonth = (byMonth: Record<string, number>): TrendData[] => {
  // Convert to array and sort by date
  const months = Object.keys(byMonth)
    .map(key => ({ period: key, value: byMonth[key] }))
    .sort((a, b) => {
      const dateA = new Date(a.period);
      const dateB = new Date(b.period);
      return dateA.getTime() - dateB.getTime();
    });
  
  return months;
};

/**
 * Generate trends by commercial
 */
const generateTrendsByCommercial = (salesData: SalesOperationResponse[]): Record<string, TrendData[]> => {
  const commercialMonthMap: Record<string, Record<string, number>> = {};
  
  // Group sales by commercial and month
  salesData.forEach(sale => {
    const month = sale.date_reception ? 
      new Date(sale.date_reception).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
      'Unknown';
    
    const commercial = sale.commercial || 'Unknown';
    
    if (!commercialMonthMap[commercial]) {
      commercialMonthMap[commercial] = {};
    }
    
    commercialMonthMap[commercial][month] = (commercialMonthMap[commercial][month] || 0) + 1;
  });
  
  // Convert to trends format
  const trends: Record<string, TrendData[]> = {};
  
  Object.keys(commercialMonthMap).forEach(commercial => {
    trends[commercial] = Object.keys(commercialMonthMap[commercial])
      .map(month => ({
        period: month,
        value: commercialMonthMap[commercial][month]
      }))
      .sort((a, b) => {
        const dateA = new Date(a.period);
        const dateB = new Date(b.period);
        return dateA.getTime() - dateB.getTime();
      });
  });
  
  return trends;
};

/**
 * Get top entities by count
 */
const getTopEntities = (entityMap: Record<string, number>, limit: number): {client: string, value: number}[] => {
  return Object.keys(entityMap)
    .map(key => ({ client: key, value: entityMap[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

/**
 * Generate insights text based on analysis
 */
export const generateSalesInsights = (analysis: SalesAnalysis): string => {
  const { stats, winRatePercentage, avgDealSize, topClients, topCommercials } = analysis;

  // Get current month and year
  const now = new Date();
  const currentMonth = now.toLocaleDateString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  // Build insights text
  let insights = `# Sales Performance Analysis\n\n`;
  
  // Overview section
  insights += `## Overview\n\n`;
  insights += `Total opportunities: ${stats.totalOpportunities}\n`;
  insights += `Win rate: ${winRatePercentage.toFixed(1)}%\n`;
  insights += `Average deal size: ${formatCurrency(avgDealSize)}\n`;
  insights += `Total estimated value: ${formatCurrency(stats.estimatedValue)}\n\n`;
  
  // Status breakdown
  insights += `## Status Breakdown\n\n`;
  insights += `- Won deals: ${stats.byStatus.gagne} (${((stats.byStatus.gagne / stats.totalOpportunities) * 100).toFixed(1)}%)\n`;
  insights += `- Lost deals: ${stats.byStatus.perdu} (${((stats.byStatus.perdu / stats.totalOpportunities) * 100).toFixed(1)}%)\n`;
  insights += `- In progress: ${stats.byStatus.en_cours} (${((stats.byStatus.en_cours / stats.totalOpportunities) * 100).toFixed(1)}%)\n`;
  insights += `- Sent proposals: ${stats.byStatus.envoye} (${((stats.byStatus.envoye / stats.totalOpportunities) * 100).toFixed(1)}%)\n`;
  insights += `- Pending: ${stats.byStatus.en_attente} (${((stats.byStatus.en_attente / stats.totalOpportunities) * 100).toFixed(1)}%)\n\n`;
  
  // Top clients
  insights += `## Top Clients\n\n`;
  topClients.forEach((client, index) => {
    insights += `${index + 1}. ${client.client}: ${client.value} opportunities\n`;
  });
  insights += `\n`;
  
  // Top commercials
  insights += `## Top Performers\n\n`;
  topCommercials.forEach((commercial, index) => {
    insights += `${index + 1}. ${commercial.client}: ${commercial.value} opportunities\n`;
  });
  insights += `\n`;
  
  // Recommendations
  insights += `## Recommendations\n\n`;
  
  // Add relevant recommendations based on analysis
  if (winRatePercentage < 30) {
    insights += `- Focus on improving proposal quality to increase win rate\n`;
  }
  
  if (Object.keys(stats.byClient).length > 20) {
    insights += `- Consider consolidating efforts on key clients to improve efficiency\n`;
  }
  
  // Check if there's a downward trend
  const sortedMonths = analysis.trendsByMonth.slice(-3);
  if (sortedMonths.length === 3 && 
      sortedMonths[2].value < sortedMonths[1].value && 
      sortedMonths[1].value < sortedMonths[0].value) {
    insights += `- Investigate the decreasing trend in opportunities over the last three months\n`;
  }
  
  return insights;
};
