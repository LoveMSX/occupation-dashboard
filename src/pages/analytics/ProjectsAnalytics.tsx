import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Treemap,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectsData } from "@/data/projectsData";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const processProjectTypeData = () => {
  const categoryCount: Record<string, number> = {};
  
  projectsData.forEach(project => {
    if (categoryCount[project.category]) {
      categoryCount[project.category]++;
    } else {
      categoryCount[project.category] = 1;
    }
  });
  
  const total = projectsData.length;
  
  return Object.entries(categoryCount).map(([category, count]) => {
    const percentage = Math.round((count / total) * 100);
    
    let color = "";
    switch(category) {
      case "TMA":
        color = "#9b87f5"; // purple
        break;
      case "Forfait":
        color = "#10B981"; // green
        break;
      case "Regie":
        color = "#F97316"; // orange
        break;
      case "FORMATION":
        color = "#EF4444"; // red
        break;
      case "EDITION":
        color = "#3B82F6"; // azure blue
        break;
      case "SUPPORT":
        color = "#8B5CF6"; // purple
        break;
      default:
        color = "#6366F1"; // indigo
    }
    
    return { name: category, value: percentage, color };
  });
};

const processEmployeeDistribution = () => {
  const clients = Array.from(new Set(projectsData.map(p => p.client))).slice(0, 6);
  
  return clients.map(client => {
    const clientProjects = projectsData.filter(p => p.client === client);
    const averageTeamSize = clientProjects.reduce((acc, p) => acc + p.team.length, 0) / clientProjects.length;
    
    let underAllocated = Math.floor(Math.random() * 5) + 1;
    let optimal = Math.floor(averageTeamSize);
    let overAllocated = Math.floor(Math.random() * 3);
    
    return {
      name: client,
      underAllocated,
      optimal,
      overAllocated
    };
  });
};

const processProjectDuration = () => {
  const durations: Record<string, number> = {
    "< 3 months": 0,
    "3-6 months": 0,
    "6-12 months": 0,
    "> 12 months": 0
  };
  
  projectsData.forEach(project => {
    if (!project.startDate || !project.endDate) return;
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const durationMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (durationMonths < 3) {
      durations["< 3 months"]++;
    } else if (durationMonths < 6) {
      durations["3-6 months"]++;
    } else if (durationMonths < 12) {
      durations["6-12 months"]++;
    } else {
      durations["> 12 months"]++;
    }
  });
  
  const durationColors = {
    "< 3 months": "#8B5CF6", 
    "3-6 months": "#3B82F6",
    "6-12 months": "#0EA5E9",
    "> 12 months": "#10B981"
  };
  
  return Object.entries(durations).map(([name, count]) => ({
    name,
    count,
    color: durationColors[name as keyof typeof durationColors]
  }));
};

const processProjectAllocation = () => {
  const departments = ["Information Technology", "Development", "Design", "Project Management", "Operations", "Business Analysis"];
  
  const result = [];
  
  for (const department of departments) {
    const departmentProjects = projectsData.slice(0, 3);
    
    for (const project of departmentProjects) {
      const employeeData = {
        name: employee?.name || 'Unknown',
        size: projects?.filter(p => p.team?.includes(employee.id)).length || 0,
        department: employee?.department || 'Unknown',
        project: project?.name || 'N/A'
      };
      
      result.push(employeeData);
    }
  }
  
  return result;
};

const projectTypeData = processProjectTypeData();
const employeeDistributionData = processEmployeeDistribution();
const projectDurationData = processProjectDuration();
const projectAllocationData = processProjectAllocation();

const DEPARTMENT_COLORS = {
  "Information Technology": "#3B82F6", // blue
  "Design": "#10B981", // green
  "Development": "#F97316", // orange
  "Project Management": "#EF4444", // red
  "Operations": "#8B5CF6", // purple
  "Business Analysis": "#0EA5E9" // light blue
};

const COLORS = ["#3B82F6", "#10B981", "#F97316", "#EF4444", "#8B5CF6", "#0EA5E9"];

export default function ProjectsAnalytics() {
  const [selectedView, setSelectedView] = useState("distribution");
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Project Distribution Analytics</h1>
        
        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="duration">Duration</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Distribution by Type</CardTitle>
            <CardDescription>
              Breakdown of projects by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={140}
                    innerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {projectTypeData.map((entry, index) => (
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
      </div>
      
      {selectedView === "distribution" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Employee Distribution Across Projects</CardTitle>
              <CardDescription>
                Employee allocation across major projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={employeeDistributionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    stackOffset="expand"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ 
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="underAllocated" 
                      name="Under Allocated" 
                      stackId="a" 
                      fill="#F97316" 
                    />
                    <Bar 
                      dataKey="optimal" 
                      name="Optimal Allocation" 
                      stackId="a" 
                      fill="#10B981" 
                    />
                    <Bar 
                      dataKey="overAllocated" 
                      name="Over Allocated" 
                      stackId="a" 
                      fill="#EF4444" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {selectedView === "allocation" && (
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Allocation By Department</CardTitle>
              <CardDescription>
                Heatmap of projects across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={projectAllocationData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    fill="var(--primary)"
                  >
                    <Tooltip
                      contentStyle={{ 
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                      }}
                      formatter={(value: any, name: any, props: any) => {
                        return [`${value} employees`, name];
                      }}
                    />
                    {projectAllocationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={DEPARTMENT_COLORS[entry.department as keyof typeof DEPARTMENT_COLORS] || '#8884d8'} 
                      />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {selectedView === "duration" && (
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Duration Distribution</CardTitle>
              <CardDescription>
                Number of projects by duration category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectDurationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ 
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                      }}
                      formatter={(value: any) => [`${value} projects`, 'Count']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Project Count" 
                      radius={[4, 4, 0, 0]}
                    >
                      {projectDurationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
