import { db } from "@CreatorHub/db";
import {
  organizationMembersInApp,
  rolesInApp,
  usersInApp,
} from "@CreatorHub/db/schema/schema";
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
    const rows = await db
      .select({
        member: organizationMembersInApp,
        user: {
          id: usersInApp.id,
          name: usersInApp.name,
          email: usersInApp.email,
          image: usersInApp.image,
        },
        role: {
          id: rolesInApp.id,
          name: rolesInApp.name,
        },
      })
      .from(organizationMembersInApp)
      .innerJoin(usersInApp, eq(usersInApp.id, organizationMembersInApp.userId))
      .leftJoin(rolesInApp, eq(rolesInApp.id, organizationMembersInApp.roleId))
      .where(eq(organizationMembersInApp.id, id))
      .orderBy(desc(organizationMembersInApp.joinedAt));

    return (
      rows.map(({ member, user, role }) => ({
        ...member,
        user,
        role: role?.id ? role : null,
      }))[0] ?? null
    );
  },

  async findByOrgAndUser(organizationId: string, userId: string) {
    const rows = await db
      .select({
        member: organizationMembersInApp,
        user: {
          id: usersInApp.id,
          name: usersInApp.name,
          email: usersInApp.email,
          image: usersInApp.image,
        },
        role: {
          id: rolesInApp.id,
          name: rolesInApp.name,
        },
      })
      .from(organizationMembersInApp)
      .innerJoin(usersInApp, eq(usersInApp.id, organizationMembersInApp.userId))
      .leftJoin(rolesInApp, eq(rolesInApp.id, organizationMembersInApp.roleId))
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.userId, userId),
        ),
      )
      .orderBy(desc(organizationMembersInApp.joinedAt));

    return (
      rows.map(({ member, user, role }) => ({
        ...member,
        user,
        role: role?.id ? role : null,
      }))[0] ?? null
    );
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
    const rows = await db
      .select({
        member: organizationMembersInApp,
        user: {
          id: usersInApp.id,
          name: usersInApp.name,
          email: usersInApp.email,
          image: usersInApp.image,
        },
        role: {
          id: rolesInApp.id,
          name: rolesInApp.name,
        },
      })
      .from(organizationMembersInApp)
      .innerJoin(usersInApp, eq(usersInApp.id, organizationMembersInApp.userId))
      .leftJoin(rolesInApp, eq(rolesInApp.id, organizationMembersInApp.roleId))
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.isOwner, true),
        ),
      )
      .orderBy(desc(organizationMembersInApp.joinedAt));

    return rows.map(({ member, user, role }) => ({
      ...member,
      user,
      role: role?.id ? role : null,
    }));
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

    const rows = await db
      .select({
        member: organizationMembersInApp,
        user: {
          id: usersInApp.id,
          name: usersInApp.name,
          email: usersInApp.email,
          image: usersInApp.image,
        },
        role: {
          id: rolesInApp.id,
          name: rolesInApp.name,
        },
      })
      .from(organizationMembersInApp)
      .innerJoin(usersInApp, eq(usersInApp.id, organizationMembersInApp.userId))
      .leftJoin(rolesInApp, eq(rolesInApp.id, organizationMembersInApp.roleId))
      .where(eq(organizationMembersInApp.organizationId, organizationId))
      .orderBy(desc(organizationMembersInApp.joinedAt))
      .limit(limit)
      .offset(offset);

    return rows.map(({ member, user, role }) => ({
      ...member,
      user,
      role: role?.id ? role : null,
    }));
  },

  async list(options?: { limit?: number; offset?: number }) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;

    const rows = await db
      .select({
        member: organizationMembersInApp,
        user: {
          id: usersInApp.id,
          name: usersInApp.name,
          email: usersInApp.email,
          image: usersInApp.image,
        },
        role: {
          id: rolesInApp.id,
          name: rolesInApp.name,
        },
      })
      .from(organizationMembersInApp)
      .innerJoin(usersInApp, eq(usersInApp.id, organizationMembersInApp.userId))
      .leftJoin(rolesInApp, eq(rolesInApp.id, organizationMembersInApp.roleId))
      .orderBy(desc(organizationMembersInApp.joinedAt))
      .limit(limit)
      .offset(offset);

    return rows.map(({ member, user, role }) => ({
      ...member,
      user,
      role: role?.id ? role : null,
    }));
  },
};
