import { z } from "zod";

export const createRolePermissionSchema = z.object({
  permissionId: z.string().uuid(),
});
export type CreateRolePermissionInput = z.infer<
  typeof createRolePermissionSchema
>;

export const createRolePermissionsBatchSchema = z
  .array(createRolePermissionSchema)
  .min(1);

export const rolePermissionResponseSchema = z.object({
  roleId: z.string().uuid(),
  permissionId: z.string().uuid(),
});
export type RolePermissionResponse = z.infer<
  typeof rolePermissionResponseSchema
>;
