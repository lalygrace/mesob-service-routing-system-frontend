"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Building2,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthorityForm } from "@/components/admin/authority-form";
import { authoritiesApi, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface Authority {
  id: string;
  code: string;
  isActive: boolean;
  floor: string | null;
  wing: string | null;
  logoUrl: string | null;
  translations: {
    id: string;
    authorityId: string;
    language: string;
    name: string;
    description: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function AuthoritiesPage() {
  const [authorities, setAuthorities] = React.useState<Authority[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Authority | null>(null);

  React.useEffect(() => {
    loadAuthorities();
  }, []);

  async function loadAuthorities() {
    try {
      setLoading(true);
      const response = await authoritiesApi.list();
      setAuthorities((response as any).data || []);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load authorities: ${error.message}`);
      } else {
        toast.error("Failed to load authorities");
      }
    } finally {
      setLoading(false);
    }
  }

  const filtered = authorities.filter(
    (a) => {
      const enTranslation = a.translations.find(t => t.language === 'en') || a.translations[0];
      const name = enTranslation?.name || a.code;
      return name.toLowerCase().includes(search.toLowerCase()) ||
             a.code.toLowerCase().includes(search.toLowerCase());
    },
  );

  async function handleSave(data: any) {
    try {
      if (editing) {
        await authoritiesApi.update(editing.id, data);
        toast.success("Authority updated successfully");
      } else {
        await authoritiesApi.create(data);
        toast.success("Authority created successfully");
      }
      await loadAuthorities();
      setEditing(null);
      setFormOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to save authority: ${error.message}`);
      } else {
        toast.error("Failed to save authority");
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      await authoritiesApi.delete(id);
      toast.success("Authority deleted successfully");
      await loadAuthorities();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to delete authority: ${error.message}`);
      } else {
        toast.error("Failed to delete authority");
      }
    }
  }

  function openEdit(authority: Authority) {
    setEditing(authority);
    setFormOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Authorities</h1>
          <p className="text-muted-foreground">
            Manage government authorities registered in the Mesob Center
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Authority
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">All Authorities</CardTitle>
              <CardDescription>{authorities.length} total</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search authorities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Authority</TableHead>
                <TableHead className="hidden md:table-cell">Code</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="text-center">Translations</TableHead>
                <TableHead>Status</TableHead>
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
                      <Building2 className="h-8 w-8" />
                      <p>No authorities found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((auth) => {
                  const enTranslation = auth.translations.find(t => t.language === 'en') || auth.translations[0];
                  const name = enTranslation?.name || auth.code;
                  const description = enTranslation?.description || '';
                  return (
                    <TableRow key={auth.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="font-mono text-xs">
                          {auth.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {auth.floor || '-'} {auth.wing ? `• ${auth.wing}` : ''}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {auth.translations.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={auth.isActive ? "default" : "secondary"}
                          className={
                            auth.isActive
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {auth.isActive ? "Active" : "Inactive"}
                        </Badge>
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
                              onClick={() => openEdit(auth)}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive"
                              onClick={() => handleDelete(auth.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AuthorityForm
        open={formOpen}
        onOpenChange={setFormOpen}
        authority={editing}
        onSave={handleSave}
      />
    </div>
  );
}
