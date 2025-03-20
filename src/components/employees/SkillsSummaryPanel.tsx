
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface SkillsSummaryPanelProps {
  skills: string[];
  employees: any[];
}

export function SkillsSummaryPanel({ skills, employees }: SkillsSummaryPanelProps) {
  if (!skills || !employees) {
    return <div className="p-4">Loading...</div>;
  }

  const skillCounts = skills.map(skill => ({
    skill,
    count: employees.filter(employee => employee.skills?.includes(skill)).length,
  }));

  const totalEmployees = employees.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {skillCounts.map(({ skill, count }) => (
          <div key={skill} className="mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{skill}</span>
              <span className="text-xs text-muted-foreground">{count} / {totalEmployees}</span>
            </div>
            <Progress value={(count / totalEmployees) * 100} className="h-2 mt-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SkillsSummaryPanel;
