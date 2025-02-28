
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  percentageChange?: number;
  icon: React.ReactNode;
  description?: string;
  variant?: "primary" | "info" | "success" | "warning" | "danger";
}

export function StatCard({
  title,
  value,
  percentageChange,
  icon,
  description,
  variant = "primary"
}: StatCardProps) {
  const isPositiveChange = percentageChange && percentageChange > 0;
  const isNegativeChange = percentageChange && percentageChange < 0;
  
  const variants = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            {percentageChange !== undefined && (
              <div className="flex items-center mt-1">
                {isPositiveChange ? (
                  <ArrowUp className="mr-1 h-4 w-4 text-success" />
                ) : isNegativeChange ? (
                  <ArrowDown className="mr-1 h-4 w-4 text-danger" />
                ) : null}
                <span
                  className={cn(
                    "text-sm font-medium",
                    isPositiveChange && "text-success",
                    isNegativeChange && "text-danger"
                  )}
                >
                  {Math.abs(percentageChange).toFixed(2)}%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  from last month
                </span>
              </div>
            )}
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn("rounded-full p-3", variants[variant])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
