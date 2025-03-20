
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, BarChart2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OccupancyData {
  name: string;
  occupancy: number;
}

interface Props {
  occupancyData : OccupancyData[] | undefined
}
// Mock data for the chart

export function OccupancyChart({occupancyData}:Props) {
  const [timeRange, setTimeRange] = useState("monthly");

  const [data, setData] = useState<OccupancyData[]>([]);

  useEffect(()=>{
    if(occupancyData){
      setData(occupancyData)
    }
  },[occupancyData]);  
  
  // Calculate average occupancy
  const avgOccupancy = useMemo(() => {
    return (data.reduce((sum, item) => sum + item.occupancy, 0) / data.length).toFixed(1);
  }, [data]);
  
  // Calculate difference from previous period
  const previousAvg = useMemo(() => {
    // This is just sample logic - in real app would compare with actual previous period data
    if (timeRange === "monthly") return 84.2;
    if (timeRange === "weekly") return 89.1;
    return 82.5;
  }, [timeRange]);
  
  const difference = (parseFloat(avgOccupancy) - previousAvg).toFixed(1);
  const isPositive = parseFloat(difference) > 0;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Occupancy Rate</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="monthly" value={timeRange} onValueChange={setTimeRange}>
            {/* <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList> */}
          </Tabs>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
          <div>
            <div className="flex items-baseline">
              <h3 className="text-3xl font-bold">{avgOccupancy}%</h3>
              <span className="ml-2 text-sm text-muted-foreground">avg. occupancy</span>
            </div>
            <div className="flex items-center mt-1">
              {isPositive ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-success" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-danger" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-success" : "text-danger"
                )}
              >
                {isPositive ? "+" : ""}{difference}%
              </span>
              <span className="ml-1 text-xs text-muted-foreground">
                vs previous period
              </span>
            </div>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <div className="flex items-center mr-4">
              <div className="h-3 w-3 rounded-full bg-primary mr-1"></div>
              <span className="text-xs">Occupancy</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-muted/50 mr-1"></div>
              <span className="text-xs">Target (85%)</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border)'
                }}
                formatter={(value) => [`${value}%`, 'Occupancy']}
              />
              <Bar 
                dataKey="occupancy" 
                fill="url(#occupancyFill)" 
                radius={[4, 4, 0, 0]}
                barSize={timeRange === "monthly" ? 20 : 40}
                animationDuration={1000}
              />
              {/* Target line at 85% */}
              <ReferenceLine y={85} stroke="var(--muted)" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom recharts components
import { Line, ReferenceLine } from "recharts";
