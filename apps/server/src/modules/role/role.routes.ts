import type { FastifyPluginAsync } from "fastify";
import roleController from "./role.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(roleController);
};

export default routes;
