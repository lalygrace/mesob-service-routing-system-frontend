"use client";

import * as React from "react";
import {
  Building2,
  Layers,
  Users,
  Star,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { StatCard } from "@/components/admin/stat-card";
import { analyticsApi, servicesApi, authoritiesApi, ApiError } from "@/lib/api-client";
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

export default function AdminDashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [kpis, setKpis] = React.useState<any>(null);
  const [dailyUsage, setDailyUsage] = React.useState<any[]>([]);
  const [servicePopularity, setServicePopularity] = React.useState<any[]>([]);
  const [ratingDistribution, setRatingDistribution] = React.useState<any[]>([]);
  const [recentSessions, setRecentSessions] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [dailyData, servicesData, interactionsData, servicesList, authoritiesList] = await Promise.all([
        analyticsApi.getDailyUsage(30),
        analyticsApi.getTopServices(5),
        analyticsApi.getRecentInteractions(6),
        servicesApi.list(),
        authoritiesApi.list(),
      ]);

      setDailyUsage(dailyData);
      setServicePopularity(servicesData);
      setRecentSessions(interactionsData);

      // Calculate KPIs
      const totalServices = servicesList.length;
      const totalAuthorities = authoritiesList.length;
      const todaySessions = dailyData.length > 0 ? dailyData[dailyData.length - 1].sessions : 0;
      const totalSessions = dailyData.reduce((sum: number, d: any) => sum + d.sessions, 0);
      const resolved = dailyData.reduce((sum: number, d: any) => sum + (d.resolved || 0), 0);
      const avgSatisfaction = totalSessions > 0 ? 4.2 : 0; // Would come from backend

      setKpis({
        totalServices,
        totalAuthorities,
        todaySessions,
        avgSatisfaction,
        serviceTrend: 12.5,
        authoritiesTrend: 5.3,
        sessionsTrend: 8.7,
        satisfactionTrend: 5.3,
      });

      // Mock rating distribution (would come from backend)
      setRatingDistribution([
        { rating: 1, count: 5 },
        { rating: 2, count: 8 },
        { rating: 3, count: 12 },
        { rating: 4, count: 25 },
        { rating: 5, count: 50 },
      ]);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load dashboard data: ${error.message}`);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }

  const last7 = dailyUsage.slice(-7);
  const topServices = servicePopularity.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your Mesob Service Routing System
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

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
          value={kpis?.totalServices || 0}
          icon={Layers}
          trend={kpis?.serviceTrend || 0}
          trendLabel="vs last month"
        />
        <StatCard
          title="Authorities"
          value={kpis?.totalAuthorities || 0}
          icon={Building2}
          trend={kpis?.authoritiesTrend || 0}
          trendLabel="vs last month"
        />
        <StatCard
          title="Today's Sessions"
          value={kpis?.todaySessions || 0}
          icon={Users}
          trend={kpis?.sessionsTrend || 0}
          trendLabel="vs yesterday"
        />
        <StatCard
          title="Avg. Satisfaction"
          value={`${kpis?.avgSatisfaction || 0}/5`}
          icon={Star}
          trend={kpis?.satisfactionTrend || 0}
          trendLabel="vs last week"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Usage Over Time — takes 4/7 */}
        <Card className="lg:col-span-4 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Sessions Over Time</CardTitle>
            <CardDescription>Daily sessions for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={usageChartConfig} className="h-[260px] w-full">
              <AreaChart data={dailyUsage} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0} />
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
            <ChartContainer config={ratingsChartConfig} className="h-[260px] w-full">
              <BarChart data={ratingDistribution} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
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
                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
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
            <ChartContainer config={topServicesConfig} className="h-[240px] w-full">
              <BarChart
                data={topServices}
                layout="vertical"
                margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  type="category"
                  dataKey="serviceName"
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="requests" fill="var(--color-requests)" radius={[0, 6, 6, 0]} />
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
              {recentSessions.slice(0, 6).map((session: any) => (
                <div key={session.id} className="flex items-start gap-3 px-6 py-3">
                  <div className="mt-0.5">
                    {session.result === "resolved" && (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                    {session.result === "clarified" && (
                      <HelpCircle className="h-4 w-4 text-amber-500" />
                    )}
                    {session.result === "failed" && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.query}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {session.language.toUpperCase()}
                      </Badge>
                      {session.service && (
                        <span className="text-xs text-muted-foreground truncate">
                          → {session.service}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {session.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
