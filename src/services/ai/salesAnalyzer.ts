import { SalesOperationResponse } from "@/services/api";

interface SalesAnalysis {
  totalOpportunities: number;
  wonOpportunities: number;
  successRate: number;
  averageTJM: number;
  topCommercials: Array<{ name: string; wonDeals: number }>;
}

export const analyzeSalesData = (sales: SalesOperationResponse[]): SalesAnalysis => {
  if (!sales || sales.length === 0) {
    return {
      totalOpportunities: 0,
      wonOpportunities: 0,
      successRate: 0,
      averageTJM: 0,
      topCommercials: [],
    };
  }

  // Compter les opportunités gagnées (statut === "gagne")
  const wonOpportunities = sales.filter(sale => sale.statut === "gagne").length;

  // Calculer le taux de succès
  const successRate = (wonOpportunities / sales.length) * 100;

  // Calculer le TJM moyen
  const averageTJM = sales.reduce((acc, sale) => acc + (sale.tjm || 0), 0) / sales.length;

  // Analyser les performances par commercial
  const commercialPerformance = sales.reduce((acc, sale) => {
    if (sale.commerciale) {
      if (!acc[sale.commerciale]) {
        acc[sale.commerciale] = { total: 0, won: 0 };
      }
      acc[sale.commerciale].total += 1;
      if (sale.statut === "gagne") {
        acc[sale.commerciale].won += 1;
      }
    }
    return acc;
  }, {} as Record<string, { total: number; won: number }>);

  // Trier les commerciaux par nombre d'opportunités gagnées
  const topCommercials = Object.entries(commercialPerformance)
    .map(([name, stats]) => ({
      name,
      wonDeals: stats.won,
    }))
    .sort((a, b) => b.wonDeals - a.wonDeals)
    .slice(0, 5); // Top 5 commerciaux

  return {
    totalOpportunities: sales.length,
    wonOpportunities,
    successRate: Math.round(successRate * 100) / 100, // Arrondir à 2 décimales
    averageTJM: Math.round(averageTJM),
    topCommercials,
  };
};

interface FormatConfig {
  title: string;
  emoji: string;
  fields: Array<{
    label: string;
    value: number | string;
    format?: 'number' | 'currency' | 'percent' | 'text';
    emoji?: string;
  }>;
  subSections?: Array<{
    title: string;
    emoji: string;
    items: Array<{
      label: string;
      value: number | string;
      format?: 'number' | 'currency' | 'percent' | 'text';
      badge?: string;
    }>;
  }>;
}

export const formatAPIResponse = (config: FormatConfig): string => {
  const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);
  const formatCurrency = (num: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(num);
  const formatPercent = (num: number) => new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1 }).format(num / 100);

  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'number') {
      switch (format) {
        case 'currency': return formatCurrency(value);
        case 'percent': return formatPercent(value);
        case 'number': return formatNumber(value);
        default: return value.toString();
      }
    }
    return value;
  };

  const header = `${config.emoji} ${config.title}`;
  const separator = '─'.repeat(50);

  const mainStats = config.fields
    .map(field => `${field.emoji || ''} ${field.label.padEnd(25)}: ${formatValue(field.value, field.format)}`)
    .join('\n');

  const sections = config.subSections?.map(section => {
    const sectionHeader = `\n${section.emoji} ${section.title}`;
    const items = section.items
      .map((item, index) => {
        const badge = item.badge || '';
        return `${badge} ${item.label.padEnd(20)} : ${formatValue(item.value, item.format)}`;
      })
      .join('\n');
    return [sectionHeader, separator, items].join('\n');
  }).join('\n') || '';

  return [header, separator, mainStats, sections].join('\n');
};

// Example usage for sales analysis
export const generateSalesInsights = (analysis: SalesAnalysis): string => {
  return formatAPIResponse({
    title: 'Analyse des Opportunités Commerciales',
    emoji: '📊',
    fields: [
      { label: 'Total des opportunités', value: analysis.totalOpportunities, format: 'number', emoji: '📈' },
      { label: 'Opportunités gagnées', value: analysis.wonOpportunities, format: 'number', emoji: '✅' },
      { label: 'Taux de succès', value: analysis.successRate, format: 'percent', emoji: '🎯' },
      { label: 'TJM moyen', value: analysis.averageTJM, format: 'currency', emoji: '💰' }
    ],
    subSections: [{
      title: 'Top Commerciaux',
      emoji: '🏆',
      items: analysis.topCommercials.map((commercial, index) => ({
        label: commercial.name,
        value: commercial.wonDeals,
        format: 'number',
        badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  '
      }))
    }]
  });
};

export const formatProjectsList = (projects: Array<{ id: number; client: string; name?: string; status?: string }>): string => {
  const header = '📋 Liste des Projets';
  const separator = '─'.repeat(50);

  const projectsList = projects.map((project, index) => {
    const projectNumber = (index + 1).toString().padStart(2, '0');
    const clientInfo = `${project.client}${project.name ? ` - ${project.name}` : ''}`;
    const statusEmoji = project.status ? getStatusEmoji(project.status) : '🔵';
    
    return `${projectNumber}. ${statusEmoji} ${clientInfo}`;
  }).join('\n');

  return [
    header,
    separator,
    projectsList,
    separator,
    `Total: ${projects.length} projets`
  ].join('\n');
};

const getStatusEmoji = (status: string): string => {
  const statusMap: Record<string, string> = {
    'ongoing': '🟢',
    'completed': '✅',
    'planned': '🟡',
    'standby': '🟠',
    'en cours': '🟢',
    'terminé': '✅',
    'planifié': '🟡',
    'en attente': '🟠'
  };
  return statusMap[status.toLowerCase()] || '🔵';
};

