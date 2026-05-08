export type AuditLog = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-1",
    timestamp: "2024-01-15 14:32:15",
    userId: "user-1",
    userName: "System Admin",
    userEmail: "admin@mesob.gov.et",
    action: "CREATE",
    entityType: "Service",
    entityId: "svc-lost-id",
    ipAddress: "192.168.1.100",
  },
  {
    id: "audit-2",
    timestamp: "2024-01-15 14:28:42",
    userId: "user-1",
    userName: "System Admin",
    userEmail: "admin@mesob.gov.et",
    action: "UPDATE",
    entityType: "Authority",
    entityId: "auth-nida",
    ipAddress: "192.168.1.100",
  },
  {
    id: "audit-3",
    timestamp: "2024-01-15 13:45:18",
    userId: "user-2",
    userName: "Editor User",
    userEmail: "editor@mesob.gov.et",
    action: "DELETE",
    entityType: "IntentMapping",
    entityId: "int-old-phrase",
    ipAddress: "192.168.1.105",
  },
  {
    id: "audit-4",
    timestamp: "2024-01-15 11:22:09",
    userId: "user-1",
    userName: "System Admin",
    userEmail: "admin@mesob.gov.et",
    action: "CREATE",
    entityType: "Category",
    entityId: "cat-transport",
    ipAddress: "192.168.1.100",
  },
  {
    id: "audit-5",
    timestamp: "2024-01-15 10:15:33",
    userId: "user-1",
    userName: "System Admin",
    userEmail: "admin@mesob.gov.et",
    action: "PUBLISH",
    entityType: "Service",
    entityId: "svc-passport-renew",
    ipAddress: "192.168.1.100",
  },
  {
    id: "audit-6",
    timestamp: "2024-01-14 16:48:21",
    userId: "user-2",
    userName: "Editor User",
    userEmail: "editor@mesob.gov.et",
    action: "UPDATE",
    entityType: "ServiceRequirement",
    entityId: "req-1",
    ipAddress: "192.168.1.105",
  },
  {
    id: "audit-7",
    timestamp: "2024-01-14 15:30:45",
    userId: "user-1",
    userName: "System Admin",
    userEmail: "admin@mesob.gov.et",
    action: "UPDATE",
    entityType: "SystemConfig",
    entityId: "addisai_nlp_temperature",
    ipAddress: "192.168.1.100",
  },
  {
    id: "audit-8",
    timestamp: "2024-01-14 14:12:08",
    userId: "user-2",
    userName: "Editor User",
    userEmail: "editor@mesob.gov.et",
    action: "CREATE",
    entityType: "ServiceStep",
    entityId: "step-1",
    ipAddress: "192.168.1.105",
  },
  {
    id: "audit-9",
    timestamp: "2024-01-14 09:55:17",
    userId: "user-1",
    userName: "System Admin",
    userEmail: "admin@mesob.gov.et",
    action: "DELETE",
    entityType: "Service",
    entityId: "svc-old-service",
    ipAddress: "192.168.1.100",
  },
  {
    id: "audit-10",
    timestamp: "2024-01-13 17:20:44",
    userId: "user-1",
    userName: "System Admin",
    userEmail: "admin@mesob.gov.et",
    action: "UNPUBLISH",
    entityType: "Service",
    entityId: "svc-draft-service",
    ipAddress: "192.168.1.100",
  },
];
