import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  currency: z.string().length(3).optional(),
  whiteLabel: z.boolean().optional(),
  branding: z.record(z.string(), z.any()).optional(),
  billingInfo: z.record(z.string(), z.any()).optional(),
  settings: z.record(z.string(), z.any()).optional(),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

export const organizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  currency: z.string().optional(),
  whiteLabel: z.boolean().optional(),
  branding: z.record(z.string(), z.any()).optional(),
  billingInfo: z.record(z.string(), z.any()).optional(),
  settings: z.record(z.string(), z.any()).optional(),
});
export type OrganizationResponse = z.infer<typeof organizationResponseSchema>;
