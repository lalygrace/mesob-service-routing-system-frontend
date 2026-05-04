import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number; // percentage change, positive = up
  trendLabel?: string;
  className?: string;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: StatCardProps) {
  const TrendIcon =
    trend === undefined || trend === 0
      ? Minus
      : trend > 0
        ? TrendingUp
        : TrendingDown;
  const trendColor =
    trend === undefined || trend === 0
      ? "text-muted-foreground"
      : trend > 0
        ? "text-emerald-500"
        : "text-red-500";

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:shadow-md hover:border-border",
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-4xl font-digital tracking-wider text-primary">{value}</p>
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
                <TrendIcon className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
                {trendLabel && (
                  <span className="text-muted-foreground">{trendLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </CardContent>
    </Card>
  );
}
