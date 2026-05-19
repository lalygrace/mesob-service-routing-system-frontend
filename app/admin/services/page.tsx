"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Layers,
  RefreshCw,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceForm } from "@/components/admin/service-form";
import type { Service } from "@/lib/service-navigator/types";
import {
  listAdminOrganizations,
  type Organization,
} from "@/lib/api/organizations";
import {
  createAdminService,
  deleteAdminService,
  listAdminServices,
  updateAdminService,
  syncServicesFromCms,
} from "@/lib/api/services";
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";

export default function ServicesPage() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [serviceData, organizationData] = await Promise.all([
          listAdminServices(),
          listAdminOrganizations(),
        ]);

        if (!mounted) return;
        setServices(serviceData);
        setOrganizations(organizationData);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load services"));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = services.filter((s) => {
    return (
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.organization.toLowerCase().includes(search.toLowerCase())
    );
  });

  async function handleSave(data: Omit<Service, "id">) {
    try {
      if (editing) {
        const updated = await updateAdminService(editing.id, data);
        setServices((prev) =>
          prev.map((s) => (s.id === editing.id ? updated : s)),
        );
        toast.success("Service updated successfully");
      } else {
        const created = await createAdminService(data);
        setServices((prev) => [created, ...prev]);
        toast.success("Service created successfully");
      }
      setEditing(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save service"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdminService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete service"));
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

  async function handleSyncFromCms() {
    setIsSyncing(true);
    try {
      const result = await syncServicesFromCms();

      // Reload services after sync
      const serviceData = await listAdminServices();
      setServices(serviceData);

      const message = `Sync complete: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped`;

      if (result.errors.length > 0) {
        toast.warning(message, {
          description: `${result.errors.length} errors occurred. Check console for details.`,
        });
        console.error("Sync errors:", result.errors);
      } else {
        toast.success(message);
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to sync services from CMS"),
      );
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage the services offered to citizens at the Mesob Center
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSyncFromCms}
            variant="outline"
            className="gap-2"
            disabled={isSyncing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing..." : "Sync from Mesob Center"}
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Table */}
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
                <TableHead className="hidden md:table-cell">
                  Organization
                </TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell text-center">
                  Requirements
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Loading services...
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
                filtered.map((svc) => (
                  <TableRow key={svc.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{svc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {svc.feeHint} • {svc.durationHint}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {svc.organization}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {svc.locationHint}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Badge variant="secondary" className="text-xs">
                        {svc.requirements.length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ServiceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        service={editing}
        organizations={organizations}
        onSave={handleSave}
      />
    </div>
  );
}
