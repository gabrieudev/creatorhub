import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import {
  createRolePermissionSchema,
  createRolePermissionsBatchSchema,
  rolePermissionResponseSchema,
} from "./role-permission.dto";
import { RolePermissionService } from "./role-permission.service";
import { RoleRepository } from "../role/role.repository";

const orgRoleParams = z.object({
  organizationId: z.string().uuid(),
  roleId: z.string().uuid(),
});
const orgRolePermParams = z.object({
  organizationId: z.string().uuid(),
  roleId: z.string().uuid(),
  permissionId: z.string().uuid(),
});

export default async function rolePermissionController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  // list permissions for a role
  fastify.get(
    "/organizations/:organizationId/roles/:roleId/permissions",
    async (request, reply) => {
      const params = orgRoleParams.parse(request.params);
      // validate role belongs to organization
      const role = await RoleRepository.findById(params.roleId);
      if (!role || String(role.organizationId) !== params.organizationId)
        return reply.status(404).send("Role not found in organization");

      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;
      const list = await RolePermissionService.listByRole(
        params.roleId,
        actorUserId,
        {},
      );
      return reply.send(
        list.map((r: any) => rolePermissionResponseSchema.parse(r)),
      );
    },
  );

  // add permission(s) - single or batch
  fastify.post(
    "/organizations/:organizationId/roles/:roleId/permissions",
    async (request, reply) => {
      const params = orgRoleParams.parse(request.params);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      // role existence & org matching
      const role = await RoleRepository.findById(params.roleId);
      if (!role || String(role.organizationId) !== params.organizationId)
        return reply.status(404).send("Role not found in organization");

      const body = request.body;
      if (Array.isArray(body)) {
        const payload = createRolePermissionsBatchSchema.parse(body);
        const created = await RolePermissionService.createMany(
          params.roleId,
          payload,
          actorUserId,
        );
        return reply
          .code(201)
          .send(created.map((r: any) => rolePermissionResponseSchema.parse(r)));
      } else {
        const payload = createRolePermissionSchema.parse(body);
        const created = await RolePermissionService.create(
          params.roleId,
          payload,
          actorUserId,
        );
        return reply
          .code(201)
          .send(rolePermissionResponseSchema.parse(created));
      }
    },
  );

  // get specific permission
  fastify.get(
    "/organizations/:organizationId/roles/:roleId/permissions/:permissionId",
    async (request, reply) => {
      const params = orgRolePermParams.parse(request.params);
      const role = await RoleRepository.findById(params.roleId);
      if (!role || String(role.organizationId) !== params.organizationId)
        return reply.status(404).send("Role not found in organization");

      const rp = await RolePermissionService.get(
        params.roleId,
        params.permissionId,
      );
      return reply.send(rolePermissionResponseSchema.parse(rp));
    },
  );

  // delete role permission
  fastify.delete(
    "/organizations/:organizationId/roles/:roleId/permissions/:permissionId",
    async (request, reply) => {
      const params = orgRolePermParams.parse(request.params);
      const role = await RoleRepository.findById(params.roleId);
      if (!role || String(role.organizationId) !== params.organizationId)
        return reply.status(404).send("Role not found in organization");

      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;
      await RolePermissionService.remove(
        params.roleId,
        params.permissionId,
        actorUserId,
      );
      return reply.code(204).send();
    },
  );
}
