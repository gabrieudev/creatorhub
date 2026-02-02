import { db } from "@CreatorHub/db";
import {
  rolePermissionsInApp,
  permissionsInApp,
  rolesInApp,
} from "@CreatorHub/db/schema/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Repository para role_permissions
 */
export const RolePermissionRepository = {
  async create(roleId: string, permissionId: string) {
    const payload = {
      roleId,
      permissionId,
    };
    const row = await db.insert(rolePermissionsInApp).values(payload);
    // insert returns void for primary-keyless inserts in some setups; try returning by selecting:
    // but we rely on composite primary key; return payload as inserted row

    return { roleId, permissionId };
  },

  async createMany(roleId: string, permissionIds: string[]) {
    if (permissionIds.length === 0) return [];
    const payloads = permissionIds.map((pid) => ({
      roleId,
      permissionId: pid,
    }));
    await db.insert(rolePermissionsInApp).values(payloads);
    return payloads;
  },

  async find(roleId: string, permissionId: string) {
    const [row] = await db
      .select()
      .from(rolePermissionsInApp)
      .where(
        and(
          eq(rolePermissionsInApp.roleId, roleId),
          eq(rolePermissionsInApp.permissionId, permissionId),
        ),
      );
    return row ?? null;
  },

  async listByRole(
    roleId: string,
    options?: { limit?: number; offset?: number },
  ) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    return db
      .select()
      .from(rolePermissionsInApp)
      .where(eq(rolePermissionsInApp.roleId, roleId))
      .limit(limit)
      .offset(offset);
  },

  async deleteByRoleAndPermission(roleId: string, permissionId: string) {
    await db
      .delete(rolePermissionsInApp)
      .where(
        and(
          eq(rolePermissionsInApp.roleId, roleId),
          eq(rolePermissionsInApp.permissionId, permissionId),
        ),
      );
  },

  async deleteByRole(roleId: string) {
    await db
      .delete(rolePermissionsInApp)
      .where(eq(rolePermissionsInApp.roleId, roleId));
  },

  // helpers to validate existence of role / permission
  async roleExists(roleId: string) {
    const [r] = await db
      .select()
      .from(rolesInApp)
      .where(eq(rolesInApp.id, roleId));
    return !!r;
  },

  async permissionExists(permissionId: string) {
    const [p] = await db
      .select()
      .from(permissionsInApp)
      .where(eq(permissionsInApp.id, permissionId));
    return !!p;
  },

  // find permissions for multiple ids (useful to validate batch)
  async findExistingPermissions(permissionIds: string[]) {
    if (permissionIds.length === 0) return [];
    const all = await db
      .select()
      .from(permissionsInApp)
      .where(sql`id = any(${permissionIds})`);
    return all;
  },
};
