import { z } from "zod";

export const createOrganizationMemberSchema = z.object({
  userId: z.string().min(1),
  roleId: z.string().uuid().optional().nullable(),
  isOwner: z.boolean().optional(),
  preferences: z.record(z.string(), z.any()).optional(),
  flActive: z.boolean().optional(),
});

export type CreateOrganizationMemberInput = z.infer<
  typeof createOrganizationMemberSchema
>;

export const updateOrganizationMemberSchema = z.object({
  roleId: z.string().uuid().optional().nullable(),
  isOwner: z.boolean().optional(),
  preferences: z.record(z.string(), z.any()).optional(),
  flActive: z.boolean().optional(),
});
export type UpdateOrganizationMemberInput = z.infer<
  typeof updateOrganizationMemberSchema
>;

export const organizationMemberResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  userId: z.string(),
  roleId: z.string().uuid().nullable().optional(),
  joinedAt: z.string().optional(),
  isOwner: z.boolean().optional(),
  preferences: z.record(z.string(), z.any()).optional(),
  flActive: z.boolean().optional(),
});
export type OrganizationMemberResponse = z.infer<
  typeof organizationMemberResponseSchema
>;
