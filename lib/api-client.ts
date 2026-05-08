/**
 * API Client for Backend Integration
 * Handles communication with the NestJS backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(error.message || 'Request failed', response.status, error);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

// Categories API
export const categoriesApi = {
  list: () => api.get<any[]>('/api/admin/categories'),
  get: (id: string) => api.get<any>(`/api/admin/categories/${id}`),
  create: (data: any) => api.post<any>('/api/admin/categories', data),
  update: (id: string, data: any) => api.patch<any>(`/api/admin/categories/${id}`, data),
  delete: (id: string) => api.delete<any>(`/api/admin/categories/${id}`),
  upsertTranslation: (id: string, lang: string, data: any) =>
    api.put<any>(`/api/admin/categories/${id}/translations/${lang}`, data),
};

// System Config API
export const systemConfigApi = {
  list: () => api.get<any[]>('/api/admin/system-config'),
  upsert: (key: string, data: any) => api.put<any>(`/api/admin/system-config/${key}`, data),
};

// Audit Logs API
export const auditLogsApi = {
  list: (params?: { from?: string; to?: string; userId?: string; entityType?: string; entityId?: string; skip?: number; take?: number }) => {
    const queryString = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryString.append(key, String(value));
      });
    }
    return api.get<any[]>(`/api/admin/audit-logs?${queryString}`);
  },
};

// Requirements API
export const requirementsApi = {
  createForService: (serviceId: string, data: any) =>
    api.post<any>(`/api/admin/services/${serviceId}/requirements`, data),
  update: (requirementId: string, data: any) =>
    api.patch<any>(`/api/admin/requirements/${requirementId}`, data),
  delete: (requirementId: string) =>
    api.delete<any>(`/api/admin/requirements/${requirementId}`),
  upsertTranslation: (requirementId: string, lang: string, data: any) =>
    api.put<any>(`/api/admin/requirements/${requirementId}/translations/${lang}`, data),
};

// Steps API
export const stepsApi = {
  createForService: (serviceId: string, data: any) =>
    api.post<any>(`/api/admin/services/${serviceId}/steps`, data),
  update: (stepId: string, data: any) =>
    api.patch<any>(`/api/admin/steps/${stepId}`, data),
  delete: (stepId: string) =>
    api.delete<any>(`/api/admin/steps/${stepId}`),
  upsertTranslation: (stepId: string, lang: string, data: any) =>
    api.put<any>(`/api/admin/steps/${stepId}/translations/${lang}`, data),
};

// Services API
export const servicesApi = {
  list: () => api.get<any[]>('/api/admin/services'),
  get: (id: string) => api.get<any>(`/api/admin/services/${id}`),
  create: (data: any) => api.post<any>('/api/admin/services', data),
  update: (id: string, data: any) => api.patch<any>(`/api/admin/services/${id}`, data),
  delete: (id: string) => api.delete<any>(`/api/admin/services/${id}`),
  publish: (id: string) => api.post<any>(`/api/admin/services/${id}/publish`),
  unpublish: (id: string) => api.post<any>(`/api/admin/services/${id}/unpublish`),
  upsertTranslation: (id: string, lang: string, data: any) =>
    api.put<any>(`/api/admin/services/${id}/translations/${lang}`, data),
  listIntentMappings: (serviceId: string, lang?: string) => {
    const params = lang ? `?lang=${lang}` : '';
    return api.get<any[]>(`/api/admin/services/${serviceId}/intent-mappings${params}`);
  },
};

// Authorities API
export const authoritiesApi = {
  list: () => api.get<any[]>('/api/admin/authorities'),
  get: (id: string) => api.get<any>(`/api/admin/authorities/${id}`),
  create: (data: any) => api.post<any>('/api/admin/authorities', data),
  update: (id: string, data: any) => api.patch<any>(`/api/admin/authorities/${id}`, data),
  delete: (id: string) => api.delete<any>(`/api/admin/authorities/${id}`),
};

// Intent Mappings API
export const intentMappingsApi = {
  list: () => api.get<any[]>('/api/admin/intent-mappings'),
  listForService: (serviceId: string, lang?: string) => {
    const params = lang ? `?lang=${lang}` : '';
    return api.get<any[]>(`/api/admin/services/${serviceId}/intent-mappings${params}`);
  },
  createForService: (serviceId: string, data: any) =>
    api.post<any>(`/api/admin/services/${serviceId}/intent-mappings`, data),
  create: (data: any) => api.post<any>('/api/admin/intent-mappings', data),
  update: (mappingId: string, data: any) =>
    api.patch<any>(`/api/admin/intent-mappings/${mappingId}`, data),
  delete: (mappingId: string) =>
    api.delete<any>(`/api/admin/intent-mappings/${mappingId}`),
};
