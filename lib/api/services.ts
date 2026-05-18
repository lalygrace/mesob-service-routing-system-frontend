import { apiData } from "./client";
import type { LanguageCode, Service } from "@/lib/service-navigator/types";

export function listPublicServices(language: LanguageCode) {
  return apiData<Service[]>(`/api/public/services?lang=${language}`);
}

export function getPublicService(serviceId: string, language: LanguageCode) {
  return apiData<Service>(`/api/public/services/${serviceId}?lang=${language}`);
}

export function listAdminServices() {
  return apiData<Service[]>("/api/admin/services");
}

export function createAdminService(payload: Omit<Service, "id">) {
  return apiData<Service>("/api/admin/services", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminService(serviceId: string, payload: Omit<Service, "id">) {
  return apiData<Service>(`/api/admin/services/${serviceId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAdminService(serviceId: string) {
  return apiData<{ id: string; deleted: boolean }>(`/api/admin/services/${serviceId}`, {
    method: "DELETE",
  });
}

export function syncServicesFromCms() {
  return apiData<{
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
  }>("/api/admin/services/sync-from-cms", {
    method: "POST",
  });
}
