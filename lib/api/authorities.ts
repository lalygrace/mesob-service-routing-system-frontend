import { apiData } from "./client";

export type Authority = {
  id: string;
  name: string;
  nameAm: string;
  nameOm: string;
  abbreviation: string;
  abbreviationAm: string;
  abbreviationOm: string;
  description?: string;
  floor: string;
  room?: string;
  serviceCount: number;
  createdAt: string;
};

export type AuthorityPayload = Omit<
  Authority,
  "id" | "createdAt" | "serviceCount"
>;

export function listAdminAuthorities() {
  return apiData<Authority[]>("/api/admin/authorities");
}

export function createAdminAuthority(payload: AuthorityPayload) {
  return apiData<Authority>("/api/admin/authorities", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminAuthority(
  authorityId: string,
  payload: AuthorityPayload,
) {
  return apiData<Authority>(`/api/admin/authorities/${authorityId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAdminAuthority(authorityId: string) {
  return apiData<{ id: string; deleted: boolean }>(
    `/api/admin/authorities/${authorityId}`,
    {
      method: "DELETE",
    },
  );
}
