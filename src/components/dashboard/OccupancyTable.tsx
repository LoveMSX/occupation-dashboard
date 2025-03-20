
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/components/LanguageProvider';
import { ArrowUpDown, Download, Search } from 'lucide-react';
import { dashboardApi, OccupancyTableData } from '@/services/dashboardApi';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Props {
  occupancyData: OccupancyTableData[];
}

export const OccupancyTable: React.FC<Props> = ({ occupancyData }) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('employee_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = React.useMemo(() => {
    return occupancyData
      .filter(row => 
        row.employee_name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortColumn as keyof OccupancyTableData];
        const bValue = b[sortColumn as keyof OccupancyTableData];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aValueStr = String(aValue).toLowerCase();
        const bValueStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' 
          ? aValueStr.localeCompare(bValueStr)
          : bValueStr.localeCompare(aValueStr);
      });
  }, [occupancyData, search, sortColumn, sortDirection]);

  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Employee', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];
    const rows = filteredData.map(row => [
      row.employee_name,
      row.january,
      row.february,
      row.march,
      row.april,
      row.may,
      row.june,
      row.july,
      row.august,
      row.september,
      row.october,
      row.november,
      row.december,
      row.total
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'occupation_rates.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortableHeader = (label: string, column: string) => (
    <div 
      className="flex items-center cursor-pointer"
      onClick={() => toggleSort(column)}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('occupation.rates')}</CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search.employees')}
              className="pl-8 w-[200px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            {t('export')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{renderSortableHeader(t('employee'), 'employee_name')}</TableHead>
                <TableHead>{renderSortableHeader('Jan', 'january')}</TableHead>
                <TableHead>{renderSortableHeader('Feb', 'february')}</TableHead>
                <TableHead>{renderSortableHeader('Mar', 'march')}</TableHead>
                <TableHead>{renderSortableHeader('Apr', 'april')}</TableHead>
                <TableHead>{renderSortableHeader('May', 'may')}</TableHead>
                <TableHead>{renderSortableHeader('Jun', 'june')}</TableHead>
                <TableHead>{renderSortableHeader('Jul', 'july')}</TableHead>
                <TableHead>{renderSortableHeader('Aug', 'august')}</TableHead>
                <TableHead>{renderSortableHeader('Sep', 'september')}</TableHead>
                <TableHead>{renderSortableHeader('Oct', 'october')}</TableHead>
                <TableHead>{renderSortableHeader('Nov', 'november')}</TableHead>
                <TableHead>{renderSortableHeader('Dec', 'december')}</TableHead>
                <TableHead className="text-right">{renderSortableHeader(t('total'), 'total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.employeeId}>
                  <TableCell className="font-medium">{row.employee_name}</TableCell>
                  <TableCell>{row.january}%</TableCell>
                  <TableCell>{row.february}%</TableCell>
                  <TableCell>{row.march}%</TableCell>
                  <TableCell>{row.april}%</TableCell>
                  <TableCell>{row.may}%</TableCell>
                  <TableCell>{row.june}%</TableCell>
                  <TableCell>{row.july}%</TableCell>
                  <TableCell>{row.august}%</TableCell>
                  <TableCell>{row.september}%</TableCell>
                  <TableCell>{row.october}%</TableCell>
                  <TableCell>{row.november}%</TableCell>
                  <TableCell>{row.december}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{row.total}%</span>
                      <Progress value={row.total} className="h-2 w-20" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={14} className="h-24 text-center">
                    {t('no.results')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const OccupancyTableWithData = () => {
  const { data: occupancyData, isLoading, isError } = useQuery({
    queryKey: ['occupancy-table'],
    queryFn: dashboardApi.getOccupancyRate
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !occupancyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Occupation Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Failed to load occupation data</p>
        </CardContent>
      </Card>
    );
  }

  return <OccupancyTable occupancyData={occupancyData} />;
};

export default OccupancyTableWithData;
