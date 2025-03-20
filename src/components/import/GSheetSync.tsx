import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { gsheetApi } from "@/services/api/gsheetApi";
import { useToast } from "@/components/ui/use-toast";

interface GSheetSyncProps {
  pageId: string;
  onSync: (spreadsheetId: string) => Promise<void>;
}

export function GSheetSync({ pageId, onSync }: GSheetSyncProps) {
  const [open, setOpen] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    setIsAuthenticated(!!token);

    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          const accessToken = await gsheetApi.exchangeCodeForToken(code);
          localStorage.setItem('google_access_token', accessToken);
          setIsAuthenticated(true);
          window.history.pushState({}, '', window.location.pathname);
        } catch (error) {
          console.error('Auth error:', error);
          toast({
            title: "Erreur d'authentification",
            description: "Impossible de se connecter à Google",
            variant: "destructive",
          });
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const handleAuth = () => {
    window.location.href = gsheetApi.getAuthUrl();
  };

  const handleSync = async () => {
    if (!spreadsheetId) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un ID de feuille Google",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // D'abord, vérifions les informations du sheet
      const sheetInfo = await gsheetApi.getSheetInfo(spreadsheetId);
      console.log('Sheet info:', sheetInfo);

      // Ensuite, procédons à la synchronisation
      await onSync(spreadsheetId);
      
      setOpen(false);
      toast({
        title: "Synchronisation réussie",
        description: "Les données ont été importées avec succès.",
      });
    } catch (error: any) {
      console.error('Sync failed:', error);
      
      let errorMessage = "Une erreur est survenue lors de la synchronisation";
      
      if (error.response?.status === 400) {
        errorMessage = "Erreur : Vérifiez l'ID du document et le nom de la feuille";
      } else if (error.response?.status === 403) {
        errorMessage = "Erreur : Vérifiez les permissions d'accès au document";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur de synchronisation",
        description: errorMessage,
        variant: "destructive",
      });

      if (errorMessage.includes('Authentication expired')) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Cloud className="mr-2 h-4 w-4" />
          Sync GSheet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Synchroniser avec Google Sheets</DialogTitle>
          <DialogDescription>
            {isAuthenticated 
              ? "Entrez l'ID de votre Google Sheet pour synchroniser les données"
              : "Connectez-vous d'abord à votre compte Google"
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isAuthenticated ? (
            <Button onClick={handleAuth}>
              Se connecter avec Google
            </Button>
          ) : (
            <>
              <div className="grid gap-2">
                <Input
                  placeholder="ID du Google Sheet"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                />
              </div>
              <Button onClick={handleSync} disabled={isLoading}>
                {isLoading ? "Synchronisation..." : "Synchroniser"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
