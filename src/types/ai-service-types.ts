
export interface AIConfig {
  provider: 'openai' | 'azure' | 'anthropic';
  apiKey: string;
  model: string;
  endpoint?: string;
}

export type AIContext = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface TableData {
  headers: string[];
  rows: any[][];
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}
