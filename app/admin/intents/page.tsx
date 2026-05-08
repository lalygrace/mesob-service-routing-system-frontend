"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  MessageSquare,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IntentForm } from "@/components/admin/intent-form";
import { servicesApi, intentMappingsApi, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { LANGUAGE_LABELS, type IntentMapping } from "@/lib/mock/intents";

const LANG_COLORS: Record<string, string> = {
  en: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  am: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  om: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export default function IntentsPage() {
  const [intents, setIntents] = React.useState<IntentMapping[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [langFilter, setLangFilter] = React.useState<string>("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<IntentMapping | null>(null);

  React.useEffect(() => {
    loadIntents();
  }, []);

  async function loadIntents() {
    try {
      setLoading(true);
      const data = await intentMappingsApi.list();
      setIntents(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load intent mappings: ${error.message}`);
      } else {
        toast.error("Failed to load intent mappings");
      }
    } finally {
      setLoading(false);
    }
  }

  const filtered = intents.filter((intent) => {
    const matchesSearch =
      intent.phrase.toLowerCase().includes(search.toLowerCase()) ||
      intent.mappedServiceNames.some((n) =>
        n.toLowerCase().includes(search.toLowerCase()),
      );
    const matchesLang = langFilter === "all" || intent.language === langFilter;
    return matchesSearch && matchesLang;
  });

  async function handleSave(
    data: Omit<IntentMapping, "id" | "createdAt" | "usageCount">,
  ) {
    try {
      if (editing) {
        await intentMappingsApi.update(editing.id, data);
        toast.success("Intent mapping updated successfully");
      } else {
        await intentMappingsApi.create(data);
        toast.success("Intent mapping created successfully");
      }
      await loadIntents();
      setEditing(null);
      setFormOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to save intent mapping: ${error.message}`);
      } else {
        toast.error("Failed to save intent mapping");
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      await intentMappingsApi.delete(id);
      toast.success("Intent mapping deleted successfully");
      await loadIntents();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to delete intent mapping: ${error.message}`);
      } else {
        toast.error("Failed to delete intent mapping");
      }
    }
  }

  function openEdit(intent: IntentMapping) {
    setEditing(intent);
    setFormOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Intent Mapping</h1>
          <p className="text-muted-foreground">
            Map common citizen phrases to services for better AI matching
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Phrase
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">All Intent Mappings</CardTitle>
              <CardDescription>{intents.length} phrases mapped</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={langFilter} onValueChange={setLangFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="am">Amharic</SelectItem>
                  <SelectItem value="om">Afaan Oromo</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search phrases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phrase</TableHead>
                <TableHead>Language</TableHead>
                <TableHead className="hidden md:table-cell">Mapped Service(s)</TableHead>
                <TableHead className="hidden lg:table-cell text-center">Confidence</TableHead>
                <TableHead className="hidden lg:table-cell text-center">Usage</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="text-muted-foreground">Loading...</div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-8 w-8" />
                      <p>No intent mappings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((intent) => (
                  <TableRow key={intent.id}>
                    <TableCell>
                      <p className="font-medium">{intent.phrase}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={LANG_COLORS[intent.language] ?? ""}
                      >
                        {LANGUAGE_LABELS[intent.language] ?? intent.language}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {intent.mappedServiceNames.map((name) => (
                          <Badge
                            key={name}
                            variant="secondary"
                            className="text-xs"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Badge
                        variant="outline"
                        className={
                          intent.confidence >= 90
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : intent.confidence >= 80
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                        }
                      >
                        {intent.confidence}%
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center text-sm text-muted-foreground">
                      {intent.usageCount}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => openEdit(intent)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive"
                            onClick={() => handleDelete(intent.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <IntentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        intent={editing}
        onSave={handleSave}
      />
    </div>
  );
}
