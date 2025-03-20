
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  percentageChange?: number;
  icon: LucideIcon;
  description?: string;
  variant?: "primary" | "info" | "success" | "warning" | "danger";
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  percentageChange,
  icon: Icon,
  description,
  variant = "primary",
  loading = false
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">{title}</CardTitle>
          <div className={cn("p-2 rounded-full", variants[variant])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? (
                <div className="h-8 w-24 animate-pulse bg-muted rounded" />
              ) : (
                value
              )}
            </div>
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
                  {isPositiveChange ? "+" : ""}
                  {percentageChange}%
                </span>
                {description && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
          {!loading && value === "0" && (
            <div className="text-muted-foreground/50">
              <Icon className="h-12 w-12 opacity-20" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
