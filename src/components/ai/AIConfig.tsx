
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AIConfigProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
}

export const AIConfig: React.FC<AIConfigProps> = ({
  apiKey,
  setApiKey,
  model,
  setModel
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">LLM Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure the large language model settings for your analysis
        </p>
      </div>

      <Alert variant="outline" className="bg-blue-50 dark:bg-blue-950">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your API key is stored only in your browser and is never sent to our servers.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Required for connecting to the language model API
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
              <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              <SelectItem value="llama-3.1-8b">Llama 3.1 (8B)</SelectItem>
              <SelectItem value="llama-3.1-70b">Llama 3.1 (70B)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select the language model to use for analysis
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Advanced Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Select defaultValue="0.7">
                  <SelectTrigger id="temperature">
                    <SelectValue placeholder="Temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.0">0.0 (Deterministic)</SelectItem>
                    <SelectItem value="0.3">0.3 (More focused)</SelectItem>
                    <SelectItem value="0.7">0.7 (Balanced)</SelectItem>
                    <SelectItem value="1.0">1.0 (More creative)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Select defaultValue="1024">
                  <SelectTrigger id="max-tokens">
                    <SelectValue placeholder="Max tokens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512">512</SelectItem>
                    <SelectItem value="1024">1024</SelectItem>
                    <SelectItem value="2048">2048</SelectItem>
                    <SelectItem value="4096">4096</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-6">Save Configuration</Button>
      </div>
    </div>
  );
};
