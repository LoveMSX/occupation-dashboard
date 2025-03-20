
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeData } from './EmployeeCard';
import { useLanguage } from "@/components/LanguageProvider";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

export interface SkillsSummaryPanelProps {
  employees: EmployeeData[];
}

// Function to calculate skills summary from all employees
const calculateSkillsSummary = (employees: EmployeeData[]) => {
  const skillCounts: Record<string, number> = {};

  employees.forEach((employee) => {
    employee.competences_2024?.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  return Object.entries(skillCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Get top 10 skills
};

export function SkillsSummaryPanel({
  employees,
}: SkillsSummaryPanelProps) {
  const { t } = useLanguage();
  const skillsData = calculateSkillsSummary(employees);

  return (
    <Card className="p-4">
      <CardContent className="pt-4">
        <h2 className="text-xl font-bold mb-4">{t("skills.summary")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left side: Skills list */}
          <div className="space-y-2">
            {skillsData.map((skill, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground">
                  {skill.value} {t("resources")}
                </span>
              </div>
            ))}
          </div>

          {/* Right side: Pie chart */}
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
                  {skillsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value} ${t("resources")}`,
                    t("count"),
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SkillsSummaryPanel;
