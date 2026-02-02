import { db } from "@CreatorHub/db";
import { rolesInApp } from "@CreatorHub/db/schema/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import type { CreateRoleInput, UpdateRoleInput } from "./role.dto";

export const RoleRepository = {
  async create(organizationId: string, data: CreateRoleInput) {
    const payload = {
      organizationId,
      name: data.name,
      description: data.description ?? null,
      isBuiltin: data.isBuiltin ?? false,
      createdAt: new Date().toISOString(),
    };
    const [row] = await db.insert(rolesInApp).values(payload).returning();
    return row;
  },

  // bulk create; payload must be array of insertable objects
  async createMany(organizationId: string, items: CreateRoleInput[]) {
    const payloads = items.map((it) => ({
      organizationId,
      name: it.name,
      description: it.description ?? null,
      isBuiltin: it.isBuiltin ?? false,
      createdAt: new Date().toISOString(),
    }));
    const rows = await db.insert(rolesInApp).values(payloads).returning();
    return rows;
  },

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(rolesInApp)
      .where(eq(rolesInApp.id, id));
    return row ?? null;
  },

  // case-insensitive name lookup within organization
  async findByOrgAndName(organizationId: string, name: string) {
    const [row] = await db
      .select()
      .from(rolesInApp)
      .where(
        and(
          eq(rolesInApp.organizationId, organizationId),
          sql`lower(${rolesInApp.name}) = ${name.toLowerCase()}`,
        ),
      );
    return row ?? null;
  },

  // get existing roles by names (case-insensitive)
  async findByOrgAndNames(organizationId: string, names: string[]) {
    if (names.length === 0) return [];
    // build lower names list
    const lowers = names.map((n) => n.toLowerCase());
    // simple approach: fetch all roles for org and filter in JS (fits expected sizes).
    const all = await db
      .select()
      .from(rolesInApp)
      .where(eq(rolesInApp.organizationId, organizationId));
    return all.filter((r: any) =>
      lowers.includes(String(r.name).toLowerCase()),
    );
  },

  async listByOrganization(
    organizationId: string,
    options?: { limit?: number; offset?: number },
  ) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    return db
      .select()
      .from(rolesInApp)
      .where(eq(rolesInApp.organizationId, organizationId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(rolesInApp.createdAt));
  },

  async update(id: string, data: UpdateRoleInput) {
    const set: Record<string, unknown> = {};
    if (data.name !== undefined) set.name = data.name;
    if (data.description !== undefined)
      set.description = data.description ?? null;
    if (data.isBuiltin !== undefined) set.isBuiltin = data.isBuiltin;
    // no updatedAt column in schema, so not setting it here
    const [row] = await db
      .update(rolesInApp)
      .set(set)
      .where(eq(rolesInApp.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    await db.delete(rolesInApp).where(eq(rolesInApp.id, id));
  },
};
