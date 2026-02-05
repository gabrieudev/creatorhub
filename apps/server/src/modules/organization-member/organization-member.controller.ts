import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
} from "fastify";
import { z } from "zod";
import {
  createOrganizationMemberSchema,
  updateOrganizationMemberSchema,
  organizationMemberResponseSchema,
} from "./organization-member.dto";
import { OrganizationMemberService } from "./organization-member.service";
import { UnauthorizedError } from "@/lib/errors";

const orgIdParam = z.object({ organizationId: z.string().uuid() });

const orgUserParams = z.object({
  organizationId: z.string().uuid(),
  userId: z.string(),
});

function guard(request: FastifyRequest) {
  const session = (request as any).session;
  if (!session || !session.user) {
    throw new UnauthorizedError("Usuário não autenticado");
  }
}

export default async function organizationMemberController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  // List members
  fastify.get(
    "/organizations/:organizationId/members",
    async (request, reply) => {
      guard(request);
      const params = orgIdParam.parse(request.params);
      const q = request.query as any;
      const limit = q?.limit ? Number(q.limit) : undefined;
      const offset = q?.offset ? Number(q.offset) : undefined;

      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;
      const list = await OrganizationMemberService.listByOrganization(
        params.organizationId,
        actorUserId,
        { limit, offset },
      );
      return reply.send(
        list.map((r) => organizationMemberResponseSchema.parse(r)),
      );
    },
  );

  // Create member
  fastify.post(
    "/organizations/:organizationId/members",
    async (request, reply) => {
      guard(request);
      const params = orgIdParam.parse(request.params);
      const payload = createOrganizationMemberSchema.parse(request.body);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      const created = await OrganizationMemberService.create(
        params.organizationId,
        payload,
        actorUserId,
      );
      return reply
        .code(201)
        .send(organizationMemberResponseSchema.parse(created));
    },
  );

  // Get membership by org + user
  fastify.get(
    "/organizations/:organizationId/members/:userId",
    async (request, reply) => {
      guard(request);
      const params = orgUserParams.parse(request.params);
      const member = await OrganizationMemberService.getByOrgAndUser(
        params.organizationId,
        params.userId,
      );
      if (!member) return reply.code(404).send("Organization member not found");
      return reply.send(organizationMemberResponseSchema.parse(member));
    },
  );

  // Update membership by org + user
  fastify.patch(
    "/organizations/:organizationId/members/:userId",
    async (request, reply) => {
      guard(request);
      const params = orgUserParams.parse(request.params);
      const payload = updateOrganizationMemberSchema.parse(request.body);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      const updated = await OrganizationMemberService.updateByOrgAndUser(
        params.organizationId,
        params.userId,
        payload,
        actorUserId,
      );
      return reply.send(organizationMemberResponseSchema.parse(updated));
    },
  );
}
