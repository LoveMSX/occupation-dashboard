
import React, { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIChat } from "@/components/ai/AIChat";
import { AIConfig } from "@/components/ai/AIConfig";
import { AIResult } from "@/components/ai/AIResult";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export interface AIAnalysisResult {
  type: "text" | "chart" | "table";
  data: any;
  chartType?: "bar" | "line" | "pie" | "scatter";
}

const AIAnalyzePage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [model, setModel] = useState<string>("gpt-3.5-turbo");
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleAnalyze = async (prompt: string) => {
    if (!apiKey || !prompt) return;
    
    setIsAnalyzing(true);
    
    try {
      // Mock analysis result for demonstration
      // In a real implementation, this would call an API with the provided API key
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example result with chart data
      const mockResult: AIAnalysisResult = {
        type: "chart",
        chartType: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Sales 2023",
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: "rgba(59, 130, 246, 0.5)",
            },
            {
              label: "Sales 2022",
              data: [45, 79, 50, 41, 66, 35],
              backgroundColor: "rgba(16, 185, 129, 0.5)",
            },
          ],
        }
      };
      
      setResult(mockResult);
    } catch (error) {
      console.error("Error during analysis:", error);
      // Handle error in a real implementation
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col space-y-6">
              <h1 className="text-2xl font-bold">AI Analysis</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <Tabs defaultValue="chat">
                    <TabsList className="mb-4">
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="config">Configuration</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="chat" className="space-y-4">
                      <Card className="p-4">
                        <AIChat 
                          prompt={prompt} 
                          setPrompt={setPrompt} 
                          onSend={handleAnalyze}
                          isLoading={isAnalyzing}
                        />
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="config" className="space-y-4">
                      <Card className="p-4">
                        <AIConfig
                          apiKey={apiKey}
                          setApiKey={setApiKey}
                          model={model}
                          setModel={setModel}
                        />
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="p-4 h-full">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-10 w-10 animate-spin mb-4" />
                        <p className="text-muted-foreground">Analyzing data...</p>
                      </div>
                    ) : result ? (
                      <AIResult result={result} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p>Enter a prompt and click analyze to see results</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AIAnalyzePage;
