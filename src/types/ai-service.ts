
export interface ChartData {
  labels: string[];
  values: number[];
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title?: string;
  datasets: {
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    label?: string;
  }[];
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface AIResponse {
  text: string;
  structured?: {
    title?: string;
    sections: {
      type: 'text' | 'chart' | 'table';
      content: string | ChartData | TableData;
      title?: string;
    }[];
  };
}

export interface AIConfig {
  provider: 
    | "openai"
    | "gemini"
    | "anthropic"
    | "mistral"
    | "deepseek"
    | "ollama"
    | "huggingface"
    | "openrouter";
  apiKey: string;
  model: string;
}

export interface APIContext {
  userPrompt?: string;
  contextData?: any;
  systemPrompt?: string;
}
