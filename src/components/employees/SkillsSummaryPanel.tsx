import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', 
  '#a4de6c', '#d0ed57'
];

interface EmployeeData {
  id: number;
  name: string;
  competences_2024?: string[];
  // ... autres propriétés
}

interface SkillsSummaryPanelProps {
  employees: EmployeeData[];
}

export function SkillsSummaryPanel({ employees }: SkillsSummaryPanelProps) {
  // Calcul des statistiques de compétences
  const skillsData = React.useMemo(() => {
    const skillsMap = new Map<string, number>();
    
    employees.forEach(employee => {
      employee.competences_2024?.forEach(skill => {
        skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
      });
    });

    return Array.from(skillsMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [employees]);

  return (
    <Card className="p-4">
      <CardContent className="pt-4">
        <h2 className="text-xl font-bold mb-4">Résumé des compétences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liste des compétences */}
          <div className="space-y-2">
            {skillsData.map((skill, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground">
                  {skill.value} ressource{skill.value > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
          
          {/* Graphique en camembert */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {skillsData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
