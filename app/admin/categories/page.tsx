"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Folder,
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
import { CategoryForm } from "@/components/admin/category-form";
import { MOCK_CATEGORIES, type Category } from "@/lib/mock/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>(MOCK_CATEGORIES);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | null>(null);

  const filtered = categories.filter(
    (c) =>
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSave(data: Omit<Category, "id" | "createdAt" | "serviceCount">) {
    if (editing) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)),
      );
    } else {
      const newCategory: Category = {
        ...data,
        id: `cat-${Date.now()}`,
        serviceCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setEditing(null);
  }

  function handleDelete(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function openEdit(category: Category) {
    setEditing(category);
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
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage service categories for citizen navigation
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">All Categories</CardTitle>
              <CardDescription>{categories.length} total</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
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
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead className="text-center">Services</TableHead>
                <TableHead className="hidden lg:table-cell">Sort Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Folder className="h-8 w-8" />
                      <p>No categories found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {cat.iconName && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-sm">{cat.iconName}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{cat.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="font-mono text-xs">
                        {cat.slug}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {cat.serviceCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {cat.sortOrder}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={cat.isActive ? "default" : "secondary"}
                        className={
                          cat.isActive
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {cat.isActive ? "Active" : "Inactive"}
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
                            onClick={() => openEdit(cat)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive"
                            onClick={() => handleDelete(cat.id)}
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

      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSave={handleSave}
      />
    </div>
  );
}
