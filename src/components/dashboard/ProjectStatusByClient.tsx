
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { projectsData } from "@/data/projectsData";

export function ProjectStatusByClient() {
  // Traiter les données pour le graphique de statut par client
  const processProjectStatusByClient = () => {
    // Récupérer tous les clients uniques
    const clients = Array.from(new Set(projectsData.map(p => p.client)));
    
    // Créer les données pour le graphique
    return clients.map(client => {
      const clientProjects = projectsData.filter(p => p.client === client);
      const ongoing = clientProjects.filter(p => p.status === "ongoing").length;
      const completed = clientProjects.filter(p => p.status === "completed").length;
      const standby = clientProjects.filter(p => p.status === "standby").length;
      const total = clientProjects.length;
      
      return {
        name: client,
        ongoing,
        completed,
        standby,
        total
      };
    });
  };

  const data = processProjectStatusByClient();
  if (process.env.NODE_ENV === 'development') {
    window.console.log('Project status data:', data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut des Projets par Client</CardTitle>
        <CardDescription>Vue d'ensemble de l'état des projets par client</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const translatedName = 
                    name === 'ongoing' ? 'En cours' : 
                    name === 'completed' ? 'Terminés' : 
                    name === 'standby' ? 'En attente' : name;
                  return [value, translatedName];
                }}
                contentStyle={{ 
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)'
                }}
              />
              <Legend 
                formatter={(value) => {
                  const translatedValue = 
                    value === 'ongoing' ? 'En cours' : 
                    value === 'completed' ? 'Terminés' : 
                    value === 'standby' ? 'En attente' : value;
                  return <span className="text-sm">{translatedValue}</span>;
                }}
              />
              <Bar 
                dataKey="ongoing" 
                name="ongoing" 
                stackId="a" 
                fill="#0EA5E9" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="completed" 
                name="completed" 
                stackId="a" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="standby" 
                name="standby" 
                stackId="a" 
                fill="#F97316" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
