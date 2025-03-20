import React from 'react';
import { Card } from './ui/card';
import ReactMarkdown from 'react-markdown';
import { Chart } from './ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface ChartData {
  labels: string[];
  values: number[];
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title?: string;
  datasets: {
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    label?: string;
  }[];
}

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

interface MessageSection {
  type: 'text' | 'chart' | 'table';
  content: string | ChartData | TableData;
  title?: string;
}

interface StructuredMessage {
  title?: string;
  sections: MessageSection[];
}

interface ChatMessageProps {
  message: {
    text: string;
    isUser: boolean;
    structured?: StructuredMessage;
  };
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping }) => {
  const { text, isUser, structured } = message;

  const renderChart = (chartData: ChartData) => {
    return (
      <div className="my-4">
        {chartData.title && (
          <h4 className="text-lg font-semibold mb-2">{chartData.title}</h4>
        )}
        <div className="w-full max-w-2xl h-[300px]">
          <Chart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets
            }}
            type={chartData.type}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom' as const
                }
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderTable = (tableData: TableData) => {
    return (
      <div className="my-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {tableData.headers.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderSection = (section: MessageSection) => {
    switch (section.type) {
      case 'chart':
        return renderChart(section.content as ChartData);
      case 'table':
        return renderTable(section.content as TableData);
      case 'text':
        return (
          <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert">
            <ReactMarkdown>{section.content as string}</ReactMarkdown>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`p-4 ${isUser ? 'bg-primary/10' : 'bg-card'}`}>
      <div className="flex items-start gap-4">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          {isUser ? '👤' : '🤖'}
        </div>
        <div className="flex-1">
          {isTyping ? (
            <div className="animate-pulse">Typing...</div>
          ) : structured ? (
            <div className="space-y-4">
              {structured.title && (
                <h3 className="text-xl font-bold">{structured.title}</h3>
              )}
              {structured.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  {section.title && (
                    <h4 className="text-lg font-semibold">{section.title}</h4>
                  )}
                  {renderSection(section)}
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatMessage;

