import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ResourceCSVImportForm } from "@/components/import/ResourceCSVImportForm";
import { GSheetSync } from "@/components/import/GSheetSync";
import { gsheetApi } from "@/services/api/gsheetApi";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { resourceApi } from "@/services/api";

export function ResourcesPage() {
  const queryClient = useQueryClient();
  const [openImport, setOpenImport] = useState(false);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourceApi.getAllResources()
  });

  const handleGSheetSync = async (spreadsheetId: string) => {
    try {
      await gsheetApi.syncResources(spreadsheetId);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    } catch (error) {
      console.error('Sync error:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-full">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle ressource
          </Button>
          <GSheetSync pageId="resources" onSync={handleGSheetSync} />
          <Dialog open={openImport} onOpenChange={setOpenImport}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ResourceCSVImportForm onClose={() => setOpenImport(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Rest of your component */}
    </main>
  );
}
