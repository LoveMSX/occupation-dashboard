
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CSVImportForm } from "@/components/import/CSVImportForm";
import { ProjectCSVImportForm } from "@/components/import/ProjectCSVImportForm";
import { SalesCSVImportForm } from "@/components/import/SalesCSVImportForm";
import { ResourceCSVImportForm } from "@/components/import/ResourceCSVImportForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GSheetSync } from "@/components/import/GSheetSync";
import { NotionIntegration } from "@/components/import/NotionIntegration";

export default function ImportPage() {
  const [showEmployeeImport, setShowEmployeeImport] = useState(false);
  const [showProjectImport, setShowProjectImport] = useState(false);
  const [showSalesImport, setShowSalesImport] = useState(false);
  const [showResourceImport, setShowResourceImport] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Import / Export</h1>

      <Tabs defaultValue="csv">
        <TabsList className="mb-4">
          <TabsTrigger value="csv">CSV Import</TabsTrigger>
          <TabsTrigger value="google">Google Sheets</TabsTrigger>
          <TabsTrigger value="notion">Notion</TabsTrigger>
          <TabsTrigger value="api" disabled>API Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Employés</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  Importez vos données employés depuis un fichier CSV.
                </p>
                <div className="mt-4">
                  <Button variant="default" onClick={() => setShowEmployeeImport(true)}>
                    Importer des employés
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Projets</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  Importez vos données de projets depuis un fichier CSV.
                </p>
                <div className="mt-4">
                  <Button variant="default" onClick={() => setShowProjectImport(true)}>
                    Importer des projets
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Opportunités commerciales</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  Importez vos données d'opportunités commerciales depuis un fichier CSV.
                </p>
                <div className="mt-4">
                  <Button variant="default" onClick={() => setShowSalesImport(true)}>
                    Importer des opportunités
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Ressources</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  Importez des données de ressources externes depuis un fichier CSV.
                </p>
                <div className="mt-4">
                  <Button variant="default" onClick={() => setShowResourceImport(true)}>
                    Importer des ressources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="google">
          <Card>
            <CardHeader>
              <CardTitle>Synchronisation Google Sheets</CardTitle>
              <CardContent className="px-0">
                <GSheetSync pageId="import" onSync={() => {}} />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="notion">
          <NotionIntegration />
        </TabsContent>
      </Tabs>

      {/* Dialogs for import forms */}
      <Dialog open={showEmployeeImport} onOpenChange={setShowEmployeeImport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importer des employés</DialogTitle>
            <DialogDescription>
              Importez vos données employés depuis un fichier CSV.
            </DialogDescription>
          </DialogHeader>
          <CSVImportForm onClose={() => setShowEmployeeImport(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectImport} onOpenChange={setShowProjectImport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importer des projets</DialogTitle>
            <DialogDescription>
              Importez vos données projets depuis un fichier CSV.
            </DialogDescription>
          </DialogHeader>
          <ProjectCSVImportForm onClose={() => setShowProjectImport(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSalesImport} onOpenChange={setShowSalesImport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importer des opportunités commerciales</DialogTitle>
            <DialogDescription>
              Importez vos données d'opportunités depuis un fichier CSV.
            </DialogDescription>
          </DialogHeader>
          <SalesCSVImportForm onClose={() => setShowSalesImport(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showResourceImport} onOpenChange={setShowResourceImport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importer des ressources</DialogTitle>
            <DialogDescription>
              Importez vos données de ressources depuis un fichier CSV.
            </DialogDescription>
          </DialogHeader>
          <ResourceCSVImportForm onClose={() => setShowResourceImport(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
