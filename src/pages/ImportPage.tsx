
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVImportForm } from "@/components/import/CSVImportForm";
import { ResourceCSVImportForm } from "@/components/import/ResourceCSVImportForm";
import { ProjectCSVImportForm } from "@/components/import/ProjectCSVImportForm";
import { SalesCSVImportForm } from "@/components/import/SalesCSVImportForm";
import { GSheetSync } from "@/components/import/GSheetSync";
import { NotionIntegration } from "@/components/import/NotionIntegration";

export const ImportPage = () => {
  const [activeTab, setActiveTab] = useState("employee-csv");
  
  // Dummy close handler for demo purposes
  const handleClose = () => {
    console.log("Import form closed");
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Import Data</h1>
      </div>

      <Tabs defaultValue="employee-csv" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="employee-csv">Employees CSV</TabsTrigger>
          <TabsTrigger value="resource-csv">Resources CSV</TabsTrigger>
          <TabsTrigger value="project-csv">Projects CSV</TabsTrigger>
          <TabsTrigger value="sales-csv">Sales CSV</TabsTrigger>
          <TabsTrigger value="google-sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="notion">Notion</TabsTrigger>
        </TabsList>

        <TabsContent value="employee-csv">
          <Card>
            <CardHeader>
              <CardTitle>Import Employees from CSV</CardTitle>
              <CardDescription>
                Upload a CSV file containing employee data to be imported into the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVImportForm onClose={handleClose} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resource-csv">
          <Card>
            <CardHeader>
              <CardTitle>Import Resources from CSV</CardTitle>
              <CardDescription>
                Upload a CSV file containing resource data to be imported into the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceCSVImportForm onClose={handleClose} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="project-csv">
          <Card>
            <CardHeader>
              <CardTitle>Import Projects from CSV</CardTitle>
              <CardDescription>
                Upload a CSV file containing project data to be imported into the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectCSVImportForm onClose={handleClose} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales-csv">
          <Card>
            <CardHeader>
              <CardTitle>Import Sales Opportunities from CSV</CardTitle>
              <CardDescription>
                Upload a CSV file containing sales opportunity data to be imported into the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesCSVImportForm onClose={handleClose} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google-sheets">
          <Card>
            <CardHeader>
              <CardTitle>Import from Google Sheets</CardTitle>
              <CardDescription>
                Connect to Google Sheets to import data directly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GSheetSync />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notion">
          <Card>
            <CardHeader>
              <CardTitle>Import from Notion</CardTitle>
              <CardDescription>
                Connect to Notion to import data directly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotionIntegration />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportPage;
