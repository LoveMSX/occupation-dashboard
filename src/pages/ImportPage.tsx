
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import { CSVImportForm } from "@/components/import/CSVImportForm";
import { NotionIntegration } from "@/components/import/NotionIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const ImportPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Import & Manage Data</h1>
            
            <Tabs defaultValue="csv" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="csv">CSV Import</TabsTrigger>
                <TabsTrigger value="notion">Notion Integration</TabsTrigger>
              </TabsList>
              <TabsContent value="csv" className="animate-fade-in">
                <CSVImportForm />
              </TabsContent>
              <TabsContent value="notion" className="animate-fade-in">
                <NotionIntegration />
              </TabsContent>
            </Tabs>
            
            <Separator className="my-8" />
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Data Format Requirements</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>CSV files must include headers that match the database fields</li>
                <li>Date formats should be in YYYY-MM-DD format</li>
                <li>For related data (like project assignments), use IDs to reference other records</li>
                <li>Text fields should use UTF-8 encoding</li>
                <li>Numeric values should not contain currency symbols or thousand separators</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImportPage;
