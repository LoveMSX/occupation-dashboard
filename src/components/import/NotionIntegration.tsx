
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Check, Database, LinkIcon } from "lucide-react";

export function NotionIntegration() {
  const [apiKey, setApiKey] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (!apiKey || !databaseId) {
      toast.error("Please enter both API key and database ID");
      return;
    }

    setIsConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast.success("Successfully connected to Notion", {
        description: "Your Notion database is now integrated with the dashboard."
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey("");
    setDatabaseId("");
    toast.info("Disconnected from Notion");
  };

  return (
    <Card className="transition-all duration-300">
      <CardHeader>
        <CardTitle>Notion Integration</CardTitle>
        <CardDescription>
          Connect to your Notion database to import employee and project data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="api-key">Notion API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="secret_xxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="database-id">Database ID</Label>
              <Input
                id="database-id"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={databaseId}
                onChange={(e) => setDatabaseId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The ID of your Notion database containing employee data
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-medium">Connected to Notion</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>Database: {databaseId.substring(0, 8)}...{databaseId.substring(databaseId.length - 4)}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                toast.success("Syncing data from Notion...");
                // Simulate sync process
                setTimeout(() => {
                  toast.success("Data synchronized successfully");
                }, 2000);
              }}
            >
              Sync Now
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isConnected ? (
          <Button 
            className="w-full" 
            onClick={handleConnect} 
            disabled={!apiKey || !databaseId || isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect to Notion"}
            {!isConnecting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full text-danger" 
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
