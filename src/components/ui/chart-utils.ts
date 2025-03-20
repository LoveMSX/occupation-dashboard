import React from 'react';

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

export const useChart = () => {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
};

export { ChartContext };
export type { ChartConfig };