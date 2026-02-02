import Fastify from "fastify";
import authProxy from "./plugins/auth-proxy";
import corsPlugin from "./plugins/cors";
import { globalErrorHandler } from "./lib/global-error-handler";
import organizationRoutes from "./modules/organization/organization.routes";
import organizationMemberRoutes from "./modules/organization-member/organization-member.routes";
import rolePermissionRoutes from "./modules/role-permission/role-permission.routes";
import roleRoutes from "./modules/role/role.routes";
import onboardingRoutes from "./modules/onboarding/onboarding.routes";

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
      fastify.register(organizationMemberRoutes);
      fastify.register(rolePermissionRoutes);
      fastify.register(roleRoutes);
      fastify.register(onboardingRoutes);
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
