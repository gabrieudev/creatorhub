import { auth } from "@CreatorHub/auth";
import type { HeadersInit } from "bun";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { UnauthorizedError } from "../lib/errors";

export default fp(async function (fastify: FastifyInstance) {
  fastify.route({
    method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        const url = new URL(
          request.raw.url ?? "/",
          `http://${request.headers.host}`,
        );

        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        const response = await auth.handler(req);
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const json = await response.json();
          return reply.send(json);
        }
        const text = response.body ? await response.text() : null;
        return reply.send(text);
      } catch (error) {
        fastify.log.error({ err: error }, "Authentication Error:");
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });

  fastify.decorate("authenticate", async function authenticate(request) {
    const session = await auth.api.getSession({
      headers: request.headers as HeadersInit,
    });

    if (!session || !session.user) {
      throw new UnauthorizedError("Not authenticated");
    }

    (request as any).session = session;
  });
});
