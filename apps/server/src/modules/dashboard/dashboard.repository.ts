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
  DashboardStats,
  RevenueByPlatform,
  ContentPerformance,
  UpcomingContent,
  PendingTasks,
  RecentActivity,
  RevenueTrend,
  TasksDistribution,
  ContentByStatus,
} from "./dashboard.dto";

type Platform =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "twitch"
  | "facebook"
  | "other";
type Period = "week" | "month" | "quarter" | "year";
type Range = "day" | "week" | "month" | "quarter";
type OrderBy = "revenue" | "views" | "engagement";
type TaskStatus = "todo" | "in_progress" | "blocked" | "done" | "archived";

function calculateDateRange(period: Period): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case "week":
      start.setDate(end.getDate() - 7);
      break;
    case "month":
      start.setMonth(end.getMonth() - 1);
      break;
    case "quarter":
      start.setMonth(end.getMonth() - 3);
      break;
    case "year":
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  return { start, end };
}

function calculatePreviousPeriod(
  start: Date,
  end: Date,
): { start: Date; end: Date } {
  const duration = end.getTime() - start.getTime();

  return {
    start: new Date(start.getTime() - duration),
    end: start,
  };
}

function getDateInterval(range: Range): string {
  switch (range) {
    case "day":
      return "YYYY-MM-DD";
    case "week":
      return "IYYY-IW";
    case "month":
      return "YYYY-MM";
    case "quarter":
      return "YYYY-Q";
    default:
      return "YYYY-MM";
  }
}

export const DashboardRepository = {
  async getDashboardStats(organizationId: string): Promise<DashboardStats> {
    // Receita total
    const [totalRevenueResult] = await db
      .select({ total: sum(revenueEntriesInApp.amount) })
      .from(revenueEntriesInApp)
      .where(eq(revenueEntriesInApp.organizationId, organizationId));

    const totalRevenue = Number(totalRevenueResult?.total || 0);

    // Receita mensal (mês atual)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const [monthlyRevenueResult] = await db
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
      );

    const monthlyRevenue = Number(monthlyRevenueResult?.total || 0);

    // Conteúdo ativo (publicado nos últimos 30 dias)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [activeContentResult] = await db
      .select({ count: count() })
      .from(contentItemsInApp)
      .where(
        and(
          eq(contentItemsInApp.organizationId, organizationId),
          eq(contentItemsInApp.status, "publicado"),
          gte(contentItemsInApp.publishedAt, thirtyDaysAgo.toISOString()),
        ),
      );

    const activeContent = activeContentResult?.count || 0;

    // Tarefas pendentes
    const [pendingTasksResult] = await db
      .select({ count: count() })
      .from(tasksInApp)
      .where(
        and(
          eq(tasksInApp.organizationId, organizationId),
          inArray(tasksInApp.status, ["todo", "in_progress", "blocked"]),
        ),
      );

    const pendingTasks = pendingTasksResult?.count || 0;

    // Membros da equipe
    const [teamMembersResult] = await db
      .select({ count: count() })
      .from(organizationMembersInApp)
      .where(
        and(
          eq(organizationMembersInApp.organizationId, organizationId),
          eq(organizationMembersInApp.flActive, true),
        ),
      );

    const teamMembers = teamMembersResult?.count || 0;

    // Publicações agendadas (programadas para os próximos 7 dias)
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [upcomingPublicationsResult] = await db
      .select({ count: count() })
      .from(contentItemsInApp)
      .where(
        and(
          eq(contentItemsInApp.organizationId, organizationId),
          eq(contentItemsInApp.status, "agendado"),
          gte(contentItemsInApp.scheduledAt, now.toISOString()),
          lte(contentItemsInApp.scheduledAt, nextWeek.toISOString()),
        ),
      );

    const upcomingPublications = upcomingPublicationsResult?.count || 0;

    // Crescimento da receita (mês atual vs mês anterior)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    const [lastMonthRevenueResult] = await db
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
      );

    const lastMonthRevenue = Number(lastMonthRevenueResult?.total || 0);
    const revenueGrowth =
      lastMonthRevenue === 0
        ? 0
        : ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    // Taxa de conclusão de tarefas (tarefas concluídas nos últimos 30 dias vs total de tarefas criadas)
    const [doneTasksResult] = await db
      .select({ count: count() })
      .from(tasksInApp)
      .where(
        and(
          eq(tasksInApp.organizationId, organizationId),
          eq(tasksInApp.status, "done"),
          gte(tasksInApp.completedAt, thirtyDaysAgo.toISOString()),
        ),
      );

    const [totalTasksLast30DaysResult] = await db
      .select({ count: count() })
      .from(tasksInApp)
      .where(
        and(
          eq(tasksInApp.organizationId, organizationId),
          gte(tasksInApp.createdAt, thirtyDaysAgo.toISOString()),
        ),
      );

    const doneTasks = doneTasksResult?.count || 0;
    const totalTasksLast30Days = totalTasksLast30DaysResult?.count || 0;
    const taskCompletion =
      totalTasksLast30Days === 0 ? 0 : (doneTasks / totalTasksLast30Days) * 100;

    return {
      totalRevenue,
      monthlyRevenue,
      activeContent,
      pendingTasks,
      teamMembers,
      upcomingPublications,
      revenueGrowth: Number(revenueGrowth.toFixed(2)),
      taskCompletion: Number(taskCompletion.toFixed(2)),
    };
  },

  async getRevenueByPlatform(
    organizationId: string,
    period: Period,
  ): Promise<RevenueByPlatform> {
    const { start, end } = calculateDateRange(period);
    const { start: prevStart, end: prevEnd } = calculatePreviousPeriod(
      start,
      end,
    );

    // Período atual - receita por plataforma
    const currentRevenue = await db
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
            start.toISOString(),
            end.toISOString(),
          ),
        ),
      )
      .groupBy(revenueEntriesInApp.platform);

    // Período anterior - receita por plataforma
    const previousRevenue = await db
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
            prevStart.toISOString(),
            prevEnd.toISOString(),
          ),
        ),
      )
      .groupBy(revenueEntriesInApp.platform);

    const totalCurrentRevenue = currentRevenue.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    const previousRevenueMap = new Map(
      previousRevenue.map((item) => [item.platform, Number(item.amount || 0)]),
    );

    const allPlatforms: Platform[] = [
      "youtube",
      "tiktok",
      "instagram",
      "twitch",
      "facebook",
      "other",
    ];

    return allPlatforms.map((platform) => {
      const currentItem = currentRevenue.find(
        (item) => item.platform === platform,
      );
      const currentAmount = Number(currentItem?.amount || 0);
      const previousAmount = previousRevenueMap.get(platform) || 0;

      const percentage =
        totalCurrentRevenue === 0
          ? 0
          : (currentAmount / totalCurrentRevenue) * 100;
      const growth =
        previousAmount === 0
          ? 0
          : ((currentAmount - previousAmount) / previousAmount) * 100;

      return {
        platform,
        amount: currentAmount,
        percentage: Number(percentage.toFixed(2)),
        growth: Number(growth.toFixed(2)),
      };
    });
  },

  async getContentPerformance(
    organizationId: string,
    limit: number,
    orderBy: OrderBy,
    page: number,
    platform?: Platform,
    status?:
      | "idea"
      | "roteiro"
      | "gravacao"
      | "edicao"
      | "pronto"
      | "agendado"
      | "publicado"
      | "arquivado",
  ): Promise<ContentPerformance> {
    const offset = (page - 1) * limit;

    // Subconsulta de receita
    const revenueSubquery = db.$with("revenue_by_content").as(
      db
        .select({
          contentItemId: revenueEntriesInApp.contentItemId,
          totalRevenue: sum(revenueEntriesInApp.amount).as("total_revenue"),
        })
        .from(revenueEntriesInApp)
        .where(eq(revenueEntriesInApp.organizationId, organizationId))
        .groupBy(revenueEntriesInApp.contentItemId),
    );

    const conditions = [eq(contentItemsInApp.organizationId, organizationId)];
    if (platform) conditions.push(eq(contentItemsInApp.platform, platform));
    if (status) conditions.push(eq(contentItemsInApp.status, status));

    const content = await db
      .with(revenueSubquery)
      .select({
        id: contentItemsInApp.id,
        title: contentItemsInApp.title,
        platform: contentItemsInApp.platform,
        revenue: revenueSubquery.totalRevenue,
        views: sql<number>`COALESCE((${contentItemsInApp.metadata}->>'views')::integer, 0)`,
        engagement: sql<number>`COALESCE((${contentItemsInApp.metadata}->>'engagement')::float, 0)`,
        status: contentItemsInApp.status,
        publishedAt: contentItemsInApp.publishedAt,
      })
      .from(contentItemsInApp)
      .leftJoin(
        revenueSubquery,
        eq(contentItemsInApp.id, revenueSubquery.contentItemId),
      )
      .where(and(...conditions))
      .orderBy(
        orderBy === "revenue"
          ? desc(revenueSubquery.totalRevenue)
          : orderBy === "views"
            ? desc(sql`views`)
            : desc(sql`engagement`),
      )
      .limit(limit)
      .offset(offset);

    return content.map((item) => ({
      id: item.id,
      title: item.title,
      platform: item.platform as Platform,
      revenue: Number(item.revenue || 0),
      views: item.views,
      engagement: item.engagement,
      status: item.status as any,
      published_at: item.publishedAt || null,
    }));
  },

  async getUpcomingContent(
    organizationId: string,
    days: number,
    page: number,
    limit: number,
    platform?: Platform,
  ): Promise<UpcomingContent> {
    const offset = (page - 1) * limit;
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const conditions = [
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
    ];

    if (platform) {
      conditions.push(eq(contentItemsInApp.platform, platform));
    }

    const content = await db
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
      .where(and(...conditions))
      .orderBy(asc(contentItemsInApp.scheduledAt))
      .limit(limit)
      .offset(offset);

    return content.map((item) => ({
      id: item.id,
      title: item.title,
      platform: item.platform as Platform,
      scheduled_at: item.scheduledAt || null,
      status: item.status as any,
      assigned_to: item.assignedTo,
    }));
  },

  async getPendingTasks(
    organizationId: string,
    statuses: TaskStatus[],
    page: number,
    limit: number,
    priority?: number,
  ): Promise<PendingTasks> {
    const offset = (page - 1) * limit;

    const conditions = [
      eq(tasksInApp.organizationId, organizationId),
      inArray(tasksInApp.status, statuses),
    ];

    if (priority !== undefined) {
      conditions.push(eq(tasksInApp.priority, priority));
    }

    const tasks = await db
      .select({
        id: tasksInApp.id,
        title: tasksInApp.title,
        status: tasksInApp.status,
        priority: tasksInApp.priority,
        dueDate: tasksInApp.dueDate,
        assignedTo: {
          id: organizationMembersInApp.userId,
          name: usersInApp.name,
          image: usersInApp.image,
        },
        contentItem: {
          id: contentItemsInApp.id,
          title: contentItemsInApp.title,
          platform: contentItemsInApp.platform,
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
      .where(and(...conditions))
      .orderBy(desc(tasksInApp.priority), asc(tasksInApp.dueDate))
      .limit(limit)
      .offset(offset);

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status as TaskStatus,
      priority: task.priority ?? 0,
      due_date: task.dueDate || null,
      assigned_to: task.assignedTo?.id
        ? {
            id: task.assignedTo.id,
            name: task.assignedTo.name || "",
            image: task.assignedTo.image || null,
          }
        : null,
      content_item: task.contentItem?.id
        ? {
            id: task.contentItem.id,
            title: task.contentItem.title,
            platform: task.contentItem.platform as Platform,
          }
        : null,
    }));
  },

  async getRecentActivity(
    organizationId: string,
    limit: number,
    page: number,
    action?: string,
    targetType?: string,
  ): Promise<RecentActivity> {
    const offset = (page - 1) * limit;

    const conditions = [
      sql`${auditLogInApp.organizationId} = ${organizationId}::uuid`,
    ];
    if (action) conditions.push(eq(auditLogInApp.action, action));
    if (targetType) conditions.push(eq(auditLogInApp.tableName, targetType));

    const activities = await db
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
      .where(and(...conditions))
      .orderBy(desc(auditLogInApp.createdAt))
      .limit(limit)
      .offset(offset);

    // Obtém os nomes dos alvos para cada atividade
    const result = await Promise.all(
      activities.map(async (activity) => {
        let targetName = "";

        if (activity.targetId) {
          switch (activity.targetType) {
            case "content_items":
              const [content] = await db
                .select({ title: contentItemsInApp.title })
                .from(contentItemsInApp)
                .where(eq(contentItemsInApp.id, activity.targetId))
                .limit(1);
              targetName = content?.title || "";
              break;

            case "tasks":
              const [task] = await db
                .select({ title: tasksInApp.title })
                .from(tasksInApp)
                .where(eq(tasksInApp.id, activity.targetId))
                .limit(1);
              targetName = task?.title || "";
              break;

            case "revenue_entries":
              const [revenue] = await db
                .select({
                  externalReference: revenueEntriesInApp.externalReference,
                })
                .from(revenueEntriesInApp)
                .where(eq(revenueEntriesInApp.id, activity.targetId))
                .limit(1);
              targetName = revenue?.externalReference || "";
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
          timestamp: activity.timestamp || "",
          metadata: activity.metadata || {},
        };
      }),
    );

    return result;
  },

  async getRevenueTrend(
    organizationId: string,
    range: Range,
    period: number,
  ): Promise<RevenueTrend> {
    const endDate = new Date();
    const startDate = new Date();

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

    const format = getDateInterval(range); // ex: 'YYYY-MM'

    let truncUnit;
    switch (range) {
      case "day":
        truncUnit = "day";
        break;
      case "week":
        truncUnit = "week";
        break;
      case "month":
        truncUnit = "month";
        break;
      case "quarter":
        truncUnit = "quarter";
        break;
      default:
        truncUnit = "month";
    }

    const periodExpr = sql<string>`
    TO_CHAR(
      date_trunc(${truncUnit}, ${revenueEntriesInApp.receivedAt}),
      ${format}
    )
  `;

    const revenueData = await db
      .select({
        period: periodExpr,
        revenue: sum(revenueEntriesInApp.amount),
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
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    return revenueData.map((item, index) => {
      const currentRevenue = Number(item.revenue ?? 0);
      const previousRevenue =
        index > 0 ? Number(revenueData[index - 1]?.revenue ?? 0) : 0;

      const growth =
        previousRevenue === 0
          ? null
          : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

      return {
        period: item.period,
        revenue: currentRevenue,
        growth: growth !== null ? Number(growth.toFixed(2)) : null,
      };
    });
  },

  async getTasksDistribution(
    organizationId: string,
  ): Promise<TasksDistribution> {
    const distribution = await db
      .select({
        status: tasksInApp.status,
        count: count(),
      })
      .from(tasksInApp)
      .where(eq(tasksInApp.organizationId, organizationId))
      .groupBy(tasksInApp.status);

    const result: TasksDistribution = {
      todo: 0,
      in_progress: 0,
      blocked: 0,
      done: 0,
      archived: 0,
    };

    distribution.forEach((item) => {
      const status = item.status as keyof TasksDistribution;
      if (status in result) {
        result[status] = item.count;
      }
    });

    return result;
  },

  async getContentByStatus(organizationId: string): Promise<ContentByStatus> {
    const distribution = await db
      .select({
        status: contentItemsInApp.status,
        count: count(),
      })
      .from(contentItemsInApp)
      .where(eq(contentItemsInApp.organizationId, organizationId))
      .groupBy(contentItemsInApp.status);

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

    distribution.forEach((item) => {
      const status = item.status as keyof ContentByStatus;
      if (status in result) {
        result[status] = item.count;
      }
    });

    return result;
  },
};
