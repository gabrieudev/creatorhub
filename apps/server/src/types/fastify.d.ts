import type { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    session?: any;
  }

  interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: import("fastify").FastifyReply,
    ): Promise<void>;
  }
}
