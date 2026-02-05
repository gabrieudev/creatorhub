import { z } from "zod";

export const createContentItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  contentType: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  externalId: z.string().optional().nullable(),
  status: z.string().optional(),
  visibility: z.string().optional(),
  scheduledAt: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  estimatedDurationSeconds: z.number().int().positive().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateContentItemInput = z.infer<typeof createContentItemSchema>;

export const updateContentItemSchema = createContentItemSchema.partial();
export type UpdateContentItemInput = z.infer<typeof updateContentItemSchema>;

export const contentItemResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  contentType: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  externalId: z.string().nullable().optional(),
  status: z.string().optional(),
  visibility: z.string().optional(),
  scheduledAt: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  estimatedDurationSeconds: z.number().int().nullable().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdBy: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type ContentItemResponse = z.infer<typeof contentItemResponseSchema>;
