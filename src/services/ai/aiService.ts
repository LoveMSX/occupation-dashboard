
import axios from 'axios';
import config from '@/config';
import { AIConfig, AIResponse, ChartData, TableData } from '@/types/ai-service';

export class AIService {
  private apiKey: string;
  private provider: string;
  private model: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.provider = config.provider;
    this.model = config.model;
    
    // Set the appropriate base URL based on provider
    switch (this.provider) {
      case 'openai':
        this.baseUrl = 'https://api.openai.com/v1';
        this.headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        };
        break;
      case 'gemini':
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1';
        this.headers = {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        };
        break;
      case 'anthropic':
        this.baseUrl = 'https://api.anthropic.com/v1';
        this.headers = {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        };
        break;
      case 'mistral':
        this.baseUrl = 'https://api.mistral.ai/v1';
        this.headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        };
        break;
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  /**
   * Generate text using the AI provider
   */
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      let response;
      
      switch (this.provider) {
        case 'openai':
          response = await this.callOpenAI(prompt, options);
          break;
        case 'gemini':
          response = await this.callGemini(prompt, options);
          break;
        case 'anthropic':
          response = await this.callAnthropic(prompt, options);
          break;
        case 'mistral':
          response = await this.callMistral(prompt, options);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
      
      return response;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: options.systemPrompt || 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500
        },
        { headers: this.headers }
      );
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('OpenAI API error:', error.response?.data);
      }
      throw new Error(`Failed to generate text with OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Call Gemini API
   */
  private async callGemini(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/models/${this.model}:generateContent`,
        {
          contents: [
            {
              parts: [
                { text: options.systemPrompt || 'You are a helpful assistant.' },
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 500
          }
        },
        { headers: this.headers }
      );
      
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error(`Failed to generate text with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model: this.model,
          messages: [
            { role: 'user', content: prompt }
          ],
          system: options.systemPrompt || 'You are a helpful assistant.',
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7
        },
        { headers: this.headers }
      );
      
      return response.data.content[0].text;
    } catch (error) {
      throw new Error(`Failed to generate text with Anthropic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Call Mistral AI API
   */
  private async callMistral(prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: options.systemPrompt || 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500
        },
        { headers: this.headers }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Failed to generate text with Mistral AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate structured response with text, charts, and tables
   */
  async generateStructuredResponse(prompt: string, options: any = {}): Promise<AIResponse> {
    const systemPrompt = `
      You are an analytics assistant that provides insights in a structured format.
      Your responses should include a text summary followed by relevant visualizations when appropriate.
      For structured data, use JSON with the following format:
      {
        "text": "Your text analysis here...",
        "structured": {
          "title": "Optional title",
          "sections": [
            {
              "type": "text",
              "content": "Text section content...",
              "title": "Optional section title"
            },
            {
              "type": "chart",
              "content": {
                "type": "bar|line|pie|doughnut",
                "labels": ["Label1", "Label2", ...],
                "datasets": [
                  {
                    "label": "Dataset name",
                    "data": [value1, value2, ...],
                    "backgroundColor": "color code or array of colors"
                  }
                ]
              },
              "title": "Chart title"
            },
            {
              "type": "table",
              "content": {
                "headers": ["Header1", "Header2", ...],
                "rows": [
                  [value1, value2, ...],
                  [value1, value2, ...],
                  ...
                ]
              },
              "title": "Table title"
            }
          ]
        }
      }
    `;
    
    try {
      let response: string;
      
      // Generate response with appropriate system prompt
      switch (this.provider) {
        case 'openai':
          response = await this.callOpenAI(prompt, {
            ...options,
            systemPrompt,
            responseFormat: { type: 'json_object' }
          });
          break;
        case 'gemini':
          response = await this.callGemini(prompt, {
            ...options,
            systemPrompt
          });
          break;
        case 'anthropic':
          response = await this.callAnthropic(prompt, {
            ...options,
            systemPrompt
          });
          break;
        case 'mistral':
          response = await this.callMistral(prompt, {
            ...options,
            systemPrompt
          });
          break;
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
      
      // Parse the response as JSON
      let parsedResponse: AIResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        // If parsing fails, wrap the text in a basic structure
        parsedResponse = {
          text: response,
          structured: {
            sections: [
              {
                type: 'text',
                content: response
              }
            ]
          }
        };
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('Error generating structured response:', error);
      // Return a basic response in case of error
      return {
        text: `Error generating analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
        structured: {
          sections: [
            {
              type: 'text',
              content: `Error generating analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        }
      };
    }
  }

  /**
   * Process a table to extract insights
   */
  async analyzeTable(tableData: TableData, options: any = {}): Promise<AIResponse> {
    const headers = tableData.headers.join(', ');
    const rows = tableData.rows.map(row => row.join(', ')).join('\n');
    
    const prompt = `
      Analyze the following table data:
      
      Headers: ${headers}
      Rows:
      ${rows}
      
      Provide insights about this data with appropriate visualizations and tables.
    `;
    
    return this.generateStructuredResponse(prompt, options);
  }

  /**
   * Analyze a chart to extract insights
   */
  async analyzeChart(chartData: ChartData, options: any = {}): Promise<AIResponse> {
    const labels = chartData.labels.join(', ');
    const datasets = chartData.datasets.map(ds => 
      `${ds.label || 'Dataset'}: ${ds.data.join(', ')}`
    ).join('\n');
    
    const prompt = `
      Analyze the following ${chartData.type} chart data:
      
      Labels: ${labels}
      Datasets:
      ${datasets}
      
      Provide insights about this data with appropriate visualizations and tables.
    `;
    
    return this.generateStructuredResponse(prompt, options);
  }

  /**
   * Generate charts from textual descriptions
   */
  async textToChart(description: string, options: any = {}): Promise<AIResponse> {
    const prompt = `
      Based on this description, generate appropriate chart data:
      "${description}"
      
      Provide the chart data in the structured format, along with insights.
    `;
    
    return this.generateStructuredResponse(prompt, options);
  }

  /**
   * Generate a report based on multiple data inputs
   */
  async generateReport(data: any, reportType: string, options: any = {}): Promise<AIResponse> {
    const dataStr = JSON.stringify(data);
    
    const prompt = `
      Generate a detailed ${reportType} report based on the following data:
      ${dataStr}
      
      Provide comprehensive analysis with appropriate visualizations and tables.
    `;
    
    return this.generateStructuredResponse(prompt, options);
  }

  /**
   * Answer questions about data
   */
  async answerDataQuestion(data: any, question: string, options: any = {}): Promise<AIResponse> {
    const dataStr = JSON.stringify(data);
    
    const prompt = `
      Based on the following data:
      ${dataStr}
      
      Answer this question: "${question}"
      
      Provide a comprehensive answer with appropriate visualizations if helpful.
    `;
    
    return this.generateStructuredResponse(prompt, options);
  }

  /**
   * Predict trends based on historical data
   */
  async predictTrends(historicalData: any, timeframe: string, options: any = {}): Promise<AIResponse> {
    const dataStr = JSON.stringify(historicalData);
    
    const prompt = `
      Based on this historical data:
      ${dataStr}
      
      Predict trends for the next ${timeframe}.
      
      Provide predictions with appropriate visualizations and confidence intervals.
    `;
    
    return this.generateStructuredResponse(prompt, options);
  }

  /**
   * Utility method to handle errors
   */
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error) && error.response) {
      console.error('AI Service Error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.error('AI Service Error:', error);
    }
  }
}
