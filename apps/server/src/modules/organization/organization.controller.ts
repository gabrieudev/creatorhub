import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
} from "fastify";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationResponseSchema,
} from "./organization.dto";
import { OrganizationService } from "./organization.service";
import { z } from "zod";
import { UnauthorizedError } from "@/lib/errors";

const idParam = z.object({ id: z.string().uuid() });

function guard(request: FastifyRequest) {
  const session = (request as any).session;
  if (!session || !session.user) {
    throw new UnauthorizedError("Usuário não autenticado");
  }
}

export default async function organizationController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  fastify.get("/organizations", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const limit = q?.limit ? Number(q.limit) : undefined;
    const offset = q?.offset ? Number(q.offset) : undefined;
    const userId = (request as any).session.user.id;

    const list = await OrganizationService.list(userId, { limit, offset });
    return reply.send(list.map((r) => organizationResponseSchema.parse(r)));
  });

  fastify.post("/organizations", async (request, reply) => {
    guard(request);
    const payload = createOrganizationSchema.parse(request.body);
    const created = await OrganizationService.create(payload);
    return reply.code(201).send(organizationResponseSchema.parse(created));
  });

  fastify.get("/organizations/:id", async (request, reply) => {
    guard(request);
    const params = idParam.parse(request.params);
    const org = await OrganizationService.getById(params.id);
    if (!org) return reply.code(404).send("Organization not found");
    return reply.send(organizationResponseSchema.parse(org));
  });

  fastify.patch("/organizations/:id", async (request, reply) => {
    guard(request);
    const params = idParam.parse(request.params);
    const payload = updateOrganizationSchema.parse(request.body);
    const updated = await OrganizationService.update(params.id, payload);
    return reply.send(organizationResponseSchema.parse(updated));
  });
}
