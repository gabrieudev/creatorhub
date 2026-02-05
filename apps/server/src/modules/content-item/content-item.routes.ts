import type { FastifyPluginAsync } from "fastify";
import contentItemController from "./content-item.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(contentItemController);
};

export default routes;
