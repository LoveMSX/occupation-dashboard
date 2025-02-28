
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { projectsData } from "@/data/projectsData";

export function ProjectsDistributionChart() {
  // Traiter les données réelles des projets pour le graphique
  const processProjectCategoryData = () => {
    const categoryCount: Record<string, number> = {};
    
    projectsData.forEach(project => {
      if (categoryCount[project.category]) {
        categoryCount[project.category]++;
      } else {
        categoryCount[project.category] = 1;
      }
    });
    
    const total = projectsData.length;
    
    // Transformer en pourcentage et couleur
    return Object.entries(categoryCount).map(([category, count]) => {
      const percentage = Math.round((count / total) * 100);
      
      // Assigner des couleurs selon la catégorie
      let color = "";
      switch(category) {
        case "TMA":
          color = "hsl(221.2, 83.2%, 53.3%)"; // blue
          break;
        case "Forfait":
          color = "hsl(142, 76%, 36%)"; // green
          break;
        case "Regie":
          color = "hsl(38, 92%, 50%)"; // orange
          break;
        case "Other":
          color = "hsl(0, 84%, 60%)"; // red
          break;
        default:
          color = "hsl(261, 81%, 56%)"; // indigo
      }
      
      return { name: category, value: percentage, color };
    });
  };

  const data = processProjectCategoryData();

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Répartition des Projets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                animationBegin={200}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Allocation']}
                contentStyle={{ 
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={10}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
