
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock function for handling sync
const handleSync = async (spreadsheetId: string) => {
  console.log("Would sync resources from spreadsheet:", spreadsheetId);
  // Use a mock promise to simulate API call
  return Promise.resolve({ success: true });
};

function ResourcesPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSyncResources = async () => {
    setIsLoading(true);
    try {
      // Use a mock spreadsheet ID
      const spreadsheetId = "mock-spreadsheet-id";
      const result = await handleSync(spreadsheetId);
      toast.success("Resources synced successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to sync resources: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your workforce resources and allocations.</p>
            <Button onClick={handleSyncResources} disabled={isLoading}>
              {isLoading ? "Syncing..." : "Sync Resources"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResourcesPage;
