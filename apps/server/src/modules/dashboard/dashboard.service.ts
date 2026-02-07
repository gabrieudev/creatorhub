import { UnauthorizedError } from "../../lib/errors";
import { OrganizationMemberRepository } from "../organization-member/organization-member.repository";
import {
  contentPerformanceQuerySchema,
  pendingTasksQuerySchema,
  recentActivityQuerySchema,
  revenueByPlatformQuerySchema,
  revenueTrendQuerySchema,
  upcomingContentQuerySchema,
  type ContentByStatus,
  type ContentPerformance,
  type DashboardStats,
  type PendingTasks,
  type RecentActivity,
  type RevenueByPlatform,
  type RevenueTrend,
  type TasksDistribution,
  type UpcomingContent,
} from "./dashboard.dto";
import { DashboardRepository } from "./dashboard.repository";

async function validateOrganizationMembership(
  organizationId: string,
  userId: string,
) {
  const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
    organizationId,
    userId,
  );

  if (!orgMember) {
    throw new UnauthorizedError("Você não é membro da organização solicitada");
  }

  return orgMember;
}

function parseStatusFilter(
  statusFilter: string,
): ("todo" | "in_progress" | "blocked" | "done" | "archived")[] {
  const allowedStatuses = [
    "todo",
    "in_progress",
    "blocked",
    "done",
    "archived",
  ] as const;

  return statusFilter
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is (typeof allowedStatuses)[number] =>
      allowedStatuses.includes(s as any),
    );
}

export const DashboardService = {
  async getDashboardStats(
    organizationId: string,
    userId: string,
  ): Promise<DashboardStats> {
    await validateOrganizationMembership(organizationId, userId);
    return DashboardRepository.getDashboardStats(organizationId);
  },

  async getRevenueByPlatform(
    query: unknown,
    userId: string,
  ): Promise<RevenueByPlatform> {
    const data = revenueByPlatformQuerySchema.parse(query);
    await validateOrganizationMembership(data.organizationId, userId);
    return DashboardRepository.getRevenueByPlatform(
      data.organizationId,
      data.period,
    );
  },

  async getContentPerformance(
    query: unknown,
    userId: string,
  ): Promise<ContentPerformance> {
    const data = contentPerformanceQuerySchema.parse(query);
    await validateOrganizationMembership(data.organizationId, userId);
    return DashboardRepository.getContentPerformance(
      data.organizationId,
      data.limit,
      data.orderBy,
      data.page,
      data.platform,
      data.status,
    );
  },

  async getUpcomingContent(
    query: unknown,
    userId: string,
  ): Promise<UpcomingContent> {
    const data = upcomingContentQuerySchema.parse(query);
    await validateOrganizationMembership(data.organizationId, userId);
    return DashboardRepository.getUpcomingContent(
      data.organizationId,
      data.days,
      data.page,
      data.limit,
      data.platform,
    );
  },

  async getPendingTasks(query: unknown, userId: string): Promise<PendingTasks> {
    const data = pendingTasksQuerySchema.parse(query);
    await validateOrganizationMembership(data.organizationId, userId);

    const statuses = parseStatusFilter(data.status);
    return DashboardRepository.getPendingTasks(
      data.organizationId,
      statuses,
      data.page,
      data.limit,
      data.priority,
    );
  },

  async getRecentActivity(
    query: unknown,
    userId: string,
  ): Promise<RecentActivity> {
    const data = recentActivityQuerySchema.parse(query);
    await validateOrganizationMembership(data.organizationId, userId);
    return DashboardRepository.getRecentActivity(
      data.organizationId,
      data.limit,
      data.page,
      data.action,
      data.targetType,
    );
  },

  async getRevenueTrend(query: unknown, userId: string): Promise<RevenueTrend> {
    const data = revenueTrendQuerySchema.parse(query);
    await validateOrganizationMembership(data.organizationId, userId);
    return DashboardRepository.getRevenueTrend(
      data.organizationId,
      data.range,
      data.period,
    );
  },

  async getTasksDistribution(
    organizationId: string,
    userId: string,
  ): Promise<TasksDistribution> {
    await validateOrganizationMembership(organizationId, userId);
    return DashboardRepository.getTasksDistribution(organizationId);
  },

  async getContentByStatus(
    organizationId: string,
    userId: string,
  ): Promise<ContentByStatus> {
    await validateOrganizationMembership(organizationId, userId);
    return DashboardRepository.getContentByStatus(organizationId);
  },
};
