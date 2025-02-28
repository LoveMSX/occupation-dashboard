
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
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
import { useState } from "react";

// Mock data for charts
const projectTypeData = [
  { name: "Product Development", value: 45, color: "hsl(221.2, 83.2%, 53.3%)" },
  { name: "Consulting", value: 25, color: "hsl(142, 76%, 36%)" },
  { name: "Research", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Internal", value: 10, color: "hsl(0, 84%, 60%)" },
  { name: "Other", value: 5, color: "hsl(217, 91%, 60%)" }
];

const employeeDistributionData = [
  { name: "Project A", underAllocated: 5, optimal: 12, overAllocated: 3 },
  { name: "Project B", underAllocated: 3, optimal: 8, overAllocated: 1 },
  { name: "Project C", underAllocated: 2, optimal: 15, overAllocated: 4 },
  { name: "Project D", underAllocated: 4, optimal: 10, overAllocated: 2 },
  { name: "Project E", underAllocated: 1, optimal: 6, overAllocated: 0 },
  { name: "Project F", underAllocated: 2, optimal: 7, overAllocated: 1 },
];

const projectDurationData = [
  { name: "< 3 months", count: 12, color: "#8884d8" },
  { name: "3-6 months", count: 18, color: "#83a6ed" },
  { name: "6-12 months", count: 8, color: "#8dd1e1" },
  { name: "> 12 months", count: 4, color: "#82ca9d" },
];

// Fixed Treemap data structure - flattened for recharts compatibility
const projectAllocationData = [
  { name: "Engineering / Project A", size: 12, department: "Engineering", project: "Project A" },
  { name: "Engineering / Project B", size: 8, department: "Engineering", project: "Project B" },
  { name: "Engineering / Project C", size: 5, department: "Engineering", project: "Project C" },
  { name: "Design / Project A", size: 4, department: "Design", project: "Project A" },
  { name: "Design / Project D", size: 6, department: "Design", project: "Project D" },
  { name: "Product / Project B", size: 3, department: "Product", project: "Project B" },
  { name: "Product / Project E", size: 7, department: "Product", project: "Project E" },
  { name: "Marketing / Project F", size: 5, department: "Marketing", project: "Project F" },
];

// Color mapping for departments
const DEPARTMENT_COLORS = {
  "Engineering": "#0088FE",
  "Design": "#00C49F",
  "Product": "#FFBB28",
  "Marketing": "#FF8042"
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#83A6ED"];

const ProjectsAnalytics = () => {
  const [selectedView, setSelectedView] = useState("distribution");
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return percent * 100 > 5 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
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
                            fill="var(--warning)" 
                          />
                          <Bar 
                            dataKey="optimal" 
                            name="Optimal Allocation" 
                            stackId="a" 
                            fill="var(--success)" 
                          />
                          <Bar 
                            dataKey="overAllocated" 
                            name="Over Allocated" 
                            stackId="a" 
                            fill="var(--danger)" 
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
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProjectsAnalytics;
