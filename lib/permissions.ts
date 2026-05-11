import { createAccessControl } from "better-auth/plugins/access";

/**
 * Define the access control statements for permissions
 * Make sure to use `as const` so TypeScript can infer the type correctly
 */
const statement = {
  // Admin operations - user management, role management, etc.
  admin: ["create", "read", "update", "delete"],
  // Service management
  service: ["create", "read", "update", "delete"],
  // Authority management
  authority: ["create", "read", "update", "delete"],
  // Analytics and reporting
  analytics: ["read"],
} as const;

export const ac = createAccessControl(statement);

/**
 * Define roles with specific permissions based on the AdminRole enum
 * SUPER_ADMIN: Full system access across all authorities
 * ADMIN: Full access scoped to one authority
 * EDITOR: Edit service content only
 * VIEWER: Read-only (analytics + services)
 */

export const SUPER_ADMIN = ac.newRole({
  admin: ["create", "read", "update", "delete"],
  service: ["create", "read", "update", "delete"],
  authority: ["create", "read", "update", "delete"],
  analytics: ["read"],
});

export const ADMIN = ac.newRole({
  admin: ["create", "read", "update", "delete"],
  service: ["create", "read", "update", "delete"],
  authority: ["read", "update"],
  analytics: ["read"],
});

export const EDITOR = ac.newRole({
  service: ["create", "read", "update"],
  analytics: ["read"],
});

export const VIEWER = ac.newRole({
  service: ["read"],
  analytics: ["read"],
});

export const roles = {
  SUPER_ADMIN,
  ADMIN,
  EDITOR,
  VIEWER,
};
