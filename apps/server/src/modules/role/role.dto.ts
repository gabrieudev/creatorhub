import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  isBuiltin: z.boolean().optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const createRolesBatchSchema = z.array(createRoleSchema).min(1);

export const updateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  isBuiltin: z.boolean().optional(),
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export const roleResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isBuiltin: z.boolean().optional(),
  createdAt: z.string().optional(),
});
export type RoleResponse = z.infer<typeof roleResponseSchema>;
