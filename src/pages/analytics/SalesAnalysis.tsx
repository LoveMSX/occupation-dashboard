import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '@/services/api';
import { logError } from '@/utils/logger';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const SalesAnalysis = () => {
  useEffect(() => {
    try {
      // Your initialization code here
    } catch (error) {
      logError(error as Error, 'SalesAnalysis');
    }
  }, []);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: salesApi.getAllSalesOperations,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Données pour le graphique de répartition par statut
  const statusData = sales.reduce((acc: any, sale: any) => {
    const status = sale.statut;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(statusData).map(([name, value]) => ({
    name,
    value,
  }));

  // Données pour le graphique d'évolution mensuelle
  const monthlyData = sales.reduce((acc: any, sale: any) => {
    const month = new Date(sale.date_reception).toLocaleString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[month]) {
      acc[month] = { month, count: 0, amount: 0 };
    }
    acc[month].count += 1;
    acc[month].amount += (sale.tjm * sale.chiffrage_jh) || 0;
    return acc;
  }, {});

  const barChartData = Object.values(monthlyData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Analyse des Ventes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Nombre" fill="#8884d8" />
                  <Bar dataKey="amount" name="Montant" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAnalysis;
