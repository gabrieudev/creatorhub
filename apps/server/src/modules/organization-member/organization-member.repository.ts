import { db } from "@CreatorHub/db";
import { organizationMembersInApp } from "@CreatorHub/db/schema/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import type {
  CreateOrganizationMemberInput,
  UpdateOrganizationMemberInput,
} from "./organization-member.dto";

export const OrganizationMemberRepository = {
  async create(organizationId: string, data: CreateOrganizationMemberInput) {
    const payload = {
      organizationId,
      userId: data.userId,
      roleId: data.roleId ?? null,
      joinedAt: new Date().toISOString(),
      isOwner: data.isOwner ?? false,
      preferences: data.preferences ?? {},
      flActive: data.flActive ?? true,
    };

    const [row] = await db
      .insert(organizationMembersInApp)
      .values(payload)
      .returning();
    return row;
  },

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(organizationMembersInApp)
      .where(eq(organizationMembersInApp.id, id));
    return row ?? null;
  },

  async findByOrgAndUser(organizationId: string, userId: string) {
    const [row] = await db
      .select()
      .from(organizationMembersInApp)
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.userId, userId),
        ),
      );
    return row ?? null;
  },

  async updateByOrgAndUser(
    organizationId: string,
    userId: string,
    data: UpdateOrganizationMemberInput,
  ) {
    const set: Record<string, unknown> = {};
    if (data.roleId !== undefined) set.roleId = data.roleId ?? null;
    if (data.isOwner !== undefined) set.isOwner = data.isOwner;
    if (data.preferences !== undefined) set.preferences = data.preferences;
    if (data.flActive !== undefined) set.flActive = data.flActive;
    set.updatedAt = new Date().toISOString();

    const [row] = await db
      .update(organizationMembersInApp)
      .set(set)
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.userId, userId),
        ),
      )
      .returning();

    return row ?? null;
  },

  async update(id: string, data: UpdateOrganizationMemberInput) {
    const set: Record<string, unknown> = {};
    if (data.roleId !== undefined) set.roleId = data.roleId ?? null;
    if (data.isOwner !== undefined) set.isOwner = data.isOwner;
    if (data.preferences !== undefined) set.preferences = data.preferences;
    if (data.flActive !== undefined) set.flActive = data.flActive;
    set.updatedAt = new Date();

    const [row] = await db
      .update(organizationMembersInApp)
      .set(set)
      .where(eq(organizationMembersInApp.id, id))
      .returning();

    return row ?? null;
  },

  async deleteByOrgAndUser(organizationId: string, userId: string) {
    await db
      .delete(organizationMembersInApp)
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.userId, userId),
        ),
      );
  },

  async delete(id: string) {
    await db
      .delete(organizationMembersInApp)
      .where(eq(organizationMembersInApp.id, id));
  },

  async findOwners(organizationId: string) {
    return db
      .select()
      .from(organizationMembersInApp)
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.isOwner, true),
        ),
      );
  },

  async countOwners(organizationId: string) {
    const res = await db
      .select({
        cnt: sql<number>`count(*)`,
      })
      .from(organizationMembersInApp)
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.isOwner, true),
        ),
      );
    return Number((res as any)[0]?.cnt ?? 0);
  },

  async listByOrganization(
    organizationId: string,
    options?: { limit?: number; offset?: number },
  ) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    return db
      .select()
      .from(organizationMembersInApp)
      .where(eq(organizationMembersInApp.organizationId, organizationId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(organizationMembersInApp.joinedAt));
  },

  async list(options?: { limit?: number; offset?: number }) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    return db
      .select()
      .from(organizationMembersInApp)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(organizationMembersInApp.joinedAt));
  },
};
