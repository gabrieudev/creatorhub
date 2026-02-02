import type { FastifyPluginAsync } from "fastify";
import rolePermissionController from "./role-permission.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(rolePermissionController);
};

export default routes;
