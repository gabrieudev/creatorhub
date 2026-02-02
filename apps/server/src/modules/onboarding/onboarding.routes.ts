import type { FastifyPluginAsync } from "fastify";
import onboardingController from "./onboarding.controller";

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(onboardingController);
};

export default routes;
