
import React from "react";
import { AIAnalysisResult } from "@/pages/AIAnalyzePage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, ScatterChart } from "recharts";
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Pie,
  Cell,
  Scatter,
} from "recharts";
import {
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface AIResultProps {
  result: AIAnalysisResult;
}

export const AIResult: React.FC<AIResultProps> = ({ result }) => {
  const handleDownload = () => {
    // Implement download functionality here
    console.log("Downloading result:", result);
  };

  if (result.type === "text") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Analysis Result</h3>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="whitespace-pre-wrap">{result.data}</div>
        </ScrollArea>
      </div>
    );
  }

  if (result.type === "table") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Table Results</h3>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <Table>
            <TableHeader>
              {result.data.headers && (
                <TableRow>
                  {result.data.headers.map((header: string, idx: number) => (
                    <TableHead key={idx}>{header}</TableHead>
                  ))}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {result.data.rows && result.data.rows.map((row: any[], rowIdx: number) => (
                <TableRow key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <TableCell key={cellIdx}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    );
  }

  if (result.type === "chart") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Chart Results</h3>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Chart
          </Button>
        </div>
        
        <Tabs defaultValue={result.chartType || "bar"} className="flex-1">
          <TabsList className="mb-4">
            <TabsTrigger value="bar">
              <BarChart2 className="h-4 w-4 mr-2" />
              Bar
            </TabsTrigger>
            <TabsTrigger value="line">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Line
            </TabsTrigger>
            <TabsTrigger value="pie">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Pie
            </TabsTrigger>
            <TabsTrigger value="scatter">
              <ScatterChartIcon className="h-4 w-4 mr-2" />
              Scatter
            </TabsTrigger>
          </TabsList>
          
          <div className="h-[calc(100%-60px)]">
            <TabsContent value="bar" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.data.labels.map((label: string, idx: number) => ({
                  name: label,
                  ...result.data.datasets.reduce((acc: any, dataset: any, dataIdx: number) => {
                    acc[dataset.label] = dataset.data[idx];
                    return acc;
                  }, {})
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {result.data.datasets.map((dataset: any, idx: number) => (
                    <Bar 
                      key={idx} 
                      dataKey={dataset.label} 
                      fill={dataset.backgroundColor || COLORS[idx % COLORS.length]} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="line" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.data.labels.map((label: string, idx: number) => ({
                  name: label,
                  ...result.data.datasets.reduce((acc: any, dataset: any, dataIdx: number) => {
                    acc[dataset.label] = dataset.data[idx];
                    return acc;
                  }, {})
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {result.data.datasets.map((dataset: any, idx: number) => (
                    <Line 
                      key={idx} 
                      type="monotone" 
                      dataKey={dataset.label} 
                      stroke={dataset.backgroundColor || COLORS[idx % COLORS.length]} 
                      activeDot={{ r: 8 }} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pie" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.data.labels.map((label: string, idx: number) => ({
                      name: label,
                      value: result.data.datasets[0].data[idx]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {result.data.labels.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="scatter" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="X" />
                  <YAxis type="number" dataKey="y" name="Y" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  {result.data.datasets.map((dataset: any, idx: number) => (
                    <Scatter 
                      key={idx}
                      name={dataset.label} 
                      data={dataset.data.map((point: any, pointIdx: number) => ({
                        x: point.x !== undefined ? point.x : pointIdx,
                        y: point.y !== undefined ? point.y : point
                      }))} 
                      fill={dataset.backgroundColor || COLORS[idx % COLORS.length]} 
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">No results to display</p>
    </div>
  );
};
