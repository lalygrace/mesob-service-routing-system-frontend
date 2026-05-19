"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Building2,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { OrganizationForm } from "@/components/admin/organization-form";
import {
  createAdminOrganization,
  deleteAdminOrganization,
  listAdminOrganizations,
  updateAdminOrganization,
  syncOrganizationsFromCms,
  type Organization,
} from "@/lib/api/organizations";
import { listAdminServices, updateAdminService } from "@/lib/api/services";
import type { Service } from "@/lib/service-navigator/types";
import { getApiErrorMessage } from "@/lib/api/client";
import { ServiceForm } from "@/components/admin/service-form";
import { toast } from "sonner";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Organization | null>(null);
  const [servicesSheetOpen, setServicesSheetOpen] = React.useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    React.useState<Organization | null>(null);
  const [organizationServices, setOrganizationServices] = React.useState<
    Service[]
  >([]);
  const [servicesLoading, setServicesLoading] = React.useState(false);
  const [serviceEditOpen, setServiceEditOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(
    null,
  );

  React.useEffect(() => {
    loadOrganizations();
  }, []);

  async function loadOrganizations() {
    try {
      const data = await listAdminOrganizations();
      setOrganizations(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load organizations"));
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = organizations.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.abbreviation.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleSave(
    data: Omit<
      Organization,
      "id" | "createdAt" | "serviceCount" | "syncedFromCms"
    >,
  ) {
    try {
      if (editing) {
        const updated = await updateAdminOrganization(editing.id, data);
        setOrganizations((prev) =>
          prev.map((o) => (o.id === editing.id ? updated : o)),
        );
        toast.success("Organization updated successfully");
      } else {
        const created = await createAdminOrganization(data);
        setOrganizations((prev) => [created, ...prev]);
        toast.success("Organization created successfully");
      }
      setEditing(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save organization"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdminOrganization(id);
      setOrganizations((prev) => prev.filter((o) => o.id !== id));
      toast.success("Organization deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete organization"));
    }
  }

  async function handleSyncFromCms() {
    setIsSyncing(true);
    try {
      const result = await syncOrganizationsFromCms();
      toast.success(
        `Sync completed: ${result.created} created, ${result.updated} updated${result.errors > 0 ? `, ${result.errors} errors` : ""}`,
      );
      // Reload organizations after sync
      await loadOrganizations();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to sync from CMS"));
    } finally {
      setIsSyncing(false);
    }
  }

  function openEdit(organization: Organization) {
    setEditing(organization);
    setFormOpen(true);
  }

  async function loadServicesForOrganization(organization: Organization) {
    setServicesLoading(true);
    try {
      const services = await listAdminServices();
      const filteredServices = services.filter(
        (service) =>
          service.organizationId === organization.id ||
          service.organization === organization.name,
      );
      setOrganizationServices(filteredServices);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load services"));
    } finally {
      setServicesLoading(false);
    }
  }

  async function refreshSelectedOrganizationServices() {
    if (!selectedOrganization) return;
    await loadServicesForOrganization(selectedOrganization);
  }

  function openServicesSheet(organization: Organization) {
    setSelectedOrganization(organization);
    setServicesSheetOpen(true);
    void loadServicesForOrganization(organization);
  }

  function openServiceEdit(service: Service) {
    setEditingService(service);
    setServiceEditOpen(true);
  }

  async function handleServiceSave(data: Omit<Service, "id">) {
    if (!editingService) return false;
    try {
      await updateAdminService(editingService.id, data);
      toast.success("Service updated successfully");
      await refreshSelectedOrganizationServices();
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update service"));
      return false;
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage government organizations registered in the Mesob Center
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
            Sync from Mesob Center
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">All Organizations</CardTitle>
              <CardDescription>{organizations.length} total</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
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
                <TableHead>Organization</TableHead>
                <TableHead className="hidden md:table-cell">
                  Abbreviation
                </TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="text-center">Services</TableHead>
                <TableHead className="w-48" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Building2 className="h-8 w-8" />
                      <p>No organizations found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-62.5">
                            {org.description}
                          </p>
                        </div>
                        {org.syncedFromCms && (
                          <Badge variant="secondary" className="text-xs">
                            CMS
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="font-mono text-xs">
                        {org.abbreviation}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {[org.floor, org.room].filter(Boolean).join(" • ")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {org.serviceCount}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => openServicesSheet(org)}
                        >
                          <ChevronRight className="h-4 w-4" />
                          View Services
                        </Button>
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
                              onClick={() => openEdit(org)}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive"
                              onClick={() => handleDelete(org.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={servicesSheetOpen}
        onOpenChange={(open) => {
          setServicesSheetOpen(open);
          if (!open) {
            setEditingService(null);
            setServiceEditOpen(false);
          }
        }}
      >
        <SheetContent side="right" className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {selectedOrganization?.name || "Organization Services"}
            </SheetTitle>
            <SheetDescription>
              Services available for the selected organization.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <ScrollArea className="h-[calc(100vh-180px)] pr-2">
              {servicesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={`org-service-skeleton-${index}`}>
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : organizationServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                  <Building2 className="h-8 w-8" />
                  <p>No services found for this organization.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {organizationServices.map((service) => {
                    const hasNotice = !!service.notice?.trim();
                    const title = service.title || "-";

                    return (
                      <Card key={service.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{title}</p>
                              <p className="text-xs text-muted-foreground">
                                {service.organization}
                              </p>
                            </div>
                            {hasNotice && (
                              <Badge variant="destructive" className="text-xs">
                                Notice
                              </Badge>
                            )}
                          </div>
                          <div className="grid gap-1 text-sm text-muted-foreground">
                            <div>Service Fee (EN): {service.feeHint}</div>
                            <div>
                              Processing Time (EN): {service.durationHint}
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => openServiceEdit(service)}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <OrganizationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        organization={editing}
        onSave={handleSave}
      />

      <ServiceForm
        open={serviceEditOpen}
        onOpenChange={(open) => {
          setServiceEditOpen(open);
          if (!open) setEditingService(null);
        }}
        service={editingService}
        organizations={organizations}
        organizationReadOnly
        lockedOrganizationId={selectedOrganization?.id}
        onSave={handleServiceSave}
      />
    </div>
  );
}
