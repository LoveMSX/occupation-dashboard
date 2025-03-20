import { employeeApi, projectApi, salesApi, resourceApi, healthApi } from '../api';
import { occupationApi } from '@/api/occupation';

export interface AIConfig {
  provider: 'openai' | 'gemini' | 'anthropic' | 'mistral' | 'deepseek' | 'ollama' | 'huggingface' | 'openrouter';
  apiKey: string;
  model: string;
}

export interface StructuredAIResponse {
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

export interface APIContext {
  employeesAPI: boolean;
  projectsAPI: boolean;
  salesAPI: boolean;
  occupationAPI: boolean;
}

interface Employee {
  name: string;
  position: string;
  skills: string[];
  projects?: string[];
  experience?: number;
}

interface Project {
  name: string;
  client: string;
  team: string[];
  status: 'active' | 'completed' | 'pending';
}

interface SalesRecord {
  commercial: string;
  value: number;
  date: string;
}

export class AIService {
  private config: AIConfig;
  private apiContext: APIContext;

  constructor(config: AIConfig) {
    this.config = config;
    // Toujours initialiser avec toutes les API actives
    this.apiContext = {
      employeesAPI: true,
      projectsAPI: true,
      salesAPI: true,
      occupationAPI: true
    };
  }

  private getSystemPrompt(): string {
    return `You are an AI assistant specialized in analyzing business data and providing insights. 
You have access to the following data from our application:
- Employee information
- Project details
- Sales data
- Occupation/resource allocation data

Please provide clear, concise answers and when relevant:
- Include specific data points
- Suggest actionable insights
- Identify trends or patterns
- Highlight potential issues or opportunities`;
  }

  private formatPromptForProvider(prompt: string, provider: string): string {
    switch (provider) {
      case 'openai':
      case 'anthropic':
      case 'gemini':
      case 'mistral':
      case 'deepseek':
      case 'ollama':
      case 'huggingface':
      case 'openrouter':
        return `${this.getSystemPrompt()}\n\n${prompt}`;
      default:
        return prompt;
    }
  }

  private async fetchAllData() {
    const data = {
      employees: [] as any[],
      projects: [] as any[],
      sales: [] as any[],
      occupation: [] as any[]
    };

    try {
      // Fetch all data in parallel
      const [employees, projects, sales, occupation] = await Promise.all([
        employeeApi.getAllEmployees(),
        projectApi.getAllProjects(),
        salesApi.getAllSalesOperations(),
        occupationApi.getAllOccupation()
      ]);

      return {
        employees,
        projects,
        sales,
        occupation
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async analyze(prompt: string): Promise<StructuredAIResponse> {
    // Toujours récupérer les données fraîches
    const contextData = await this.fetchAllData();
    
    // Enrichir le prompt avec les données contextuelles
    const enrichedPrompt = `
      Context:
      - Employees: ${contextData.employees.length} records
      - Projects: ${contextData.projects.length} records
      - Sales: ${contextData.sales.length} records
      - Occupation: ${contextData.occupation.length} records

      ${prompt}
    `;

    // Utiliser ces données pour l'analyse
    // ... reste de la logique d'analyse ...
  }

  async generateResponse(prompt: string): Promise<StructuredAIResponse> {
    try {
      const contextData = await this.fetchRelevantData(prompt);
      const enhancedPrompt = `
          Context (Note: Some data might be unavailable):
          ${JSON.stringify(contextData, null, 2)}

          User Query:
          ${prompt}

          Please provide insights based on the available data. If some data is unavailable, focus on what can be analyzed from the accessible information.
      `;

      let response;
      try {
        switch (this.config.provider) {
          case 'openai':
            response = await this.callOpenAI(enhancedPrompt);
            break;
          case 'gemini':
            response = await this.callGemini(enhancedPrompt);
            break;
          case 'anthropic':
            response = await this.callAnthropic(enhancedPrompt);
            break;
          case 'mistral':
            response = await this.callMistral(enhancedPrompt);
            break;
          case 'deepseek':
            response = await this.callDeepseek(enhancedPrompt);
            break;
          case 'ollama':
            response = await this.callOllama(enhancedPrompt);
            break;
          case 'huggingface':
            response = await this.callHuggingFace(enhancedPrompt);
            break;
          case 'openrouter':
            response = await this.callOpenRouter(enhancedPrompt);
            break;
          default:
            throw new Error(`Unsupported AI provider: ${this.config.provider}`);
        }
      } catch (error) {
        console.error('AI API error:', error);
        throw new Error(`Failed to get AI response: ${error.message}`);
      }

      return this.processResponse(response);
    } catch (error) {
      console.error('Error in generateResponse:', error);
      return {
        text: `An error occurred while processing your request: ${error.message}. Please try again later or contact support if the issue persists.`,
        structured: {
          title: 'Error Processing Request',
          sections: [{
            type: 'text',
            content: 'Failed to process the request due to data access issues.',
            title: 'Error Details'
          }]
        }
      };
    }
  }

  private processResponse(response: any): StructuredAIResponse {
    try {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      // Détection des données d'employés
      if (Array.isArray(data) && data[0]?.name && data[0]?.position && data[0]?.skills) {
        return {
          text: this.formatEmployeesList(data)
        };
      }
      
      // Autres types de données...
      return {
        text: this.formatJsonResponse(data)
      };
    } catch (e) {
      return { text: String(response) };
    }
  }

  private formatJsonResponse(data: any): string {
    if (Array.isArray(data)) {
      return this.formatArrayResponse(data);
    } else if (typeof data === 'object') {
      return this.formatObjectResponse(data);
    }
    return String(data);
  }

  private formatArrayResponse(array: any[]): string {
    if (array.length === 0) return "Aucune donnée disponible";

    const title = this.inferTitle(array[0]);
    const separator = "──────────────────────────────────────────────────";
    
    const formattedItems = array.map((item, index) => {
      const number = (index + 1).toString().padStart(2, '0');
      const emoji = this.getItemEmoji(item);
      const content = this.formatItem(item);
      return `${number}. ${emoji} ${content}`;
    }).join('\n');

    return [
      `📋 ${title}`,
      separator,
      formattedItems,
      separator,
      `Total: ${array.length} élément${array.length > 1 ? 's' : ''}`
    ].join('\n');
  }

  private formatObjectResponse(obj: any): string {
    const separator = "──────────────────────────────────────────────────";
    const title = this.inferTitle(obj);
    
    const formattedFields = Object.entries(obj)
      .map(([key, value]) => {
        const emoji = this.getFieldEmoji(key);
        const formattedValue = this.formatValue(value);
        return `${emoji} ${key}: ${formattedValue}`;
      })
      .join('\n');

    return [
      `📋 ${title}`,
      separator,
      formattedFields,
      separator
    ].join('\n');
  }

  private inferTitle(data: any): string {
    if (data.client) return "Liste des Projets";
    if (data.name) return "Liste des Employés";
    if (data.value) return "Données Commerciales";
    return "Résultats";
  }

  private getItemEmoji(item: any): string {
    if (item.status) return this.getStatusEmoji(item.status);
    if (item.client) return "🏢";
    if (item.name) return "👤";
    if (item.value) return "💰";
    return "•";
  }

  private getFieldEmoji(field: string): string {
    const emojiMap: Record<string, string> = {
      id: "🔑",
      name: "📝",
      client: "🏢",
      status: "📊",
      value: "💰",
      date: "📅",
      email: "📧",
      phone: "📞",
      address: "📍",
      position: "👔",
      skills: "🛠️",
      projects: "📋",
      experience: "⏳"
    };
    return emojiMap[field.toLowerCase()] || "•";
  }

  private getStatusEmoji(status: string): string {
    const statusMap: Record<string, string> = {
      'ongoing': '🟢',
      'completed': '✅',
      'planned': '🟡',
      'standby': '🟠',
      'active': '🟢',
      'inactive': '⭕',
      'pending': '🟡'
    };
    return statusMap[status.toLowerCase()] || '🔵';
  }

  private formatValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('fr-FR');
    }
    if (typeof value === 'number') {
      return value.toLocaleString('fr-FR');
    }
    return String(value);
  }

  private formatItem(item: any): string {
    if (typeof item === 'string') return item;
    
    const mainField = 
      item.client ? item.client :
      item.name ? item.name :
      item.title ? item.title :
      JSON.stringify(item);

    const additionalInfo = [];
    if (item.status) additionalInfo.push(item.status);
    if (item.position) additionalInfo.push(item.position);
    if (item.value) additionalInfo.push(`${item.value}€`);

    return additionalInfo.length > 0 
      ? `${mainField} (${additionalInfo.join(' - ')})`
      : mainField;
  }

  private parseMarkdownSections(markdown: string): Array<{title?: string, content: string}> {
    const sections: Array<{title?: string, content: string}> = [];
    const lines = markdown.split('\n');
    let currentSection: {title?: string, content: string} | null = null;

    for (const line of lines) {
      if (line.startsWith('#')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/^#+\s/, ''),
          content: ''
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      } else {
        currentSection = {
          content: line + '\n'
        };
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  private detectSectionType(content: string): 'text' | 'chart' | 'table' {
    if (content.includes('|') && content.includes('-|-')) {
      return 'table';
    }
    if (content.includes('```chart')) {
      return 'chart';
    }
    return 'text';
  }

  private formatSectionContent(content: string): any {
    const type = this.detectSectionType(content);
    
    switch (type) {
      case 'table':
        return this.parseMarkdownTable(content);
      case 'chart':
        return this.parseChartData(content);
      default:
        return content.trim();
    }
  }

  private parseMarkdownTable(markdown: string): TableData {
    const lines = markdown.split('\n').filter(line => line.trim());
    const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line => 
      line.split('|').map(cell => cell.trim()).filter(Boolean)
    );

    return { headers, rows };
  }

  private parseChartData(content: string): ChartData {
    // Exemple basique - à adapter selon votre format de données
    const match = content.match(/```chart\n([\s\S]*?)\n```/);
    if (!match) {
      return {
        type: 'bar',
        labels: [],
        values: []
      };
    }

    try {
      const chartData = JSON.parse(match[1]);
      return {
        type: chartData.type || 'bar',
        labels: chartData.labels || [],
        values: chartData.values || []
      };
    } catch (e) {
      return {
        type: 'bar',
        labels: [],
        values: []
      };
    }
  }

  private async callOpenAI(prompt: string): Promise<any> {
    const formattedPrompt = this.formatPromptForProvider(prompt, 'openai');
    const apiKey = this.config.apiKey || import.meta.env.VITE_OPENAI_API_KEY;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { 
            role: "system", 
            content: this.getSystemPrompt()
          },
          { 
            role: "user", 
            content: formattedPrompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
  }

  private async callGemini(prompt: string): Promise<AIResponse> {
    const apiKey = this.config.apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    
    const response = await fetch(`/api/gemini/v1beta/models/${this.config.model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated." };
  }

  private async callAnthropic(prompt: string): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.content[0]?.text || "No response generated." };
  }

  private async callMistral(prompt: string): Promise<AIResponse> {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.choices[0]?.message?.content || "No response generated." };
  }

  private async callDeepseek(prompt: string): Promise<AIResponse> {
    const apiKey = this.config.apiKey || import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Deepseek API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return { text: data.choices[0]?.message?.content || "No response generated." };
  }

  private async callOllama(prompt: string): Promise<AIResponse> {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.response || "No response generated." };
  }

  private async callHuggingFace(prompt: string): Promise<AIResponse> {
    const apiKey = this.config.apiKey || import.meta.env.VITE_HUGGINGFACE_API_KEY;
    
    const response = await fetch(`https://api-inference.huggingface.co/models/${this.config.model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: Array.isArray(data) ? data[0]?.generated_text || "No response generated." : data.generated_text };
  }

  private async callOpenRouter(prompt: string): Promise<AIResponse> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': window.location.origin, // Required by OpenRouter
        'X-Title': 'AI Analysis Dashboard' // Optional but recommended
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant specialized in data analysis and visualization."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return { text: data.choices[0]?.message?.content || "No response generated." };
  }

  // Add method to fetch data from API
  async fetchData<TParams = unknown, TResponse = unknown>(endpoint: string, params?: TParams): Promise<TResponse> {
    if (!this.apiContext) {
      throw new Error('API context not available');
    }

    const [service, method] = endpoint.split('.');
    
    const apiMap = {
      employees: {
        api: employeeApi,
        methods: {
          getAll: async () => {
            const data = await employeeApi.getAllEmployees();
            return {
              title: '👥 Employee Directory',
              sections: [
                {
                  heading: 'Liste des Employés',
                  content: data.map(emp => ({
                    name: emp.name,
                    position: emp.position,
                    skills: emp.competences_2024,
                    projects: emp.projects
                  }))
                }
              ]
            };
          },
          getById: async (id: number) => {
            const data = await employeeApi.getEmployeeById(id);
            return {
              title: `👤 Employee Details: ${data.name}`,
              sections: [
                {
                  heading: 'Informations détaillées',
                  content: data
                }
              ]
            };
          }
        }
      },
      projects: {
        api: projectApi,
        methods: {
          getAll: async () => {
            const data = await projectApi.getAllProjects();
            return {
              title: '📈 Project Portfolio',
              sections: [
                {
                  heading: 'Projets en cours',
                  content: data.filter(p => p.status === 'ongoing'),
                },
                {
                  heading: 'Projets terminés',
                  content: data.filter(p => p.status === 'completed'),
                },
                {
                  heading: 'Projets planifiés',
                  content: data.filter(p => p.status === 'planned'),
                }
              ]
            };
          },
          getById: async (id: number) => {
            const data = await projectApi.getProjectById(id);
            return {
              title: `📋 Project Details: ${data.name}`,
              sections: [
                {
                  heading: 'Informations du projet',
                  content: data
                }
              ]
            };
          },
          getProjectEmployees: async (id: number) => {
            const data = await projectApi.getProjectEmployees(id);
            return {
              title: '👥 Project Team',
              sections: [
                {
                  heading: 'Membres de l\'équipe',
                  content: data
                }
              ]
            };
          }
        }
      },
      sales: {
        api: salesApi,
        methods: {
          getAll: async () => {
            const data = await salesApi.getAllSalesOperations();
            return {
              title: '💰 Sales Overview',
              sections: [
                {
                  heading: 'Opportunités de vente',
                  content: data
                }
              ]
            };
          }
        }
      },
      occupation: {
        api: occupationApi,
        methods: {
          getAll: async () => {
            const data = await occupationApi.getAllOccupation();
            return {
              title: '📊 Occupation Overview',
              sections: [
                {
                  heading: 'Taux d\'occupation',
                  content: data.map(occ => ({
                    date: occ.date,
                    employeeId: occ.employee_id,
                    occupancyRate: `${occ.occupancyRate}%`,
                    utilizationRate: `${occ.utilizationRate}%`
                  }))
                }
              ]
            };
          }
        }
      },
      resources: {
        api: resourceApi,
        methods: {
          getAll: async () => {
            const data = await resourceApi.getAllResources();
            return {
              title: '🎯 Resources Overview',
              sections: [
                {
                  heading: 'Ressources disponibles',
                  content: data
                }
              ]
            };
          }
        }
      },
      health: {
        api: healthApi,
        methods: {
          check: async () => {
            const data = await healthApi.checkHealth();
            return {
              title: '🏥 System Health',
              sections: [
                {
                  heading: 'État du système',
                  content: data
                }
              ]
            };
          }
        }
      }
    };

    if (!apiMap[service]) {
      throw new Error(`API service "${service}" is not available`);
    }

    try {
      const methodFunction = apiMap[service].methods[method];
      if (!methodFunction) {
        throw new Error(`Method "${method}" not found for service "${service}"`);
      }

      const response = await methodFunction(params);
      return {
        service,
        method,
        timestamp: new Date().toISOString(),
        data: response
      } as TResponse;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${service} API: ${error.message}`);
    }
  }

  private async fetchRelevantData(prompt: string): Promise<any> {
    const data: Record<string, any> = {};
    
    if (!this.apiContext) {
      return data;
    }

    try {
      // Fetch data based on API context flags, with individual try-catch blocks
      if (this.apiContext.employeesAPI) {
        try {
          data.employees = await this.fetchData('employees.getAll');
        } catch (error) {
          console.warn('Failed to fetch employees data:', error);
          data.employees = { error: 'Data unavailable' };
        }
      }

      if (this.apiContext.projectsAPI) {
        try {
          data.projects = await this.fetchData('projects.getAll');
        } catch (error) {
          console.warn('Failed to fetch projects data:', error);
          data.projects = { error: 'Data unavailable' };
        }
      }

      if (this.apiContext.salesAPI) {
        try {
          data.sales = await this.fetchData('sales.getAll');
        } catch (error) {
          console.warn('Failed to fetch sales data:', error);
          data.sales = { error: 'Data unavailable' };
        }
      }

      if (this.apiContext.occupationAPI) {
        try {
          data.occupation = await this.fetchData('occupation.getAll');
        } catch (error) {
          console.warn('Failed to fetch occupation data:', error);
          data.occupation = { error: 'Data unavailable' };
        }
      }

      return data;
    } catch (error) {
      console.warn('Error in fetchRelevantData:', error);
      return {
        error: 'Some data sources are currently unavailable',
        availableData: data
      };
    }
  }

  private formatEmployeesList(employees: any[]): string {
    const separator = "──────────────────────────────────────────────────";
    const lines = [
      "👥 Liste des Employés",
      separator
    ];

    const formattedEmployees = employees.map((emp, index) => {
      const number = (index + 1).toString().padStart(2, '0');
      const position = emp.position ? `[${emp.position}]` : '';
      const skills = emp.skills?.length 
        ? `\n    🛠️ ${emp.skills.join(', ')}`
        : '';
      
      return `${number}. 👤 ${emp.name} ${position}${skills}`;
    });

    lines.push(formattedEmployees.join('\n'));
    lines.push(separator);
    lines.push(`Total: ${employees.length} employé${employees.length > 1 ? 's' : ''}`);

    return lines.join('\n');
  }
}
