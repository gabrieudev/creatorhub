import Fastify from "fastify";
import authProxy from "./plugins/auth-proxy";
import corsPlugin from "./plugins/cors";
import { globalErrorHandler } from "./lib/global-error-handler";
import organizationRoutes from "./modules/organizations/organization.routes";

const fastify = Fastify({ logger: true });

async function bootstrap() {
  // plugins
  await fastify.register(corsPlugin);
  await fastify.register(authProxy);

  // handler de erros global
  fastify.setErrorHandler(globalErrorHandler);

  // rotas
  fastify.register(
    async (fastify) => {
      fastify.addHook("preHandler", fastify.authenticate);
      fastify.register(organizationRoutes);
    },
    { prefix: "/api" },
  );

  const port = Number(process.env.PORT ?? 3000);
  await fastify.listen({ port, host: "0.0.0.0" });
  fastify.log.info(`Servidor rodando na porta ${port}`);
}

bootstrap().catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
