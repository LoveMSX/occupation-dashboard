import { useQuery } from '@tanstack/react-query';
import { salesApi } from '@/services/api';
import { analyzeSalesData, generateSalesInsights } from '@/services/ai/salesAnalyzer';
import { AIService } from '@/services/ai/AIService';
import { config } from '@/config';

export const SalesAnalysis = () => {
  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAllSalesOperations,
    // Réduire le staleTime pour des données plus fraîches
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const aiService = new AIService({
    provider: 'openai',
    apiKey: config.aiApiKey,
    model: 'gpt-4'
  });

  const analysis = analyzeSalesData(sales);
  const insights = generateSalesInsights(analysis);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Analyse des Ventes</h2>
      <pre className="whitespace-pre-wrap">{insights}</pre>
    </div>
  );
};
