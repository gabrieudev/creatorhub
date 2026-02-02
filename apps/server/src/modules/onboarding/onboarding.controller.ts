import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
} from "fastify";
import { z } from "zod";
import { onboardingSchema } from "./onboarding.dto";
import { OnboardingService } from "./onboarding.service";
import { UnauthorizedError } from "@/lib/errors";

const userIdParam = z.object({ userId: z.string() });

function guard(request: FastifyRequest) {
  const session = (request as any).session;
  if (!session || !session.user) {
    throw new UnauthorizedError("Usuário não autenticado");
  }
}

export default async function onboardingController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  fastify.post("/users/:userId/organizations", async (request, reply) => {
    guard(request);
    const params = userIdParam.parse(request.params);
    const payload = onboardingSchema.parse(request.body);

    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const res = await OnboardingService.createOrganizationForUser(
      params.userId,
      payload,
      actorUserId,
    );
    return reply.code(201).send(res);
  });
}
