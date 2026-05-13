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
import { MOCK_AUTHORITIES, type Authority } from "@/lib/mock/authorities";

export default function AuthoritiesPage() {
  const [authorities, setAuthorities] = React.useState<Authority[]>(MOCK_AUTHORITIES);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Authority | null>(null);

  const filtered = authorities.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.abbreviation.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSave(data: Omit<Authority, "id" | "createdAt" | "serviceCount">) {
    if (editing) {
      setAuthorities((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a)),
      );
    } else {
      const newAuth: Authority = {
        ...data,
        id: `auth-${Date.now()}`,
        serviceCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setAuthorities((prev) => [...prev, newAuth]);
    }
    setEditing(null);
  }

  function handleDelete(id: string) {
    setAuthorities((prev) => prev.filter((a) => a.id !== id));
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
      {/* Page header */}
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

      {/* Table */}
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
                <TableHead className="hidden md:table-cell">Abbreviation</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="text-center">Services</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Building2 className="h-8 w-8" />
                      <p>No authorities found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((auth) => (
                  <TableRow key={auth.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{auth.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {auth.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="font-mono text-xs">
                        {auth.abbreviation}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {auth.floor}{auth.room ? ` • ${auth.room}` : ""}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {auth.serviceCount}
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
                ))
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
