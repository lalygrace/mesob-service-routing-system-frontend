"use client";

import * as React from "react";
import {
  Users,
  Clock,
  HelpCircle,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { StatCard } from "@/components/admin/stat-card";
import {
  MOCK_DAILY_USAGE,
  MOCK_KPIS,
  MOCK_SERVICE_POPULARITY,
  MOCK_LANGUAGE_USAGE,
  MOCK_HOURLY_USAGE,
  MOCK_RECENT_SESSIONS,
} from "@/lib/mock/analytics";

// ── Chart configs ────────────────────────────────────────────────────

const sessionsConfig = {
  sessions: { label: "Total", color: "oklch(0.58 0.2 268)" },
  resolved: { label: "Resolved", color: "oklch(0.72 0.17 152)" },
  clarifications: { label: "Clarified", color: "oklch(0.75 0.15 60)" },
} satisfies ChartConfig;

const languageConfig = {
  am: { label: "Amharic", color: "oklch(0.58 0.2 268)" },
  en: { label: "English", color: "oklch(0.72 0.17 152)" },
  om: { label: "Afaan Oromo", color: "oklch(0.75 0.15 60)" },
} satisfies ChartConfig;

const serviceConfig = {
  requests: { label: "Requests", color: "oklch(0.58 0.2 268)" },
} satisfies ChartConfig;

const hourlyConfig = {
  sessions: { label: "Sessions", color: "oklch(0.58 0.2 268)" },
} satisfies ChartConfig;

const PIE_COLORS = [
  "oklch(0.58 0.2 268)",
  "oklch(0.72 0.17 152)",
  "oklch(0.75 0.15 60)",
];

// ── Page ─────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = React.useState("30d");

  const rangeData = React.useMemo(() => {
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    return MOCK_DAILY_USAGE.slice(-Math.min(days, MOCK_DAILY_USAGE.length));
  }, [range]);

  const languagePieData = MOCK_LANGUAGE_USAGE.map((l) => ({
    name: l.language,
    value: l.sessions,
    code: l.code,
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor usage patterns, satisfaction, and system performance
          </p>
        </div>
        <Tabs value={range} onValueChange={setRange}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sessions"
          value={MOCK_KPIS.totalSessions.toLocaleString()}
          icon={Users}
          trend={MOCK_KPIS.sessionsTrend}
          trendLabel="vs prior period"
        />
        <StatCard
          title="Avg. Resolution Time"
          value={`${MOCK_KPIS.avgResolutionTimeSec}s`}
          icon={Clock}
          trend={-5.3}
          trendLabel="faster"
        />
        <StatCard
          title="Clarification Rate"
          value={`${MOCK_KPIS.clarificationRate}%`}
          icon={HelpCircle}
          trend={-2.1}
          trendLabel="improvement"
        />
        <StatCard
          title="Satisfaction Score"
          value={`${MOCK_KPIS.avgSatisfaction}/5`}
          icon={Star}
          trend={MOCK_KPIS.satisfactionTrend}
          trendLabel="vs prior period"
        />
      </div>

      {/* Sessions Chart + Language Pie */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-5 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Sessions Over Time</CardTitle>
            <CardDescription>
              Breakdown of resolved vs. clarification interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sessionsConfig} className="h-[300px] w-full">
              <AreaChart data={rangeData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="aFillSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aFillResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.25} />
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
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="resolved"
                  type="monotone"
                  fill="url(#aFillResolved)"
                  stroke="var(--color-resolved)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="sessions"
                  type="monotone"
                  fill="url(#aFillSessions)"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Language Distribution</CardTitle>
            <CardDescription>Sessions by preferred language</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={languageConfig} className="h-[260px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={languagePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  {languagePieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Services + Peak Hours */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Top 8 Services</CardTitle>
            <CardDescription>Most requested by citizens</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={serviceConfig} className="h-[300px] w-full">
              <BarChart
                data={MOCK_SERVICE_POPULARITY}
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

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Peak Usage Hours</CardTitle>
            <CardDescription>When citizens visit the kiosk most</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hourlyConfig} className="h-[300px] w-full">
              <BarChart data={MOCK_HOURLY_USAGE} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Failed / Unclear Sessions Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Interactions Log</CardTitle>
          <CardDescription>
            Track resolved, clarified, and failed sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Query</TableHead>
                <TableHead>Language</TableHead>
                <TableHead className="hidden md:table-cell">Routed To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RECENT_SESSIONS.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    {session.result === "resolved" && (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                    {session.result === "clarified" && (
                      <HelpCircle className="h-4 w-4 text-amber-500" />
                    )}
                    {session.result === "failed" && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{session.query}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {session.language.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {session.service ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        session.result === "resolved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : session.result === "clarified"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                      }
                    >
                      {session.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {session.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
