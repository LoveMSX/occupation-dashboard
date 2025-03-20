
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider, TooltipTrigger, Tooltip as TooltipComponent, TooltipContent } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { AIService, AIConfig as ServiceAIConfig, generateProjectAnalysis } from '@/services/ai/aiService';
import { toast } from 'sonner';
import { DownloadCloud, FileText, FilePlus, GanttChart, LayoutDashboard, ListChecks, Loader2, MessagesSquare, SquareCode } from 'lucide-react';
import config from '@/config';

// Type for our interface
interface AIConfig {
  provider: "openai" | "azure" | "anthropic";
  apiKey: string;
  model: string;
  endpoint?: string;
}

const API_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'azure', label: 'Azure OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
];

const MODELS = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ],
  azure: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-35-turbo', label: 'GPT-3.5 Turbo' }
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' }
  ]
};

const DEFAULT_API_CONFIGS: Record<string, AIConfig> = {
  openai: {
    provider: 'openai',
    apiKey: config.aiApiKey || '',
    model: 'gpt-4'
  },
  azure: {
    provider: 'azure',
    apiKey: '',
    model: 'gpt-4',
    endpoint: 'https://your-resource-name.openai.azure.com/'
  },
  anthropic: {
    provider: 'anthropic',
    apiKey: '',
    model: 'claude-3-opus'
  }
};

const PROMPT_TEMPLATES: Record<string, string> = {
  occupation: "Analyze this occupancy data to identify:\n1. Peak periods\n2. Low utilization months\n3. Consultants who are over-allocated\n4. Teams with capacity for new projects\n\nData: ",
  sales: "Analyze these sales operations to identify:\n1. Success rate by type of project\n2. Common objections or reasons for lost sales\n3. Average TJM by client type\n4. Most effective sales strategies\n\nData: ",
  projects: "Analyze these projects to identify:\n1. Project delivery success rate\n2. Common risks and delays\n3. Client satisfaction patterns\n4. Resource allocation effectiveness\n\nData: "
};

const ANALYSIS_OPTIONS = [
  { id: 'summary', label: 'Summary', description: 'Key metrics and insights', icon: LayoutDashboard },
  { id: 'deepdive', label: 'Deep Dive', description: 'Detailed analysis with recommendations', icon: GanttChart },
  { id: 'risks', label: 'Risks', description: 'Identify potential issues', icon: ListChecks },
  { id: 'planning', label: 'Planning', description: 'Timeline and resource suggestions', icon: GanttChart },
  { id: 'code', label: 'Code', description: 'Generate code snippets or formulas', icon: SquareCode },
];

export default function AIAnalyzePage() {
  const [activeTab, setActiveTab] = useState('occupation');
  const [provider, setProvider] = useState<'openai' | 'azure' | 'anthropic'>('openai');
  const [apiConfig, setApiConfig] = useState<AIConfig>(DEFAULT_API_CONFIGS.openai);
  const [prompt, setPrompt] = useState(PROMPT_TEMPLATES.occupation);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('summary');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPrompt(PROMPT_TEMPLATES[value as keyof typeof PROMPT_TEMPLATES]);
    setResult(null);
  };

  const handleProviderChange = (value: string) => {
    if (value === 'openai' || value === 'azure' || value === 'anthropic') {
      setProvider(value);
      setApiConfig(DEFAULT_API_CONFIGS[value]);
    }
  };

  const handleModelChange = (value: string) => {
    setApiConfig(prev => ({ ...prev, model: value }));
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApiConfig(prev => ({ ...prev, apiKey: e.target.value }));
  };

  const handleEndpointChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApiConfig(prev => ({ ...prev, endpoint: e.target.value }));
  };

  const handleFileUpload = async () => {
    try {
      // Mock file upload functionality as browser-fs-access is not available
      const mockFile = new File(["test content"], "test.json", { type: "application/json" });
      setUploadedFile(mockFile);
      const content = "test content";
      setFileContent(content);
      setPrompt(`${PROMPT_TEMPLATES[activeTab as keyof typeof PROMPT_TEMPLATES]}\n\n${content}`);
      toast.success(`File "${mockFile.name}" loaded successfully`);
    } catch (error) {
      toast.error('Failed to load file');
      console.error('File upload error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!apiConfig.apiKey) {
      toast.error('Please enter your API key');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Convert our AIConfig to ServiceAIConfig
      const serviceConfig: ServiceAIConfig = {
        provider: provider === 'azure' ? 'openai' : provider,
        apiKey: apiConfig.apiKey,
        model: apiConfig.model,
        endpoint: apiConfig.endpoint
      };
      
      let response;
      
      if (activeTab === 'projects') {
        response = await generateProjectAnalysis(fileContent || prompt, analysisType);
        setResult(response.text);
      } else {
        const aiService = new AIService(serviceConfig);
        const result = await aiService.generateReport(fileContent || prompt, activeTab);
        setResult(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('Analysis failed. Please check your API settings and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Leverage AI to analyze data and generate actionable insights for better decision-making.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Source</CardTitle>
              <CardDescription>Select the type of data to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="occupation">Occupation</TabsTrigger>
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                  <div>
                    <Label>Analysis Type</Label>
                    <RadioGroup 
                      value={analysisType} 
                      onValueChange={setAnalysisType}
                      className="mt-2 space-y-2"
                    >
                      {ANALYSIS_OPTIONS.map(option => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex items-center cursor-pointer">
                            <option.icon className="h-4 w-4 mr-2" />
                            <span>{option.label}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleFileUpload}
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    {uploadedFile ? uploadedFile.name : 'Upload Data File'}
                  </Button>
                  
                  <div>
                    <Label>Prompt</Label>
                    <Textarea 
                      value={prompt} 
                      onChange={(e) => setPrompt(e.target.value)} 
                      className="min-h-[200px] mt-2 font-mono text-sm"
                    />
                  </div>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <TooltipProvider>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => setPrompt(PROMPT_TEMPLATES[activeTab as keyof typeof PROMPT_TEMPLATES])}>
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Reset to template prompt
                </TooltipContent>
              </TooltipProvider>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MessagesSquare className="mr-2 h-4 w-4" />
                    Analyze Data
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure your AI provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>API Provider</Label>
                  <Select value={provider} onValueChange={handleProviderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {API_PROVIDERS.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Model</Label>
                  <Select
                    value={apiConfig.model}
                    onValueChange={handleModelChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODELS[provider].map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>API Key</Label>
                  <Textarea
                    value={apiConfig.apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Enter your API key"
                    className="font-mono text-sm"
                  />
                </div>

                {provider === 'azure' && (
                  <div>
                    <Label>API Endpoint</Label>
                    <Textarea
                      value={apiConfig.endpoint}
                      onChange={handleEndpointChange}
                      placeholder="https://your-resource.openai.azure.com/"
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>AI-generated insights from your data</CardDescription>
              </div>
              {result && (
                <Button variant="outline" size="sm">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-grow relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : result ? (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {result.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[calc(100vh-300px)] flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4 opacity-20" />
                  <p>Analysis results will appear here</p>
                  <p className="text-sm">Enter your prompt and click "Analyze Data"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
