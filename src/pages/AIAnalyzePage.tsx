
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Settings, Eye, EyeOff, Brain, Send, Trash2, Bot, Sparkles } from "lucide-react";
import { AIService, AIConfig, APIContext } from "@/services/ai/aiService";
import { Badge } from "@/components/ui/badge";
import config from "@/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import StructuredMessage from '@/components/StructuredMessage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Spinner } from "@/components/ui/spinner";
import ChatMessage from '@/components/ChatMessage';
import { useLanguage } from '@/components/LanguageProvider';

interface Message {
  text: string;
  isUser: boolean;
  structured?: {
    title?: string;
    sections: {
      type: 'text' | 'chart' | 'table';
      content: string | {
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
      } | {
        headers: string[];
        rows: (string | number)[][];
      };
      title?: string;
    }[];
  };
}

interface Config {
  provider:
    | "openai"
    | "gemini"
    | "anthropic"
    | "mistral"
    | "deepseek"
    | "ollama"
    | "huggingface"
    | "openrouter";  // Added openrouter
  apiKey: string;
  model: string;
}

// Add this interface for Gemini models
interface GeminiModel {
  name: string;
  displayName: string;
  description: string;
  version: string;
}

const STORAGE_KEY = "ai-config";
const CHAT_HISTORY_KEY = 'ai-chat-history';

const DEFAULT_CONFIG: Config = {
  provider: "openai",
  apiKey: "",
  model: "gpt-3.5-turbo",
};

const PROVIDER_MODELS = {
  openai: [
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-4-turbo-preview", label: "GPT-4 Turbo" },
    { value: "gpt-4-vision-preview", label: "GPT-4 Vision" },
  ],
  gemini: [
    { value: "gemini-pro", label: "Gemini Pro" },
    { value: "gemini-pro-vision", label: "Gemini Pro Vision" }
  ],
  anthropic: [
    { value: "claude-3-opus", label: "Claude 3 Opus" },
    { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
    { value: "claude-2.1", label: "Claude 2.1" },
    { value: "claude-instant-1.2", label: "Claude Instant" },
  ],
  mistral: [
    { value: "mistral-tiny", label: "Mistral Tiny" },
    { value: "mistral-small", label: "Mistral Small" },
    { value: "mistral-medium", label: "Mistral Medium" },
    { value: "mistral-large", label: "Mistral Large" },
  ],
  deepseek: [
    { value: "deepseek-coder", label: "Deepseek Coder" },
    { value: "deepseek-chat", label: "Deepseek Chat" },
  ],
  ollama: [
    { value: "llama2", label: "Llama 2" },
    { value: "codellama", label: "Code Llama" },
    { value: "mistral", label: "Mistral" },
    { value: "neural-chat", label: "Neural Chat" },
    { value: "phi", label: "Phi-2" },
    { value: "stablelm", label: "StableLM" },
    { value: "openchat", label: "OpenChat" },
    { value: "orca-mini", label: "Orca Mini" },
    { value: "vicuna", label: "Vicuna" },
  ],
  huggingface: [
    { value: "falcon-7b", label: "Falcon 7B" },
    { value: "falcon-40b", label: "Falcon 40B" },
    { value: "bloom", label: "BLOOM" },
    { value: "opt", label: "OPT" },
    { value: "starcoder", label: "StarCoder" },
  ],
  openrouter: [
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "claude-2", label: "Claude 2" },
    { value: "gemini-pro", label: "Gemini Pro" },
    { value: "llama-2-70b-chat", label: "Llama 2 70B" },
    { value: "mistral-7b-instruct", label: "Mistral 7B" },
  ],
};

const API_URL = config.apiUrl;

const AIAnalyzePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [{
      text: "Hello! I'm your AI assistant. Ask me to analyze data or generate visualizations for you.",
      isUser: false,
    }];
  });
  const [availableModels, setAvailableModels] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getModelLabel = () => {
    const model = PROVIDER_MODELS[config.provider].find(
      (m) => m.value === config.model
    );
    return model?.label || config.model;
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      setIsConfigured(true);
    } else {
      setIsConfigured(false);
    }
  }, []);

  const saveConfig = (newConfig: Config) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
  };

  const handleApiKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const apiKey = e.target.value;
    const newConfig = { ...config, apiKey, model: '' };
    setConfig(newConfig); // Update state immediately for UI responsiveness

    if (apiKey) {
      setIsLoadingModels(true);
      try {
        const response = await fetch(`/api/gemini/v1beta/models?key=${apiKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }

        const data = await response.json();
        const models = data.models.map((model: GeminiModel) => ({
          value: model.name.replace('models/', ''), // Supprime le préfixe 'models/'
          label: model.displayName || model.name,
          description: model.description
        }));

        setAvailableModels(models);
        toast.success('Models loaded successfully');
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Failed to fetch available models');
        setAvailableModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    } else {
      setAvailableModels([]); // Clear models if API key is empty
    }

    saveConfig(newConfig);
  };

  const handleModelChange = (value: string) => {
    saveConfig({ ...config, model: value });
  };

  const handleProviderChange = (value: Config["provider"]) => {
    const newConfig = {
      ...config,
      provider: value,
      model: '', // Reset model when provider changes
      apiKey: '' // Reset API key when provider changes
    };
    saveConfig(newConfig);
    setAvailableModels([]); // Reset available models
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    if (!config.apiKey) {
      toast.error("Please enter your API key first");
      return;
    }

    setLoading(true);
    const newMessages = [
      ...messages,
      { text: prompt, isUser: true },
    ];
    setMessages(newMessages);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
    setPrompt("");

    try {
      const aiService = new AIService({
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model
      });
      const response = await aiService.generateResponse(prompt);
      const updatedMessages = [...newMessages, { text: response.text, isUser: false }];
      setMessages(updatedMessages);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Error calling AI API:", error);
      
      // Enhanced error handling with more user-friendly messages
      let errorMessage = "An unexpected error occurred.";
      let errorDescription = "";
      let errorAction = "";

      if (error instanceof Error) {
        if (error.message.includes('JSON')) {
          errorMessage = "Response Format Error";
          errorDescription = "The server response was not in the expected format.";
          errorAction = "Our team has been notified. Please try again in a few moments.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Connection Error";
          errorDescription = "Unable to reach the AI service.";
          errorAction = "Please check your internet connection or try again later.";
        } else if (error.message.includes('API key')) {
          errorMessage = "Authentication Error";
          errorDescription = "There's an issue with your API key.";
          errorAction = "Please verify your API key in the settings.";
        } else {
          errorMessage = error.message;
          errorDescription = "An unexpected error occurred while processing your request.";
          errorAction = "Please try again or contact support if the issue persists.";
        }
      }

      // Enhanced toast notification with better styling
      toast.error(errorMessage, {
        description: (
          <div className="space-y-2">
            <p className="text-sm text-red-200">{errorDescription}</p>
            <p className="text-xs text-red-300">{errorAction}</p>
            <div className="text-xs text-red-400 mt-2">
              Provider: {config.provider.toUpperCase()}
              <br />
              Model: {getModelLabel()}
            </div>
          </div>
        ),
        duration: 5000,
        className: "bg-red-950 border border-red-800",
      });

      // Add error message to chat with improved formatting
      const errorMessages = [
        ...newMessages,
        {
          text: `⚠️ ${errorMessage}\n\n${errorDescription}\n\n💡 ${errorAction}`,
          isUser: false,
          error: true, // Add this flag to style error messages differently
        },
      ];
      setMessages(errorMessages);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(errorMessages));

      // Show retry button
      setShowRetryButton(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndTest = async () => {
    if (!config.apiKey) {
      toast.error("Please enter your API key");
      return;
    }

    setLoading(true);
    try {
      const testPrompt = "This is a test message. Please respond with 'OK' if you receive this.";
      
      let response;
      switch (config.provider) {
        case 'openai':
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
              model: config.model,
              messages: [{ role: "user", content: testPrompt }],
              max_tokens: 50
            })
          });
          break;

        case 'gemini':
          response = await fetch(`/api/gemini/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: testPrompt }]
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
          break;

        case 'anthropic':
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': config.apiKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: config.model,
              messages: [{ role: "user", content: testPrompt }]
            })
          });
          break;

        case 'mistral':
          response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
              model: config.model,
              messages: [{ role: "user", content: testPrompt }]
            })
          });
          break;

        case 'deepseek':
          response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              model: config.model,
              messages: [
                {
                  role: "user",
                  content: testPrompt
                }
              ],
              temperature: 0.7,
              max_tokens: 100,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0
            })
          });
          break;

        case 'ollama':
          response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: config.model,
              prompt: testPrompt,
              stream: false
            })
          });
          break;

        case 'huggingface':
          response = await fetch(`https://api-inference.huggingface.co/models/${config.model}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
              inputs: testPrompt
            })
          });
          break;

        case 'openrouter':
          response = await fetch('/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`,
              'HTTP-Referer': window.location.origin,
              'X-Title': 'AI Analysis Dashboard'
            },
            body: JSON.stringify({
              model: config.model,
              messages: [
                {
                  role: "user",
                  content: testPrompt
                }
              ]
            })
          });
          break;

        default:
          throw new Error(`Unsupported AI provider: ${config.provider}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || response.statusText);
      }

      toast.success(`${config.provider.toUpperCase()} connection successful!`, {
        description: `Successfully connected to ${getModelLabel()}`
      });

      // Save configuration if test was successful
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setIsConfigOpen(false);

    } catch (error) {
      console.error("API test error:", error);
      toast.error(`Failed to connect to ${config.provider.toUpperCase()}`, {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([{
      text: "Hello! I'm your AI assistant. Ask me to analyze data or generate visualizations for you.",
      isUser: false,
    }]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const fetchAvailableModels = async () => {
    if (!config.apiKey) return;
    setIsLoadingModels(true);
    try {
      switch (config.provider) {
        case 'gemini':
          const response = await fetch(`/api/gemini/v1beta/models?key=${config.apiKey}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
          }

          const data = await response.json();
          const models = data.models.map((model: any) => ({
            value: model.name,
            label: model.displayName || model.name
          }));
          setAvailableModels(models);
          // Reset current model since the available models changed
          saveConfig({ ...config, model: '' });
          break;
        default:
          setAvailableModels(PROVIDER_MODELS[config.provider] || []);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to fetch available models');
      setAvailableModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold">{t('ai.analyze')}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Badge 
            variant={isConfigured ? "success" : "destructive"}
            className="transition-all duration-300 hover:scale-105"
          >
            {isConfigured ? "Configured" : "Not Configured"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfigOpen(true)}
            className="group transition-all duration-300 hover:bg-primary/20 hover:text-primary"
          >
            <Settings className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
            {t('ai.configuration')}
          </Button>
        </div>
      </header>

      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`animate-fadeIn transition-all duration-300 ${
              index === messages.length - 1 && !message.isUser ? 'animate-slideInFromBottom' : ''
            }`}
          >
            <ChatMessage
              message={message}
              isTyping={isTyping && index === messages.length - 1}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 p-4 bg-black/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={t('ai.prompt')}
              className="w-full p-3 pr-24 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary resize-none min-h-[50px] transition-all duration-200"
              disabled={loading}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-2">
              {loading ? (
                <Spinner className="w-6 h-6 text-primary animate-pulse" />
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || !isConfigured}
                  className="h-8 group"
                >
                  <div className="flex items-center gap-2 group transition-all duration-200">
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    <span className="hidden sm:inline font-medium">Envoyer</span>
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 ml-2">
                      ⏎
                    </kbd>
                  </div>
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 hover:text-gray-300 transition-colors group"
            >
              <Trash2 className="w-3 h-3 group-hover:text-red-400 transition-colors" />
              {t('ai.clear')}
            </button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t('ai.configuration')}
            </DialogTitle>
            <DialogDescription>
              Configure your AI provider and model settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-sm font-medium">
                Provider
              </Label>
              <RadioGroup
                id="provider"
                value={config.provider}
                onValueChange={(value) => handleProviderChange(value as Config["provider"])}
                className="grid grid-cols-2 gap-2 sm:grid-cols-3"
              >
                {Object.keys(PROVIDER_MODELS).map((provider) => (
                  <div key={provider}>
                    <RadioGroupItem
                      value={provider}
                      id={`provider-${provider}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`provider-${provider}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 p-3 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 transition-all duration-200"
                    >
                      <span className="text-sm font-semibold capitalize">{provider}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-medium flex justify-between">
                <span>API Key</span>
                <button
                  type="button"
                  onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                  className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
                >
                  {isApiKeyVisible ? (
                    <>
                      <EyeOff className="h-3 w-3" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" /> Show
                    </>
                  )}
                </button>
              </Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={isApiKeyVisible ? "text" : "password"}
                  value={config.apiKey}
                  onChange={handleApiKeyChange}
                  placeholder={`Enter your ${config.provider} API key`}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">
                Model
              </Label>
              {isLoadingModels ? (
                <div className="flex items-center justify-center p-2">
                  <Spinner className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Loading models...</span>
                </div>
              ) : (
                <Select
                  value={config.model}
                  onValueChange={handleModelChange}
                  disabled={!config.apiKey}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {(availableModels.length > 0
                      ? availableModels
                      : PROVIDER_MODELS[config.provider] || []
                    ).map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfigOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndTest}
              disabled={!config.apiKey || !config.model || loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Testing...
                </>
              ) : (
                <>Save & Test</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAnalyzePage;
