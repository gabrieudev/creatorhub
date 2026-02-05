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

export const organizationMemberRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const organizationMemberResponseSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  roleId: z.string().nullable().optional(),

  joinedAt: z.string(),
  isOwner: z.boolean(),
  flActive: z.boolean(),

  preferences: z.record(z.string(), z.any()).optional(),

  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),

    emailVerified: z.boolean().optional(),
    image: z.string().nullable().optional(),
    lastSigninAt: z.string().nullable().optional(),
    status: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),

    profile: z.any().optional(),
  }),

  role: z
    .object({
      id: z.string(),
      name: z.string(),

      isBuiltin: z.boolean().optional(),
      createdAt: z.string().optional(),
      description: z.string().nullable().optional(),
      organizationId: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export type OrganizationMemberResponse = z.infer<
  typeof organizationMemberResponseSchema
>;
