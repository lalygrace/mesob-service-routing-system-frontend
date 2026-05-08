"use client";

import * as React from "react";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_AUDIT_LOGS, type AuditLog } from "@/lib/mock/audit-logs";

const ENTITY_TYPES = [
  "Service",
  "Authority",
  "Category",
  "IntentMapping",
  "ServiceRequirement",
  "ServiceStep",
  "User",
  "SystemConfig",
];

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  UPDATE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-600 border-red-500/20",
  PUBLISH: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  UNPUBLISH: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = React.useState("");
  const [entityFilter, setEntityFilter] = React.useState<string>("all");
  const [actionFilter, setActionFilter] = React.useState<string>("all");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase());
    
    const matchesEntity = entityFilter === "all" || log.entityType === entityFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;

    return matchesSearch && matchesEntity && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all admin actions for accountability (SUPER_ADMIN only)
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Filter Logs</CardTitle>
              <CardDescription>{logs.length} total entries</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {ENTITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead className="hidden md:table-cell">Entity ID</TableHead>
                <TableHead className="hidden lg:table-cell">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Filter className="h-8 w-8" />
                      <p>No audit logs found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.userName}</p>
                        <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground"}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {log.entityType}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {log.entityId}
                      </code>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {log.ipAddress}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
