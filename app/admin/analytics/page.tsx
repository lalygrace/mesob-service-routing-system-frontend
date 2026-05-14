"use client";

import * as React from "react";
import { Users, Clock, HelpCircle, Star } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  getAnalyticsSummary,
  listAnalyticsSnapshots,
  type AnalyticsSnapshot,
  type AnalyticsSummary,
} from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";

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

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return dateKey(date);
}

function toDailyUsage(snapshot: AnalyticsSnapshot) {
  return {
    date: snapshot.date.slice(0, 10),
    sessions: snapshot.totalSessions,
    resolved: snapshot.completedSessions,
    clarifications:
      snapshot.mediumConfidenceCount + snapshot.lowConfidenceCount,
  };
}

export default function AnalyticsPage() {
  const [range, setRange] = React.useState("30d");
  const [summary, setSummary] = React.useState<AnalyticsSummary | null>(null);
  const [snapshots, setSnapshots] = React.useState<AnalyticsSnapshot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;

    queueMicrotask(() => {
      Promise.all([
        getAnalyticsSummary(),
        listAnalyticsSnapshots({
          granularity: "DAILY",
          from: daysAgo(days),
          to: dateKey(new Date()),
        }),
      ])
        .then(([summaryData, snapshotData]) => {
          if (!mounted) return;
          setSummary(summaryData);
          setSnapshots(snapshotData);
        })
        .catch((error) => {
          toast.error(getApiErrorMessage(error, "Failed to load analytics"));
        })
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    });

    return () => {
      mounted = false;
    };
  }, [range]);

  const rangeData = React.useMemo(
    () => snapshots.map(toDailyUsage),
    [snapshots],
  );
  const latestSnapshot = snapshots.at(-1) ?? summary?.latestSnapshot ?? null;

  const languagePieData = [
    {
      name: "Amharic",
      value: latestSnapshot?.sessionsAmharic ?? 0,
      code: "am",
    },
    {
      name: "English",
      value: latestSnapshot?.sessionsEnglish ?? 0,
      code: "en",
    },
    {
      name: "Afaan Oromo",
      value: latestSnapshot?.sessionsAfaanOromo ?? 0,
      code: "om",
    },
  ];

  const topServices = (latestSnapshot?.topServices ?? []).map((service) => ({
    serviceName: service.name,
    requests: service.count,
  }));

  const hourlyUsage = Array.from({ length: 8 }).map((_, index) => ({
    hour: `${8 + index}:00`,
    sessions: 0,
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
          value={
            isLoading ? "..." : (summary?.totalSessions ?? 0).toLocaleString()
          }
          icon={Users}
          trendLabel="live data"
        />
        <StatCard
          title="Avg. Resolution Time"
          value={`${latestSnapshot?.completedSessions ?? 0}`}
          icon={Clock}
          trendLabel="completed sessions"
        />
        <StatCard
          title="Clarification Rate"
          value={`${latestSnapshot?.lowConfidenceCount ?? 0}`}
          icon={HelpCircle}
          trendLabel="low confidence"
        />
        <StatCard
          title="Satisfaction Score"
          value={`${(latestSnapshot?.avgRating ?? summary?.avgRating ?? 0).toFixed(1)}/5`}
          icon={Star}
          trendLabel="live data"
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
            <ChartContainer
              config={sessionsConfig}
              className="h-[300px] w-full"
            >
              <AreaChart
                data={rangeData}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
              >
                <defs>
                  <linearGradient
                    id="aFillSessions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-sessions)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-sessions)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="aFillResolved"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-resolved)"
                      stopOpacity={0.25}
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
            <ChartContainer
              config={languageConfig}
              className="h-[260px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" />}
                />
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

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Peak Usage Hours</CardTitle>
            <CardDescription>
              When citizens visit the kiosk most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hourlyConfig} className="h-[300px] w-full">
              <BarChart
                data={hourlyUsage}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
              >
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
                <Bar
                  dataKey="sessions"
                  fill="var(--color-sessions)"
                  radius={[6, 6, 0, 0]}
                />
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
                <TableHead className="hidden md:table-cell">
                  Routed To
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(latestSnapshot?.topUnclearInputs ?? []).map((query, index) => (
                <TableRow key={`${query}-${index}`}>
                  <TableCell>
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                  </TableCell>
                  <TableCell className="font-medium">{query}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      —
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    —
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 border-amber-500/20"
                    >
                      low confidence
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    latest snapshot
                  </TableCell>
                </TableRow>
              ))}
              {(latestSnapshot?.topUnclearInputs ?? []).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No unclear interactions in the selected range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
