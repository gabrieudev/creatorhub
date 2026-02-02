import { z } from "zod";
import {
  createRoleSchema,
  createRolesBatchSchema,
  updateRoleSchema,
  roleResponseSchema,
} from "./role.dto";
import { RoleService } from "./role.service";
import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
} from "fastify";
import { UnauthorizedError } from "@/lib/errors";

const orgIdParam = z.object({ organizationId: z.string().uuid() });
const orgRoleParams = z.object({
  organizationId: z.string().uuid(),
  roleId: z.string().uuid(),
});

function guard(request: FastifyRequest) {
  const session = (request as any).session;
  if (!session || !session.user) {
    throw new UnauthorizedError("Usuário não autenticado");
  }
}

export default async function roleController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  // list roles
  fastify.get(
    "/organizations/:organizationId/roles",
    async (request, reply) => {
      guard(request);
      const params = orgIdParam.parse(request.params);
      const q = request.query as any;
      const limit = q?.limit ? Number(q.limit) : undefined;
      const offset = q?.offset ? Number(q.offset) : undefined;
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      const list = await RoleService.listByOrganization(
        params.organizationId,
        actorUserId,
        { limit, offset },
      );
      return reply.send(list.map((r) => roleResponseSchema.parse(r)));
    },
  );

  // create (single or batch)
  fastify.post(
    "/organizations/:organizationId/roles",
    async (request, reply) => {
      guard(request);
      const params = orgIdParam.parse(request.params);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      // If body is array -> batch create, if object -> single
      const body = request.body;
      if (Array.isArray(body)) {
        // validate with batch schema
        const payload = createRolesBatchSchema.parse(body);
        const created = await RoleService.createMany(
          params.organizationId,
          payload,
          actorUserId,
        );
        return reply
          .code(201)
          .send(created.map((r: any) => roleResponseSchema.parse(r)));
      } else {
        const payload = createRoleSchema.parse(body);
        const created = await RoleService.create(
          params.organizationId,
          payload,
          actorUserId,
        );
        return reply.code(201).send(roleResponseSchema.parse(created));
      }
    },
  );

  // get by id
  fastify.get(
    "/organizations/:organizationId/roles/:roleId",
    async (request, reply) => {
      guard(request);
      const params = orgRoleParams.parse(request.params);
      // We can verify role.organizationId matches params.organizationId for safety
      const role = await RoleService.getById(params.roleId);
      if (String(role.organizationId) !== params.organizationId)
        return reply.status(404).send("Role not found in organization");
      return reply.send(roleResponseSchema.parse(role));
    },
  );

  // update
  fastify.patch(
    "/organizations/:organizationId/roles/:roleId",
    async (request, reply) => {
      guard(request);
      const params = orgRoleParams.parse(request.params);
      const payload = updateRoleSchema.parse(request.body);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      // service checks ownership and uniqueness
      const updated = await RoleService.update(
        params.roleId,
        payload,
        actorUserId,
      );
      if (String(updated.organizationId) !== params.organizationId)
        return reply.status(404).send("Role not found in organization");
      return reply.send(roleResponseSchema.parse(updated));
    },
  );

  // delete
  fastify.delete(
    "/organizations/:organizationId/roles/:roleId",
    async (request, reply) => {
      guard(request);
      const params = orgRoleParams.parse(request.params);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      // service will throw if builtin or no permission
      await RoleService.remove(params.roleId, actorUserId);
      return reply.code(204).send();
    },
  );
}
