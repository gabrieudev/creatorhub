import { db } from "@CreatorHub/db";
import {
  auditLogInApp,
  contentItemsInApp,
  organizationMembersInApp,
  revenueEntriesInApp,
  tasksInApp,
  usersInApp,
} from "@CreatorHub/db/schema/schema";
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  gte,
  inArray,
  lte,
  sql,
  sum,
} from "drizzle-orm";
import type {
  ContentByStatus,
  ContentPerformance,
  DashboardStats,
  PendingTasks,
  RecentActivity,
  RevenueByPlatform,
  RevenueTrend,
  TasksDistribution,
  UpcomingContent,
} from "./dashboard.dto";

export const DashboardRepository = {
  async getDashboardStats(organizationId: string): Promise<DashboardStats> {
    // Total revenue
    const totalRevenueResult = await db
      .select({ total: sum(revenueEntriesInApp.amount) })
      .from(revenueEntriesInApp)
      .where(eq(revenueEntriesInApp.organizationId, organizationId))
      .execute();
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Monthly revenue (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyRevenueResult = await db
      .select({ total: sum(revenueEntriesInApp.amount) })
      .from(revenueEntriesInApp)
      .where(
        and(
          eq(revenueEntriesInApp.organizationId, organizationId),
          between(
            revenueEntriesInApp.receivedAt,
            startOfMonth.toISOString(),
            endOfMonth.toISOString(),
          ),
        ),
      )
      .execute();
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // Active content (published in last 30 days)
    const activeContentResult = await db
      .select({ count: count() })
      .from(contentItemsInApp)
      .where(
        and(
          eq(contentItemsInApp.organizationId, organizationId),
          eq(contentItemsInApp.status, "publicado"),
          gte(
            contentItemsInApp.publishedAt,
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          ),
        ),
      )
      .execute();
    const activeContent = activeContentResult[0]?.count;

    // Pending tasks
    const pendingTasksResult = await db
      .select({ count: count() })
      .from(tasksInApp)
      .where(
        and(
          eq(tasksInApp.organizationId, organizationId),
          inArray(tasksInApp.status, ["todo", "in_progress", "blocked"]),
        ),
      )
      .execute();
    const pendingTasks = pendingTasksResult[0]?.count;

    // Team members
    const teamMembersResult = await db
      .select({ count: count() })
      .from(organizationMembersInApp)
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.flActive, true),
        ),
      )
      .execute();
    const teamMembers = teamMembersResult[0]?.count;

    // Upcoming publications (scheduled for next 7 days)
    const upcomingPublicationsResult = await db
      .select({ count: count() })
      .from(contentItemsInApp)
      .where(
        and(
          eq(contentItemsInApp.organizationId, organizationId),
          eq(contentItemsInApp.status, "agendado"),
          gte(contentItemsInApp.scheduledAt, new Date().toISOString()),
          lte(
            contentItemsInApp.scheduledAt,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          ),
        ),
      )
      .execute();
    const upcomingPublications = upcomingPublicationsResult[0]?.count;

    // Revenue growth (compare current month with previous month)
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    const lastMonthRevenueResult = await db
      .select({ total: sum(revenueEntriesInApp.amount) })
      .from(revenueEntriesInApp)
      .where(
        and(
          eq(revenueEntriesInApp.organizationId, organizationId),
          between(
            revenueEntriesInApp.receivedAt,
            startOfLastMonth.toISOString(),
            endOfLastMonth.toISOString(),
          ),
        ),
      )
      .execute();
    const lastMonthRevenue = Number(lastMonthRevenueResult[0]?.total || 0);

    const revenueGrowth =
      lastMonthRevenue === 0
        ? 0
        : ((Number(monthlyRevenue) - lastMonthRevenue) / lastMonthRevenue) *
          100;

    // Task completion rate (tasks completed in last 30 days vs total tasks created in last 30 days)
    const startOfLast30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const doneTasksResult = await db
      .select({ count: count() })
      .from(tasksInApp)
      .where(
        and(
          eq(tasksInApp.organizationId, organizationId),
          eq(tasksInApp.status, "done"),
          gte(tasksInApp.completedAt, startOfLast30Days.toISOString()),
        ),
      )
      .execute();
    const doneTasks = doneTasksResult[0]?.count;

    const totalTasksLast30DaysResult = await db
      .select({ count: count() })
      .from(tasksInApp)
      .where(
        and(
          eq(tasksInApp.organizationId, organizationId),
          gte(tasksInApp.createdAt, startOfLast30Days.toISOString()),
        ),
      )
      .execute();
    const totalTasksLast30Days = totalTasksLast30DaysResult[0]?.count;

    const taskCompletion =
      totalTasksLast30Days === 0
        ? 0
        : (Number(doneTasks) / Number(totalTasksLast30Days)) * 100;

    return {
      totalRevenue: Number(totalRevenue),
      monthlyRevenue: Number(monthlyRevenue),
      activeContent: activeContent ?? 0,
      pendingTasks: pendingTasks ?? 0,
      teamMembers: teamMembers ?? 0,
      upcomingPublications: upcomingPublications ?? 0,
      revenueGrowth: Number(revenueGrowth.toFixed(2)),
      taskCompletion: Number(taskCompletion.toFixed(2)),
    };
  },

  async getRevenueByPlatform(
    organizationId: string,
    period: "week" | "month" | "quarter" | "year",
  ): Promise<RevenueByPlatform> {
    // Calculate date range based on period
    let startDate: Date;
    const endDate = new Date();

    switch (period) {
      case "week":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "quarter":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "year":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Revenue by platform in period
    const revenueByPlatform = await db
      .select({
        platform: revenueEntriesInApp.platform,
        amount: sum(revenueEntriesInApp.amount),
      })
      .from(revenueEntriesInApp)
      .where(
        and(
          eq(revenueEntriesInApp.organizationId, organizationId),
          between(
            revenueEntriesInApp.receivedAt,
            startDate.toISOString(),
            endDate.toISOString(),
          ),
        ),
      )
      .groupBy(revenueEntriesInApp.platform)
      .execute();

    // Total revenue in period
    const totalRevenueResult = await db
      .select({ total: sum(revenueEntriesInApp.amount) })
      .from(revenueEntriesInApp)
      .where(
        and(
          eq(revenueEntriesInApp.organizationId, organizationId),
          between(
            revenueEntriesInApp.receivedAt,
            startDate.toISOString(),
            endDate.toISOString(),
          ),
        ),
      )
      .execute();
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Calculate growth compared to previous period
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (period) {
      case "week":
        previousStartDate = new Date(
          startDate.getTime() - 7 * 24 * 60 * 60 * 1000,
        );
        previousEndDate = new Date(startDate.getTime());
        break;
      case "month":
        previousStartDate = new Date(startDate.getTime());
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        previousEndDate = new Date(startDate.getTime());
        break;
      case "quarter":
        previousStartDate = new Date(startDate.getTime());
        previousStartDate.setMonth(previousStartDate.getMonth() - 3);
        previousEndDate = new Date(startDate.getTime());
        break;
      case "year":
        previousStartDate = new Date(startDate.getTime());
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        previousEndDate = new Date(startDate.getTime());
        break;
    }

    // Previous period revenue by platform
    const previousRevenueByPlatform = await db
      .select({
        platform: revenueEntriesInApp.platform,
        amount: sum(revenueEntriesInApp.amount),
      })
      .from(revenueEntriesInApp)
      .where(
        and(
          eq(revenueEntriesInApp.organizationId, organizationId),
          between(
            revenueEntriesInApp.receivedAt,
            previousStartDate!.toISOString(),
            previousEndDate!.toISOString(),
          ),
        ),
      )
      .groupBy(revenueEntriesInApp.platform)
      .execute();

    const previousRevenueMap = new Map(
      previousRevenueByPlatform.map((item) => [
        item.platform,
        item.amount || 0,
      ]),
    );

    const result = revenueByPlatform.map((item) => {
      const previousAmount = previousRevenueMap.get(item.platform) || 0;
      const currentAmount = item.amount || 0;
      const growth =
        previousAmount === 0
          ? 0
          : ((Number(currentAmount) - Number(previousAmount)) /
              Number(previousAmount)) *
            100;

      return {
        platform: item.platform as any,
        amount: Number(currentAmount),
        percentage:
          totalRevenue === 0
            ? 0
            : (Number(currentAmount) / Number(totalRevenue)) * 100,
        growth: Number(growth.toFixed(2)),
      };
    });

    // Add missing platforms with zero values
    const allPlatforms: Array<
      "youtube" | "tiktok" | "instagram" | "twitch" | "facebook" | "other"
    > = ["youtube", "tiktok", "instagram", "twitch", "facebook", "other"];

    return allPlatforms.map((platform) => {
      const existing = result.find((r) => r.platform === platform);
      return (
        existing || {
          platform,
          amount: 0,
          percentage: 0,
          growth: 0,
        }
      );
    });
  },

  async getContentPerformance(
    organizationId: string,
    limit: number,
    orderBy: "revenue" | "views" | "engagement",
    page: number,
  ): Promise<ContentPerformance> {
    const offset = (page - 1) * limit;

    // First, get revenue per content item
    const revenueSubquery = db
      .select({
        contentItemId: revenueEntriesInApp.contentItemId,
        totalRevenue: sum(revenueEntriesInApp.amount).as("total_revenue"),
      })
      .from(revenueEntriesInApp)
      .where(eq(revenueEntriesInApp.organizationId, organizationId))
      .groupBy(revenueEntriesInApp.contentItemId)
      .as("revenue");

    const contentPerformance = await db
      .select({
        id: contentItemsInApp.id,
        title: contentItemsInApp.title,
        platform: contentItemsInApp.platform,
        revenue: revenueSubquery.totalRevenue,
        views:
          sql`COALESCE((${contentItemsInApp.metadata}->>'views')::integer, 0)`.as(
            "views",
          ),
        engagement:
          sql`COALESCE((${contentItemsInApp.metadata}->>'engagement')::float, 0)`.as(
            "engagement",
          ),
        status: contentItemsInApp.status,
        publishedAt: contentItemsInApp.publishedAt,
      })
      .from(contentItemsInApp)
      .leftJoin(
        revenueSubquery,
        eq(contentItemsInApp.id, revenueSubquery.contentItemId),
      )
      .where(eq(contentItemsInApp.organizationId, organizationId))
      .orderBy(
        desc(
          sql`${
            orderBy === "revenue"
              ? revenueSubquery.totalRevenue
              : orderBy === "views"
                ? sql`views`
                : sql`engagement`
          }`,
        ),
      )
      .limit(limit)
      .offset(offset)
      .execute();

    return contentPerformance.map((item) => ({
      id: item.id,
      title: item.title,
      platform: item.platform as any,
      revenue: Number(item.revenue || 0),
      views: Number(item.views || 0),
      engagement: Number(item.engagement || 0),
      status: item.status as any,
      published_at: item.publishedAt ? item.publishedAt : null,
    }));
  },

  async getUpcomingContent(
    organizationId: string,
    days: number,
    page: number,
    limit: number,
  ): Promise<UpcomingContent> {
    const offset = (page - 1) * limit;
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const upcomingContent = await db
      .select({
        id: contentItemsInApp.id,
        title: contentItemsInApp.title,
        platform: contentItemsInApp.platform,
        scheduledAt: contentItemsInApp.scheduledAt,
        status: contentItemsInApp.status,
        assignedTo: usersInApp.name,
      })
      .from(contentItemsInApp)
      .leftJoin(usersInApp, eq(contentItemsInApp.createdBy, usersInApp.id))
      .where(
        and(
          eq(contentItemsInApp.organizationId, organizationId),
          inArray(contentItemsInApp.status, [
            "agendado",
            "pronto",
            "edicao",
            "roteiro",
            "gravacao",
          ]),
          gte(contentItemsInApp.scheduledAt, new Date().toISOString()),
          lte(contentItemsInApp.scheduledAt, endDate.toISOString()),
        ),
      )
      .orderBy(asc(contentItemsInApp.scheduledAt))
      .limit(limit)
      .offset(offset)
      .execute();

    return upcomingContent.map((item) => ({
      id: item.id,
      title: item.title,
      platform: item.platform as any,
      scheduled_at: item.scheduledAt ? item.scheduledAt : null,
      status: item.status as any,
      assigned_to: item.assignedTo,
    }));
  },

  async getPendingTasks(
    organizationId: string,
    statuses: readonly (
      | "todo"
      | "in_progress"
      | "blocked"
      | "done"
      | "archived"
    )[],
    page: number,
    limit: number,
  ): Promise<PendingTasks> {
    const offset = (page - 1) * limit;

    const pendingTasks = await db
      .select({
        id: tasksInApp.id,
        title: tasksInApp.title,
        status: tasksInApp.status,
        priority: tasksInApp.priority,
        dueDate: tasksInApp.dueDate,
        assignedTo: {
          id: organizationMembersInApp.userId,
          name: usersInApp.name,
        },
        contentItem: {
          id: contentItemsInApp.id,
          title: contentItemsInApp.title,
        },
      })
      .from(tasksInApp)
      .leftJoin(
        organizationMembersInApp,
        eq(tasksInApp.assignedTo, organizationMembersInApp.id),
      )
      .leftJoin(usersInApp, eq(organizationMembersInApp.userId, usersInApp.id))
      .leftJoin(
        contentItemsInApp,
        eq(tasksInApp.contentItemId, contentItemsInApp.id),
      )
      .where(
        and(
          eq(tasksInApp.organizationId, organizationId),
          inArray(tasksInApp.status, statuses),
        ),
      )
      .orderBy(desc(tasksInApp.priority), asc(tasksInApp.dueDate))
      .limit(limit)
      .offset(offset)
      .execute();

    return pendingTasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status as any,
      priority: task.priority ?? 0,
      due_date: task.dueDate ? task.dueDate : null,
      assigned_to: task.assignedTo?.id
        ? {
            id: task.assignedTo.id,
            name: task.assignedTo.name ?? "",
          }
        : null,
      content_item: task.contentItem?.id
        ? {
            id: task.contentItem.id,
            title: task.contentItem.title,
          }
        : null,
    }));
  },

  async getRecentActivity(
    organizationId: string,
    limit: number,
    page: number,
  ): Promise<RecentActivity> {
    const offset = (page - 1) * limit;

    const recentActivity = await db
      .select({
        id: auditLogInApp.id,
        user: {
          id: usersInApp.id,
          name: usersInApp.name,
          image: usersInApp.image,
        },
        action: auditLogInApp.action,
        targetType: auditLogInApp.tableName,
        targetId: auditLogInApp.recordId,
        timestamp: auditLogInApp.createdAt,
        metadata: auditLogInApp.diff,
      })
      .from(auditLogInApp)
      .leftJoin(
        usersInApp,
        sql`${auditLogInApp.actorUserId}::uuid = ${usersInApp.id}::uuid`,
      )
      .where(sql`${auditLogInApp.organizationId} = ${organizationId}::uuid`)
      .orderBy(desc(auditLogInApp.createdAt))
      .limit(limit)
      .offset(offset)
      .execute();

    // Get target names based on table
    const result = await Promise.all(
      recentActivity.map(async (activity) => {
        let targetName = "";

        if (activity.targetId) {
          switch (activity.targetType) {
            case "content_items":
              const content = await db
                .select({ title: contentItemsInApp.title })
                .from(contentItemsInApp)
                .where(eq(contentItemsInApp.id, activity.targetId))
                .execute();
              targetName = content[0]?.title || "";
              break;
            case "tasks":
              const task = await db
                .select({ title: tasksInApp.title })
                .from(tasksInApp)
                .where(eq(tasksInApp.id, activity.targetId))
                .execute();
              targetName = task[0]?.title || "";
              break;
            case "revenue_entries":
              const revenue = await db
                .select({
                  externalReference: revenueEntriesInApp.externalReference,
                })
                .from(revenueEntriesInApp)
                .where(eq(revenueEntriesInApp.id, activity.targetId))
                .execute();
              targetName = revenue[0]?.externalReference || "";
              break;
          }
        }

        return {
          id: activity.id.toString(),
          user: {
            id: activity.user?.id || "",
            name: activity.user?.name || "System",
            image: activity.user?.image || null,
          },
          action: activity.action.toLowerCase() as
            | "created"
            | "updated"
            | "deleted",
          target_type: activity.targetType,
          target_id: activity.targetId?.toString() || "",
          target_name: targetName,
          timestamp: activity.timestamp ?? "",
          metadata: activity.metadata ?? {},
        };
      }),
    );

    return result;
  },

  async getRevenueTrend(
    organizationId: string,
    range: "day" | "week" | "month" | "quarter",
    period: number,
  ): Promise<RevenueTrend> {
    // Generate time series based on range and period
    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case "day":
        startDate.setDate(startDate.getDate() - period);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - period * 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - period);
        break;
      case "quarter":
        startDate.setMonth(startDate.getMonth() - period * 3);
        break;
    }

    // Group by date range
    let dateFormat: string;
    switch (range) {
      case "day":
        dateFormat = "YYYY-MM-DD";
        break;
      case "week":
        dateFormat = "IYYY-IW";
        break;
      case "month":
        dateFormat = "YYYY-MM";
        break;
      case "quarter":
        dateFormat = "YYYY-Q";
        break;
    }

    const periodExpr = sql<string>`
  TO_CHAR(${revenueEntriesInApp.receivedAt}, '${sql.raw(dateFormat)}')
`;

    const revenueTrend = await db
      .select({
        period: periodExpr,
        revenue: sum(revenueEntriesInApp.amount),
      })
      .from(revenueEntriesInApp)
      .where(
        and(
          eq(revenueEntriesInApp.organizationId, organizationId),
          sql`${revenueEntriesInApp.receivedAt}::timestamptz BETWEEN ${startDate} AND ${endDate}`,
        ),
      )
      .groupBy(periodExpr)
      .orderBy(periodExpr)
      .execute();

    // Calculate growth
    const result: RevenueTrend = [];
    for (let i = 0; i < revenueTrend.length; i++) {
      const current = revenueTrend[i];
      const previous = revenueTrend[i - 1];
      const growth = previous
        ? ((Number(current?.revenue) - Number(previous.revenue)) /
            Number(previous.revenue)) *
          100
        : null;

      result.push({
        period: current?.period || "",
        revenue: Number(current?.revenue || 0),
        growth: growth ? Number(growth.toFixed(2)) : null,
      });
    }

    return result;
  },

  async getTasksDistribution(
    organizationId: string,
  ): Promise<TasksDistribution> {
    const tasksDistribution = await db
      .select({
        status: tasksInApp.status,
        count: count(),
      })
      .from(tasksInApp)
      .where(eq(tasksInApp.organizationId, organizationId))
      .groupBy(tasksInApp.status)
      .execute();

    const result: TasksDistribution = {
      todo: 0,
      in_progress: 0,
      blocked: 0,
      done: 0,
      archived: 0,
    };

    tasksDistribution.forEach((item) => {
      const status = item.status as keyof TasksDistribution;
      result[status] = item.count;
    });

    return result;
  },

  async getContentByStatus(organizationId: string): Promise<ContentByStatus> {
    const contentByStatus = await db
      .select({
        status: contentItemsInApp.status,
        count: count(),
      })
      .from(contentItemsInApp)
      .where(eq(contentItemsInApp.organizationId, organizationId))
      .groupBy(contentItemsInApp.status)
      .execute();

    const result: ContentByStatus = {
      idea: 0,
      roteiro: 0,
      gravacao: 0,
      edicao: 0,
      pronto: 0,
      agendado: 0,
      publicado: 0,
      arquivado: 0,
    };

    contentByStatus.forEach((item) => {
      const status = item.status as keyof ContentByStatus;
      result[status] = item.count;
    });

    return result;
  },
};
