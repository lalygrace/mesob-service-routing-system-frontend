"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Building2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getApiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";

export default function OrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Organization | null>(null);
  const [deletingOrganization, setDeletingOrganization] = React.useState<Organization | null>(
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

  async function handleDelete() {
    if (!deletingOrganization) return;
    try {
      await deleteAdminOrganization(deletingOrganization.id);
      setOrganizations((prev) => prev.filter((o) => o.id !== deletingOrganization.id));
      toast.success("Organization deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete organization"));
    } finally {
      setDeletingOrganization(null);
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
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TooltipProvider delayDuration={300}>
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
                    <TableRow 
                      key={org.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => router.push(`/admin/organizations/${org.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-lg border border-border/50 bg-primary/10 text-primary shrink-0">
                            <AvatarImage src={org.logoUrl} alt={org.name} className="object-cover" />
                            <AvatarFallback className="rounded-lg font-bold">
                              {org.abbreviation?.[0] || org.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{org.name}</p>
                              {org.syncedFromCms && (
                                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-semibold shrink-0">
                                  CMS
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                              {org.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="font-mono text-xs">
                          {org.abbreviation}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {[org.floor, org.room].filter(Boolean).join(" • ") || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {org.serviceCount}
                        </Badge>
                      </TableCell>

                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                onClick={() => openEdit(org)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Organization</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeletingOrganization(org)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Organization</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TooltipProvider>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingOrganization} onOpenChange={(open) => !open && setDeletingOrganization(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold text-foreground">&quot;{deletingOrganization?.name}&quot;</span> and all of its associated services. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <OrganizationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        organization={editing}
        onSave={handleSave}
      />
    </div>
  );
}
