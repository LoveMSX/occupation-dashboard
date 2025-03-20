
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GSheetSync } from "@/components/import/GSheetSync";
import { NotionIntegration } from "@/components/import/NotionIntegration";
import { CSVImportForm } from "@/components/import/CSVImportForm";
import { ProjectCSVImportForm } from "@/components/import/ProjectCSVImportForm";
import { ResourceCSVImportForm } from "@/components/import/ResourceCSVImportForm";
import { SalesCSVImportForm } from "@/components/import/SalesCSVImportForm";

function ImportPage() {
  const [activeTab, setActiveTab] = useState("csv");
  const [activeCSVTab, setActiveCSVTab] = useState("employees");

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Import Data</h1>
      </div>

      <Tabs defaultValue="csv" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="csv">CSV Import</TabsTrigger>
          <TabsTrigger value="gsheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="notion">Notion</TabsTrigger>
        </TabsList>

        {/* CSV Import */}
        <TabsContent value="csv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CSV Import</CardTitle>
              <CardDescription>
                Upload CSV files to import data into the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="employees" value={activeCSVTab} onValueChange={setActiveCSVTab}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="sales">Sales Opportunities</TabsTrigger>
                </TabsList>
                <TabsContent value="employees">
                  <CSVImportForm onClose={() => {}} />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectCSVImportForm onClose={() => {}} />
                </TabsContent>
                <TabsContent value="resources">
                  <ResourceCSVImportForm onClose={() => {}} />
                </TabsContent>
                <TabsContent value="sales">
                  <SalesCSVImportForm onClose={() => {}} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Sheets Integration */}
        <TabsContent value="gsheets">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Integration</CardTitle>
              <CardDescription>
                Connect to Google Sheets to import data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GSheetSync 
                pageId="imports" 
                onSync={async (spreadsheetId: string) => {
                  console.log("Sync initiated for spreadsheet:", spreadsheetId);
                  return Promise.resolve();
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notion Integration */}
        <TabsContent value="notion">
          <Card>
            <CardHeader>
              <CardTitle>Notion Integration</CardTitle>
              <CardDescription>
                Connect to Notion to import data
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
}

export default ImportPage;
