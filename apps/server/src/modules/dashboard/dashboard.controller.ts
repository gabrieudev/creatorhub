import { UnauthorizedError } from "@/lib/errors";
import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
} from "fastify";
import {
  contentPerformanceQuerySchema,
  pendingTasksQuerySchema,
  recentActivityQuerySchema,
  revenueByPlatformQuerySchema,
  revenueTrendQuerySchema,
  upcomingContentQuerySchema,
} from "./dashboard.dto";
import { DashboardService } from "./dashboard.service";

function guard(request: FastifyRequest) {
  const session = (request as any).session;
  if (!session || !session.user) {
    throw new UnauthorizedError("Usuário não autenticado");
  }
}

export default async function dashboardController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  fastify.get("/stats", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const organizationId = q.organizationId as string;
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const stats = await DashboardService.getDashboardStats(
      organizationId,
      actorUserId,
    );
    return reply.send(stats);
  });

  fastify.get("/revenue-by-platform", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const query = revenueByPlatformQuerySchema.parse(q);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getRevenueByPlatform(
      query,
      actorUserId,
    );
    return reply.send(result);
  });

  fastify.get("/content-performance", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const query = contentPerformanceQuerySchema.parse(q);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getContentPerformance(
      query,
      actorUserId,
    );
    return reply.send(result);
  });

  fastify.get("/upcoming-content", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const query = upcomingContentQuerySchema.parse(q);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getUpcomingContent(
      query,
      actorUserId,
    );
    return reply.send(result);
  });

  fastify.get("/pending-tasks", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const query = pendingTasksQuerySchema.parse(q);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getPendingTasks(query, actorUserId);
    return reply.send(result);
  });

  fastify.get("/recent-activity", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const query = recentActivityQuerySchema.parse(q);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getRecentActivity(query, actorUserId);
    return reply.send(result);
  });

  fastify.get("/revenue-trend", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const query = revenueTrendQuerySchema.parse(q);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getRevenueTrend(query, actorUserId);
    return reply.send(result);
  });

  fastify.get("/tasks-distribution", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const organizationId = q.organizationId as string;
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getTasksDistribution(
      organizationId,
      actorUserId,
    );
    return reply.send(result);
  });

  fastify.get("/content-by-status", async (request, reply) => {
    guard(request);
    const q = request.query as any;
    const organizationId = q.organizationId as string;
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    const result = await DashboardService.getContentByStatus(
      organizationId,
      actorUserId,
    );
    return reply.send(result);
  });
}
