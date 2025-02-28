
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CSVImportForm } from "@/components/import/CSVImportForm";
import { NotionIntegration } from "@/components/import/NotionIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImportPage = () => {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Import Employee & Project Data</h1>
              
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
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Data Format Requirements</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>CSV files must include headers for Employee ID, Name, Position, etc.</li>
                  <li>Date formats should be in YYYY-MM-DD format</li>
                  <li>Project assignments should reference employee ID</li>
                  <li>Occupancy rates should be provided as percentages (0-100)</li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ImportPage;
