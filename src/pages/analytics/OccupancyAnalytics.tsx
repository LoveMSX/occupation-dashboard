
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
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
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Mock data for charts
const monthlyData = [
  { name: "Jan", occupancy: 65, utilization: 72, target: 85 },
  { name: "Feb", occupancy: 72, utilization: 78, target: 85 },
  { name: "Mar", occupancy: 80, utilization: 84, target: 85 },
  { name: "Apr", occupancy: 78, utilization: 82, target: 85 },
  { name: "May", occupancy: 85, utilization: 88, target: 85 },
  { name: "Jun", occupancy: 90, utilization: 92, target: 85 },
  { name: "Jul", occupancy: 88, utilization: 91, target: 85 },
  { name: "Aug", occupancy: 83, utilization: 87, target: 85 },
  { name: "Sep", occupancy: 87, utilization: 90, target: 85 },
  { name: "Oct", occupancy: 91, utilization: 93, target: 85 },
  { name: "Nov", occupancy: 92, utilization: 94, target: 85 },
  { name: "Dec", occupancy: 89, utilization: 91, target: 85 },
];

const departmentData = [
  { name: "Engineering", occupancy: 92, headcount: 45 },
  { name: "Design", occupancy: 88, headcount: 12 },
  { name: "Product", occupancy: 85, headcount: 8 },
  { name: "Marketing", occupancy: 75, headcount: 15 },
  { name: "Sales", occupancy: 70, headcount: 20 },
  { name: "HR", occupancy: 65, headcount: 5 },
  { name: "Finance", occupancy: 60, headcount: 10 },
];

const seniorityData = [
  { name: "Junior", occupancy: 75, headcount: 30 },
  { name: "Mid-level", occupancy: 85, headcount: 48 },
  { name: "Senior", occupancy: 95, headcount: 35 },
  { name: "Lead", occupancy: 90, headcount: 12 },
  { name: "Manager", occupancy: 80, headcount: 8 },
];

const trendData = [
  { name: "Week 1", current: 82, previous: 78 },
  { name: "Week 2", current: 84, previous: 77 },
  { name: "Week 3", current: 85, previous: 79 },
  { name: "Week 4", current: 86, previous: 80 },
  { name: "Week 5", current: 88, previous: 82 },
  { name: "Week 6", current: 87, previous: 83 },
  { name: "Week 7", current: 89, previous: 85 },
  { name: "Week 8", current: 90, previous: 86 },
  { name: "Week 9", current: 92, previous: 88 },
  { name: "Week 10", current: 93, previous: 89 },
  { name: "Week 11", current: 91, previous: 90 },
  { name: "Week 12", current: 92, previous: 91 },
];

const OccupancyAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("quarterly");
  
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
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Occupancy Rate Analytics</h1>
              
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Occupancy Trend</CardTitle>
                  <CardDescription>
                    Occupancy rate vs. utilization over the past year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis 
                          domain={[0, 100]} 
                          ticks={[0, 20, 40, 60, 80, 100]} 
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, undefined]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="occupancy" name="Occupancy" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Line
                          type="monotone"
                          dataKey="utilization"
                          name="Utilization"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          name="Target"
                          stroke="#F97316"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy by Department</CardTitle>
                  <CardDescription>
                    Average occupancy rate across different departments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={70}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, undefined]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="occupancy" name="Occupancy" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy by Seniority</CardTitle>
                  <CardDescription>
                    Occupancy rates across different seniority levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={seniorityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis
                          yAxisId="left"
                          domain={[0, 100]}
                          ticks={[0, 20, 40, 60, 80, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 'dataMax + 10']}
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'occupancy' ? `${value}%` : value,
                            name === 'occupancy' ? 'Occupancy' : 'Headcount'
                          ]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="occupancy"
                          name="Occupancy"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="headcount"
                          name="Headcount"
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Current vs. Previous Quarter</CardTitle>
                  <CardDescription>
                    Comparison of occupancy trends between quarters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis
                          domain={[70, 100]}
                          ticks={[70, 75, 80, 85, 90, 95, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, undefined]}
                          contentStyle={{ 
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)'
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="current"
                          name="Current Quarter"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="previous"
                          name="Previous Quarter"
                          stroke="#8E9196"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default OccupancyAnalytics;
