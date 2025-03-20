import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '@/services/api';
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
  LineChart,
  Line,
} from 'recharts';

const SalesPerformance = () => {
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

  // Données de performance par commercial
  const commercialPerformance = sales.reduce((acc: any, sale: any) => {
    const commercial = sale.commerciale;
    if (!acc[commercial]) {
      acc[commercial] = {
        name: commercial,
        opportunities: 0,
        won: 0,
        amount: 0,
      };
    }
    acc[commercial].opportunities += 1;
    if (sale.statut.toLowerCase() === 'gagne') {
      acc[commercial].won += 1;
      acc[commercial].amount += (sale.tjm * sale.chiffrage_jh) || 0;
    }
    return acc;
  }, {});

  const performanceData = Object.values(commercialPerformance);

  // Calcul du taux de conversion mensuel
  const monthlyConversion = sales.reduce((acc: any, sale: any) => {
    const month = new Date(sale.date_reception).toLocaleString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[month]) {
      acc[month] = { month, total: 0, won: 0 };
    }
    acc[month].total += 1;
    if (sale.statut.toLowerCase() === 'gagne') {
      acc[month].won += 1;
    }
    acc[month].rate = (acc[month].won / acc[month].total) * 100;
    return acc;
  }, {});

  const conversionData = Object.values(monthlyConversion);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Performance Commerciale</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance par Commercial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="opportunities" name="Opportunités" fill="#8884d8" />
                  <Bar dataKey="won" name="Gagnées" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de Conversion Mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Taux de conversion (%)"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesPerformance;