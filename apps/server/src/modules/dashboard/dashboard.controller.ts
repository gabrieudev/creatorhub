import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodError } from "zod";
import { BadRequestError, UnauthorizedError } from "../../lib/errors";
import {
  dashboardStatsSchema,
  revenueByPlatformSchema,
  contentPerformanceSchema,
  upcomingContentSchema,
  pendingTasksSchema,
  recentActivitySchema,
  revenueTrendSchema,
  tasksDistributionSchema,
  contentByStatusSchema,
  revenueByPlatformQuerySchema,
  contentPerformanceQuerySchema,
  upcomingContentQuerySchema,
  pendingTasksQuerySchema,
  recentActivityQuerySchema,
  revenueTrendQuerySchema,
  organizationIdQuerySchema,
} from "./dashboard.dto";
import { DashboardService } from "./dashboard.service";

function validateRequest<T>(schema: any, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestError("Dados inválidos: " + error.message);
    }
    throw error;
  }
}

function getUserId(request: any): string {
  const userId = request.session?.user?.id;
  if (!userId) {
    throw new UnauthorizedError("Autenticação necessária");
  }
  return userId;
}

export default async function dashboardController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  // Dashboard stats
  fastify.get("/stats", async (request, reply) => {
    try {
      const query = validateRequest(
        organizationIdQuerySchema,
        request.query,
      ) as { organizationId: string };
      const userId = getUserId(request);

      const stats = await DashboardService.getDashboardStats(
        query.organizationId,
        userId,
      );
      const validatedStats = dashboardStatsSchema.parse(stats);
      return reply.send(validatedStats);
    } catch (error) {
      throw error;
    }
  });

  // Revenue by platform
  fastify.get("/revenue-by-platform", async (request, reply) => {
    try {
      const query = validateRequest(
        revenueByPlatformQuerySchema,
        request.query,
      );
      const userId = getUserId(request);

      const result = await DashboardService.getRevenueByPlatform(query, userId);
      const validatedResult = revenueByPlatformSchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });

  // Content performance
  fastify.get("/content-performance", async (request, reply) => {
    try {
      const query = validateRequest(
        contentPerformanceQuerySchema,
        request.query,
      );
      const userId = getUserId(request);

      const result = await DashboardService.getContentPerformance(
        query,
        userId,
      );
      const validatedResult = contentPerformanceSchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });

  // Upcoming content
  fastify.get("/upcoming-content", async (request, reply) => {
    try {
      const query = validateRequest(upcomingContentQuerySchema, request.query);
      const userId = getUserId(request);

      const result = await DashboardService.getUpcomingContent(query, userId);
      const validatedResult = upcomingContentSchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });

  // Pending tasks
  fastify.get("/pending-tasks", async (request, reply) => {
    try {
      const query = validateRequest(pendingTasksQuerySchema, request.query);
      const userId = getUserId(request);

      const result = await DashboardService.getPendingTasks(query, userId);
      const validatedResult = pendingTasksSchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });

  // Recent activity
  fastify.get("/recent-activity", async (request, reply) => {
    try {
      const query = validateRequest(recentActivityQuerySchema, request.query);
      const userId = getUserId(request);

      const result = await DashboardService.getRecentActivity(query, userId);
      const validatedResult = recentActivitySchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });

  // Revenue trend
  fastify.get("/revenue-trend", async (request, reply) => {
    try {
      const query = validateRequest(revenueTrendQuerySchema, request.query);
      const userId = getUserId(request);

      const result = await DashboardService.getRevenueTrend(query, userId);
      const validatedResult = revenueTrendSchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });

  // Tasks distribution
  fastify.get("/tasks-distribution", async (request, reply) => {
    try {
      const query = validateRequest(
        organizationIdQuerySchema,
        request.query,
      ) as { organizationId: string };
      const userId = getUserId(request);

      const result = await DashboardService.getTasksDistribution(
        query.organizationId,
        userId,
      );
      const validatedResult = tasksDistributionSchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });

  // Content by status
  fastify.get("/content-by-status", async (request, reply) => {
    try {
      const query = validateRequest(
        organizationIdQuerySchema,
        request.query,
      ) as { organizationId: string };
      const userId = getUserId(request);

      const result = await DashboardService.getContentByStatus(
        query.organizationId,
        userId,
      );
      const validatedResult = contentByStatusSchema.parse(result);
      return reply.send(validatedResult);
    } catch (error) {
      throw error;
    }
  });
}
