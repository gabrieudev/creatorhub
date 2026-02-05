import { parse } from "@/lib/utils";
import { UnauthorizedError } from "../../lib/errors";
import { OrganizationMemberRepository } from "../organization-member/organization-member.repository";
import {
  contentPerformanceQuerySchema,
  pendingTasksQuerySchema,
  recentActivityQuerySchema,
  revenueByPlatformQuerySchema,
  revenueTrendQuerySchema,
  upcomingContentQuerySchema,
} from "./dashboard.dto";
import { DashboardRepository } from "./dashboard.repository";

export const DashboardService = {
  async getDashboardStats(organizationId: string, userId: string) {
    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getDashboardStats(organizationId);
  },

  async getRevenueByPlatform(query: unknown, userId: string) {
    const data = parse(revenueByPlatformQuerySchema, query);

    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      data.organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getRevenueByPlatform(
      data.organizationId,
      data.period,
    );
  },

  async getContentPerformance(query: unknown, userId: string) {
    const data = parse(contentPerformanceQuerySchema, query);

    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      data.organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getContentPerformance(
      data.organizationId,
      data.limit,
      data.orderBy,
      data.page,
    );
  },

  async getUpcomingContent(query: unknown, userId: string) {
    const data = parse(upcomingContentQuerySchema, query);

    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      data.organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getUpcomingContent(
      data.organizationId,
      data.days,
      data.page,
      data.limit,
    );
  },

  async getPendingTasks(query: unknown, userId: string) {
    const data = parse(pendingTasksQuerySchema, query);

    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      data.organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    const allowedStatuses = [
      "todo",
      "in_progress",
      "blocked",
      "done",
      "archived",
    ] as const;
    const statuses = data.status
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is (typeof allowedStatuses)[number] =>
        (allowedStatuses as readonly string[]).includes(s),
      );

    return DashboardRepository.getPendingTasks(
      data.organizationId,
      statuses,
      data.page,
      data.limit,
    );
  },

  async getRecentActivity(query: unknown, userId: string) {
    const data = parse(recentActivityQuerySchema, query);

    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      data.organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getRecentActivity(
      data.organizationId,
      data.limit,
      data.page,
    );
  },

  async getRevenueTrend(query: unknown, userId: string) {
    const data = parse(revenueTrendQuerySchema, query);

    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      data.organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getRevenueTrend(
      data.organizationId,
      data.range,
      data.period,
    );
  },

  async getTasksDistribution(organizationId: string, userId: string) {
    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getTasksDistribution(organizationId);
  },

  async getContentByStatus(organizationId: string, userId: string) {
    const orgMember = await OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      userId,
    );
    if (!orgMember) {
      throw new UnauthorizedError(
        "Você não é membro da organização solicitada",
      );
    }

    return DashboardRepository.getContentByStatus(organizationId);
  },
};
