import type { FastifyPluginAsync } from "fastify";
import organizationController from "./organization.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(organizationController);
};

export default routes;
