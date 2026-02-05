import { db } from "@CreatorHub/db";
import { contentItemsInApp } from "@CreatorHub/db/schema/schema";
import { desc, eq, sql } from "drizzle-orm";
import type {
  CreateContentItemInput,
  UpdateContentItemInput,
} from "./content-item.dto";

export const ContentItemRepository = {
  async create(organizationId: string, data: CreateContentItemInput) {
    const payload = {
      organizationId,
      title: data.title,
      description: data.description,
      contentType: data.contentType,
      platform: data.platform,
      externalId: data.externalId,
      status: data.status,
      visibility: data.visibility,
      scheduledAt: data.scheduledAt,
      publishedAt: data.publishedAt,
      estimatedDurationSeconds: data.estimatedDurationSeconds,
      metadata: data.metadata,
    };

    const [row] = await db
      .insert(contentItemsInApp)
      .values(payload as any)
      .returning();
    return row;
  },

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(contentItemsInApp)
      .where(eq(contentItemsInApp.id, id));
    return row ?? null;
  },

  async listByOrganization(
    organizationId: string,
    options?: {
      limit?: number;
      offset?: number;
      platform?: string;
      status?: string;
      q?: string;
    },
  ) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const conditions: unknown[] = [
      eq(contentItemsInApp.organizationId, organizationId),
    ];

    if (options?.platform) {
      conditions.push(sql`${contentItemsInApp.platform} = ${options.platform}`);
    }
    if (options?.status) {
      conditions.push(sql`${contentItemsInApp.status} = ${options.status}`);
    }
    if (options?.q) {
      const like = `%${options.q}%`;
      conditions.push(
        sql`(${contentItemsInApp.title} ILIKE ${like} OR ${contentItemsInApp.description} ILIKE ${like})`,
      );
    }

    return db
      .select()
      .from(contentItemsInApp)
      .where(sql`${conditions}`)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(contentItemsInApp.createdAt));
  },

  async update(id: string, data: UpdateContentItemInput) {
    const set: Record<string, unknown> = {};
    if (data.title !== undefined) set.title = data.title;
    if (data.description !== undefined)
      set.description = data.description ?? null;
    if (data.contentType !== undefined)
      set.contentType = data.contentType ?? null;
    if (data.platform !== undefined) set.platform = data.platform ?? null;
    if (data.externalId !== undefined) set.externalId = data.externalId ?? null;
    if (data.status !== undefined) set.status = data.status;
    if (data.visibility !== undefined) set.visibility = data.visibility;
    if (data.scheduledAt !== undefined)
      set.scheduledAt = data.scheduledAt
        ? new Date(data.scheduledAt as any)
        : null;
    if (data.publishedAt !== undefined)
      set.publishedAt = data.publishedAt
        ? new Date(data.publishedAt as any)
        : null;
    if (data.estimatedDurationSeconds !== undefined)
      set.estimatedDurationSeconds = data.estimatedDurationSeconds;
    if (data.metadata !== undefined) set.metadata = data.metadata;

    set.updatedAt = new Date();

    const [row] = await db
      .update(contentItemsInApp)
      .set(set)
      .where(eq(contentItemsInApp.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    await db.delete(contentItemsInApp).where(eq(contentItemsInApp.id, id));
  },
};
