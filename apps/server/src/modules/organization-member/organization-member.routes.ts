import type { FastifyPluginAsync } from "fastify";
import organizationMemberController from "./organization-member.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(organizationMemberController);
};

export default routes;
