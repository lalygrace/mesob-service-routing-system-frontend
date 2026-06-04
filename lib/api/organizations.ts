import { apiData } from "./client";

export type Organization = {
  id: string;
  name: string;
  nameAm: string;
  nameOm?: string;
  abbreviation: string;
  abbreviationAm: string;
  abbreviationOm?: string;
  description?: string;
  descriptionAm?: string;
  descriptionOm?: string;
  floor?: string;
  floorAm?: string;
  floorOm?: string;
  room?: string;
  roomAm?: string;
  roomOm?: string;
  logoUrl?: string;
  serviceCount: number;
  createdAt: string;
  syncedFromCms: boolean;
};

export type OrganizationPayload = Omit<
  Organization,
  "id" | "createdAt" | "serviceCount" | "syncedFromCms"
>;

export function listAdminOrganizations() {
  return apiData<Organization[]>("/api/admin/organizations");
}

export function getAdminOrganization(organizationId: string) {
  return apiData<Organization>(`/api/admin/organizations/${organizationId}`);
}

export function createAdminOrganization(payload: OrganizationPayload) {
  return apiData<Organization>("/api/admin/organizations", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminOrganization(
  organizationId: string,
  payload: OrganizationPayload,
) {
  return apiData<Organization>(`/api/admin/organizations/${organizationId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAdminOrganization(organizationId: string) {
  return apiData<{ id: string; deleted: boolean }>(
    `/api/admin/organizations/${organizationId}`,
    {
      method: "DELETE",
    },
  );
}

export function syncOrganizationsFromCms() {
  return apiData<{
    success: boolean;
    created: number;
    updated: number;
    errors: number;
    errorMessages: string[];
  }>("/api/admin/organizations/sync-from-cms", {
    method: "POST",
  });
}
