import type { FastifyPluginAsync } from "fastify";
import dashboardController from "./dashboard.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(dashboardController);
};

export default routes;
