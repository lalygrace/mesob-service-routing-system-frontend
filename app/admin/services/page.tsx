"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Layers,
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
import { servicesApi, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface Service {
  id: string;
  authorityId: string;
  categoryId: string | null;
  code: string;
  isActive: boolean;
  isPublished: boolean;
  floor: string | null;
  room: string | null;
  counter: string | null;
  processingTimeDays: number | null;
  feeAmount: number | null;
  feeDescription: string | null;
  priorityWeight: number;
  translations: {
    id: string;
    serviceId: string;
    language: string;
    name: string;
    shortDesc: string | null;
    fullDesc: string | null;
  }[];
  category: {
    id: string;
    slug: string;
  } | null;
  authority: {
    id: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);

  React.useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      const response = await servicesApi.list();
      setServices((response as any).data || []);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load services: ${error.message}`);
      } else {
        toast.error("Failed to load services");
      }
    } finally {
      setLoading(false);
    }
  }

  const filtered = services.filter((s) => {
    const enTranslation = s.translations.find(t => t.language === 'en') || s.translations[0];
    const name = enTranslation?.name || s.code;
    return name.toLowerCase().includes(search.toLowerCase()) ||
           s.code.toLowerCase().includes(search.toLowerCase()) ||
           s.authority.code.toLowerCase().includes(search.toLowerCase());
  });

  async function handleSave(data: any) {
    try {
      if (editing) {
        await servicesApi.update(editing.id, data);
        toast.success("Service updated successfully");
      } else {
        await servicesApi.create(data);
        toast.success("Service created successfully");
      }
      await loadServices();
      setEditing(null);
      setFormOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to save service: ${error.message}`);
      } else {
        toast.error("Failed to save service");
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      await servicesApi.delete(id);
      toast.success("Service deleted successfully");
      await loadServices();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to delete service: ${error.message}`);
      } else {
        toast.error("Failed to delete service");
      }
    }
  }

  function openEdit(service: Service) {
    setEditing(service);
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
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage the services offered to citizens at the Mesob Center
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">All Services</CardTitle>
              <CardDescription>{services.length} total</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
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
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">Authority</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell text-center">
                  Translations
                </TableHead>
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
                      <Layers className="h-8 w-8" />
                      <p>No services found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((svc) => {
                  const enTranslation = svc.translations.find(t => t.language === 'en') || svc.translations[0];
                  const name = enTranslation?.name || svc.code;
                  const shortDesc = enTranslation?.shortDesc || '';
                  return (
                    <TableRow key={svc.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            {shortDesc}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        <Badge variant="outline" className="font-mono text-xs">
                          {svc.authority.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {svc.floor || '-'} {svc.room ? `• ${svc.room}` : ''}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center">
                        <Badge variant="secondary" className="text-xs">
                          {svc.translations.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge
                            variant={svc.isActive ? "default" : "secondary"}
                            className={
                              svc.isActive
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {svc.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge
                            variant={svc.isPublished ? "default" : "secondary"}
                            className={
                              svc.isPublished
                                ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {svc.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
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
                              onClick={() => openEdit(svc)}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive"
                              onClick={() => handleDelete(svc.id)}
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
    </div>
  );
}
