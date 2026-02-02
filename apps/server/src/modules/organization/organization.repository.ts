import { db } from "@CreatorHub/db";
import { organizationsInApp } from "@CreatorHub/db/schema/schema";
import { eq, sql, desc } from "drizzle-orm";
import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "./organization.dto";
import { slugify } from "../../lib/utils";

export const OrganizationRepository = {
  async create(data: CreateOrganizationInput) {
    const name: string = data.name;
    const slug: string =
      data.slug && data.slug.trim() ? slugify(data.slug) : slugify(name);

    const payload = {
      name,
      slug,
      timezone: data.timezone ?? "UTC",
      locale: data.locale ?? "pt_BR",
      currency: data.currency ?? "BRL",
      whiteLabel: data.whiteLabel ?? false,
      branding: data.branding ?? {},
      billingInfo: data.billingInfo ?? {},
      settings: data.settings ?? {},
    };

    const [row] = await db
      .insert(organizationsInApp)
      .values(payload)
      .returning();

    return row;
  },

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(organizationsInApp)
      .where(eq(organizationsInApp.id, id));

    return row ?? null;
  },

  async findBySlug(slug: string) {
    const [row] = await db
      .select()
      .from(organizationsInApp)
      .where(sql`lower(${organizationsInApp.slug}) = ${slug.toLowerCase()}`);

    return row ?? null;
  },

  async list(options?: { limit?: number; offset?: number }) {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;

    return db
      .select()
      .from(organizationsInApp)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(organizationsInApp.createdAt));
  },

  async update(id: string, data: UpdateOrganizationInput) {
    const set: Record<string, unknown> = {};

    if (data.name !== undefined) set.name = data.name;
    if (data.slug !== undefined) set.slug = slugify(data.slug);
    if (data.timezone !== undefined) set.timezone = data.timezone;
    if (data.locale !== undefined) set.locale = data.locale;
    if (data.currency !== undefined) set.currency = data.currency;
    if (data.whiteLabel !== undefined) set.whiteLabel = data.whiteLabel;
    if (data.branding !== undefined) set.branding = data.branding;
    if (data.billingInfo !== undefined) set.billingInfo = data.billingInfo;
    if (data.settings !== undefined) set.settings = data.settings;

    set.updatedAt = new Date();

    const [row] = await db
      .update(organizationsInApp)
      .set(set)
      .where(eq(organizationsInApp.id, id))
      .returning();

    return row ?? null;
  },
};
