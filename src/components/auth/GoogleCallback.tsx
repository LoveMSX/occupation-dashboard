import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsheetApi } from "@/services/api/gsheetApi";
import { useToast } from "@/components/ui/use-toast";

export function GoogleCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          const accessToken = await gsheetApi.exchangeCodeForToken(code);
          localStorage.setItem('google_access_token', accessToken);
          toast({
            title: "Authentification réussie",
            description: "Vous êtes maintenant connecté à Google",
          });
          navigate('/'); // Redirect to home page after successful auth
        } catch (error) {
          console.error('Auth error:', error);
          toast({
            title: "Erreur d'authentification",
            description: "Impossible de se connecter à Google",
            variant: "destructive",
          });
          navigate('/');
        }
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authentication en cours...</h2>
        <p className="text-gray-600">Veuillez patienter pendant que nous finalisons la connexion.</p>
      </div>
    </div>
  );
}