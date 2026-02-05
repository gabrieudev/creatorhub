import type { FastifyPluginAsync } from "fastify";
import taskController from "./task.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(taskController);
};

export default routes;
