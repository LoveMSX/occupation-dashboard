import React from 'react';
import { cn } from '@/lib/utils'; // Add utility class for styling
import { Card, CardContent, CardHeader } from './ui/card'; // Import additional card components
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Add support for GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw'; // Allow raw HTML in markdown
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button'; // Import button for table actions
import { LineChart, BarChart, PieChart } from '@/components/ui/charts';
import { Tooltip } from './ui/tooltip'; // Import tooltip for charts
// Define CodeProps manually
import { DetailedHTMLProps, HTMLAttributes } from 'react';

interface CodeProps extends React.ClassAttributes<HTMLElement>, React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const getCodeBlockStyle = (content: TextContent): string => {
  return content.codeBlockStyle || 'bg-muted p-4 rounded-lg';
};

const codeComponent: Components['code'] = ({ node, inline = false, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || '');
  
  if (!inline && match) {
    return (
      <pre className={cn('rounded-lg bg-muted p-4', getCodeBlockStyle({ text: '', codeBlockStyle: '' }))}>
        <code className={cn('language-', match[1])} {...props}>
          {children}
        </code>
      </pre>
    );
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  labels: string[];
  values: number[];
  options?: any; // Add options for chart customization
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
  actions?: { label: string; onClick: () => void }[]; // Add actions for table rows
}

interface TextContent {
  text: string;
  codeBlockStyle?: string; // Add style for code blocks
}

interface Section {
  type: 'text' | 'chart' | 'table';
  title?: string;
  content: string | TextContent | ChartData | TableData;
  className?: string; // Add className for custom styling
}

interface StructuredMessageProps {
  isUser: boolean;
  title?: string;
  sections: Section[];
  className?: string; // Add className prop
}

const StructuredMessage: React.FC<StructuredMessageProps> = ({
  isUser,
  title,
  sections,
  className
}) => {
  const getTextContent = (content: string | TextContent): string => {
    if (typeof content === 'string') {
      return content;
    }
    return content.text;
  };

  const renderChart = (data: ChartData) => {
    switch (data.type) {
      case 'line':
      case 'bar':
      case 'pie':
        return (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-center">Chart type not supported</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTable = (data: TableData) => (
    <Table>
      <TableHeader>
        <TableRow>
          {data.headers.map((header, i) => (
            <TableHead key={i}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={j}>{String(cell)}</TableCell>
            ))}
            {data.actions && (
              <TableCell>
                {data.actions.map((action, idx) => (
                  <Button key={idx} onClick={action.onClick} variant="ghost">
                    {action.label}
                  </Button>
                ))}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderContent = (section: Section) => {
    switch (section.type) {
      case 'text': {
        const textContent = getTextContent(section.content as (string | TextContent));
        return (
          <div className="prose dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code: codeComponent
              }}
            >
              {textContent}
            </ReactMarkdown>
          </div>
        );
      }
      case 'chart':
        return renderChart(section.content as ChartData);
      case 'table':
        return renderTable(section.content as TableData);
      default:
        return null;
    }
  };

  return (
    <Card className={cn(`p-4 ${isUser ? 'bg-primary/10' : 'bg-card'}`, className)}>
      <CardHeader className="flex gap-4">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          {isUser ? '👤' : '🤖'}
        </div>
        <div className="flex-1">
          {title && (
            <h2 className="text-xl font-bold mb-4">{title}</h2>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            {section.title && (
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            )}
            <div className={cn('rounded-lg bg-card p-4', section.className)}>
              {renderContent(section)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StructuredMessage;
