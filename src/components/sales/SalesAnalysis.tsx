
import { useQuery } from '@tanstack/react-query';
import { analyzeSalesData, generateSalesInsights } from '@/services/ai/salesAnalyzer';
import { AIService } from '@/services/ai/aiService';
import config from '@/config';

// Define a mock salesApi with the necessary functions
const salesApi = {
  getAllSalesOperations: async () => {
    // Return mock data for now
    return [
      {
        id: 1,
        nom_du_projet: "Project Alpha",
        client: "Client A",
        date_reception: "2023-01-15",
        tjm: 750,
        chiffrage_jh: 20,
        statut: "gagne" as const,
        commercial: "John Doe",
        personne_en_charge_msx: "Jane Smith",
        type_projet: "Development",
        remarques: "High priority",
        url: "https://example.com/alpha",
        created_at: "2023-01-10",
        updated_at: "2023-01-20"
      },
      {
        id: 2,
        nom_du_projet: "Project Beta",
        client: "Client B",
        date_reception: "2023-02-10",
        tjm: 800,
        chiffrage_jh: 15,
        statut: "en_cours" as const,
        commercial: "Jane Smith",
        personne_en_charge_msx: "Bob Johnson",
        type_projet: "Maintenance",
        remarques: "Medium priority",
        url: "https://example.com/beta",
        created_at: "2023-02-05",
        updated_at: "2023-02-15"
      }
    ];
  }
};

export const SalesAnalysis = () => {
  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAllSalesOperations,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const aiService = new AIService({
    provider: 'openai',
    apiKey: config.aiApiKey || '', // Using config.aiApiKey
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
