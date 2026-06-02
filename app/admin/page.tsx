"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Layers, Users, Star, HelpCircle } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { StatCard } from "@/components/admin/stat-card";
import {
  getAnalyticsSummary,
  listAnalyticsSnapshots,
  type AnalyticsSnapshot,
  type AnalyticsSummary,
} from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";

// ── Chart configs ────────────────────────────────────────────────────

const usageChartConfig = {
  sessions: { label: "Sessions", color: "oklch(0.58 0.2 268)" },
  resolved: { label: "Resolved", color: "oklch(0.72 0.17 152)" },
} satisfies ChartConfig;

const ratingsChartConfig = {
  count: { label: "Ratings", color: "oklch(0.58 0.2 268)" },
} satisfies ChartConfig;

const topServicesConfig = {
  requests: { label: "Requests", color: "oklch(0.58 0.2 268)" },
} satisfies ChartConfig;

// ── Page ─────────────────────────────────────────────────────────────

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return dateKey(date);
}

function toUsagePoint(snapshot: AnalyticsSnapshot) {
  return {
    date: snapshot.date.slice(0, 10),
    sessions: snapshot.totalSessions,
    resolved: snapshot.completedSessions,
  };
}

function toTopServiceRows(snapshot: AnalyticsSnapshot | null) {
  return (snapshot?.topServices ?? []).slice(0, 5).map((service) => ({
    serviceName: service.name,
    requests: service.count,
  }));
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    queueMicrotask(() => {
      Promise.all([
        getAnalyticsSummary(),
        listAnalyticsSnapshots({
          granularity: "DAILY",
          from: daysAgo(30),
          to: dateKey(new Date()),
        }),
      ])
        .then(([summaryData, snapshotData]) => {
          if (!mounted) return;
          setSummary(summaryData);
          setSnapshots(snapshotData);
        })
        .catch((error) => {
          toast.error(
            getApiErrorMessage(error, "Failed to load dashboard analytics"),
          );
        })
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const usageData = useMemo(() => snapshots.map(toUsagePoint), [snapshots]);
  const latestSnapshot = snapshots.at(-1) ?? summary?.latestSnapshot ?? null;
  const topServices = toTopServiceRows(latestSnapshot);
  const ratingDistribution = [
    { rating: "Helpful", count: latestSnapshot?.helpfulCount ?? 0 },
    { rating: "Not helpful", count: latestSnapshot?.unhelpfulCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Mesob Service Routing System
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Services"
          value={isLoading ? "..." : (summary?.totalServices ?? 0)}
          icon={Layers}
          trendLabel="live data"
        />
        <StatCard
          title="Organizations"
          value={isLoading ? "..." : (summary?.totalOrganizations ?? 0)}
          icon={Building2}
          trendLabel="live data"
        />
        <StatCard
          title="Customers Served Today"
          value={
            isLoading
              ? "..."
              : (latestSnapshot?.totalSessions ?? summary?.totalSessions ?? 0)
          }
          icon={Users}
          trendLabel="latest snapshot"
        />
        <StatCard
          title="Avg. Satisfaction"
          value={`${(latestSnapshot?.avgRating ?? summary?.avgRating ?? 0).toFixed(1)}/5`}
          icon={Star}
          trendLabel="live data"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Usage Over Time — takes 4/7 */}
        <Card className="lg:col-span-4 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Sessions Over Time</CardTitle>
            <CardDescription>
              Daily sessions for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={usageChartConfig}
              className="h-[260px] w-full"
            >
              <AreaChart
                data={usageData}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
              >
                <defs>
                  <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-sessions)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-sessions)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-resolved)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-resolved)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="resolved"
                  type="monotone"
                  fill="url(#fillResolved)"
                  stroke="var(--color-resolved)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="sessions"
                  type="monotone"
                  fill="url(#fillSessions)"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Ratings Distribution — takes 3/7 */}
        <Card className="lg:col-span-3 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">User Ratings</CardTitle>
            <CardDescription>Satisfaction score distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={ratingsChartConfig}
              className="h-[260px] w-full"
            >
              <BarChart
                data={ratingDistribution}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="rating"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: number) => `${v}★`}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Top Services — 4/7 */}
        <Card className="lg:col-span-4 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Requested Services</CardTitle>
            <CardDescription>Most frequently accessed services</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={topServicesConfig}
              className="h-[240px] w-full"
            >
              <BarChart
                data={topServices}
                layout="vertical"
                margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="serviceName"
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="requests"
                  fill="var(--color-requests)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity — 3/7 */}
        <Card className="lg:col-span-3 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest citizen interactions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {(latestSnapshot?.topUnclearInputs ?? [])
                .slice(0, 6)
                .map((input, index) => (
                  <div
                    key={`${input}-${index}`}
                    className="flex items-start gap-3 px-6 py-3"
                  >
                    <div className="mt-0.5">
                      <HelpCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{input}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          low confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              {(latestSnapshot?.topUnclearInputs ?? []).length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No unclear interactions in the latest snapshot.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
