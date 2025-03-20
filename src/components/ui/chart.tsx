import { useEffect, useRef, forwardRef } from 'react';
import React from 'react';
import { Chart } from 'chart.js/auto';
import type { ChartType, ChartOptions, ChartData } from 'chart.js';

interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
    theme?: {
      dark?: string;
      light?: string;
    };
  };
}

const ChartContext = React.createContext<ChartConfig | null>(null);
const useChart = () => {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
};

const ChartContainer = forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { 
  config: ChartConfig; 
  children: React.ReactNode 
}>((props, ref) => {
  const { id, className, children, config, ...rest } = props;
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={config}>
      <div
        ref={ref}
        className={className}
        data-chart={chartId}
        {...rest}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
});

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, item]) => item.color || item.theme);

  if (!colorConfig.length) {
    return null;
  }

  const themeCSS = `
    :root {
      ${colorConfig
        .map(([key, item]) => {
          const color = item.theme?.light || item.color || "";
          return `--color-${key}: ${color};`;
        })
        .join("\n")}
    }
  `;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: themeCSS,
      }}
    />
  );
};

const CustomChart = ({ 
  type, 
  options, 
  data 
}: { 
  type: ChartType; 
  options: ChartOptions; 
  data: ChartData 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart>();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        // Destroy previous instance
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type,
          data,
          options,
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={chartRef} className="w-full h-full" />;
};

// Proper named export for Chart component
export { CustomChart as Chart, ChartContainer };
