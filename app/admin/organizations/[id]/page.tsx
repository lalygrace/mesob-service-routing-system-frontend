"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  Clock,
  Banknote,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
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
  Card,
  CardContent,
} from "@/components/ui/card";
import { getAdminOrganization, type Organization } from "@/lib/api/organizations";
import { listAdminServices, updateAdminService, deleteAdminService, createAdminService, bulkDeleteAdminServices } from "@/lib/api/services";
import type { Service } from "@/lib/service-navigator/types";
import { getApiErrorMessage } from "@/lib/api/client";
import { PremiumServiceEditor } from "@/components/admin/premium-service-editor";
import { toast } from "sonner";
import Link from "next/link";

export default function OrganizationServicesPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;

  const [organization, setOrganization] = React.useState<Organization | null>(null);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [serviceSearch, setServiceSearch] = React.useState("");

  const [serviceFormOpen, setServiceFormOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [deletingService, setDeletingService] = React.useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = React.useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  React.useEffect(() => {
    if (orgId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [orgData, allServices] = await Promise.all([
        getAdminOrganization(orgId),
        listAdminServices(),
      ]);
      setOrganization(orgData);
      
      const orgServices = allServices.filter(
        (s) => s.organizationId === orgData.id || s.organization === orgData.name
      );
      setServices(orgServices);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load organization data"));
      router.push("/admin/organizations");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleServiceSave(data: Omit<Service, "id">) {
    try {
      if (editingService) {
        // Strip out fields not allowed in UpdateServiceDto to prevent 400 Bad Request
        const { organizationId, organization, notice, syncedFromCms, isActive, ...updateData } = data as any;
        await updateAdminService(editingService.id, updateData);
        toast.success("Service updated successfully");
      } else {
        // Strip out notice and frontend-only fields for Create as well
        const { notice, syncedFromCms, isActive, organization, ...createData } = data as any;
        // Map frontend "organization" to backend DTO "Organization"
        createData.Organization = organization;
        
        await createAdminService(createData);
        toast.success("Service created successfully");
      }
      await loadData();
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save service"));
      return false;
    }
  }

  async function handleServiceDelete() {
    if (!deletingService) return;
    try {
      await deleteAdminService(deletingService.id);
      toast.success("Service deleted successfully");
      await loadData();
      setSelectedServices(new Set()); // Clear selection
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete service"));
    } finally {
      setDeletingService(null);
    }
  }

  async function handleBulkDelete() {
    if (selectedServices.size === 0) return;
    setIsBulkDeleting(true);
    try {
      await bulkDeleteAdminServices(Array.from(selectedServices));
      toast.success(`${selectedServices.size} service(s) deleted successfully`);
      await loadData();
      setSelectedServices(new Set());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete services"));
    } finally {
      setIsBulkDeleting(false);
    }
  }

  function toggleServiceSelection(serviceId: string) {
    const newSelection = new Set(selectedServices);
    if (newSelection.has(serviceId)) {
      newSelection.delete(serviceId);
    } else {
      newSelection.add(serviceId);
    }
    setSelectedServices(newSelection);
  }

  function toggleSelectAll() {
    if (selectedServices.size === filteredServices.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(filteredServices.map((s) => s.id)));
    }
  }

  function openCreateService() {
    setEditingService(null);
    setServiceFormOpen(true);
  }

  function openEditService(service: Service) {
    setEditingService(service);
    setServiceFormOpen(true);
  }

  const filteredServices = services.filter((s) => 
    (s.title || "").toLowerCase().includes(serviceSearch.toLowerCase())
  );

  if (isLoading && !organization) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" asChild className="shrink-0 mt-1">
            <Link href="/admin/organizations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          {organization && (
            <Avatar className="h-12 w-12 rounded-xl border border-border/50 bg-primary/10 text-primary shrink-0 mt-0.5">
              <AvatarImage src={organization.logoUrl} alt={organization.name} className="object-cover" />
              <AvatarFallback className="rounded-xl font-bold text-lg">
                {organization.abbreviation?.[0] || organization.name[0]}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{organization?.name}</h1>
              {organization?.abbreviation && (
                <Badge variant="outline" className="font-mono text-xs mt-1">
                  {organization.abbreviation}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Manage services and workflows mapped to this organization.
            </p>
          </div>
        </div>
        
        <Button onClick={openCreateService} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-border/50 flex gap-3 bg-background/95 backdrop-blur z-10 sticky top-0 rounded-t-xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services by name..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              className="pl-8 bg-muted/50 focus-visible:bg-background"
            />
          </div>
          {selectedServices.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete {selectedServices.size} Selected
            </Button>
          )}
        </div>
        
        <CardContent className="p-4 sm:p-6">
          <TooltipProvider delayDuration={300}>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={`org-service-skeleton-${index}`} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="font-medium">No services found</p>
                <p className="text-sm">This organization doesn&apos;t have any mapped services yet.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredServices.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
                    <Checkbox
                      checked={selectedServices.size === filteredServices.length && filteredServices.length > 0}
                      onCheckedChange={toggleSelectAll}
                      id="select-all"
                    />
                    <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer select-none">
                      Select All ({filteredServices.length})
                    </label>
                  </div>
                )}
                {filteredServices.map((service) => {
                  const hasNotice = !!service.notice?.trim();
                  const title = service.title || "Unnamed Service";
                  const isSelected = selectedServices.has(service.id);

                  return (
                    <div 
                      key={service.id}
                      className={`group flex items-center gap-3 p-4 rounded-xl border ${
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border/50 bg-card hover:bg-muted/10"
                      } transition-colors shadow-sm`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleServiceSelection(service.id)}
                        id={`service-${service.id}`}
                        className="shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="font-medium text-base truncate" title={title}>{title}</h4>
                          {hasNotice && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase tracking-wider font-semibold">
                              Notice
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1.5" title="Processing Time">
                          <Clock className="h-4 w-4" />
                          <span className="truncate max-w-[120px] font-medium text-foreground">{service.durationHint || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Service Fee">
                          <Banknote className="h-4 w-4" />
                          <span className="truncate max-w-[120px] font-medium text-foreground">{service.feeHint || "Free"}</span>
                        </div>
                        
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                onClick={() => openEditService(service)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Service</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeletingService(service)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Service</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TooltipProvider>
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingService} onOpenChange={(open) => !open && setDeletingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service <span className="font-semibold text-foreground">&quot;{deletingService?.title}&quot;</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                void handleServiceDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {organization && (
        <PremiumServiceEditor
          open={serviceFormOpen}
          onOpenChange={(open) => {
            setServiceFormOpen(open);
            if (!open) setEditingService(null);
          }}
          service={editingService}
          organizationId={organization.id}
          organizationName={organization.name}
          onSave={handleServiceSave}
        />
      )}
    </div>
  );
}
