import { z } from "zod";

export const platformEnum = z.enum([
  "youtube",
  "tiktok",
  "instagram",
  "twitch",
  "facebook",
  "other",
]);
export const periodEnum = z.enum(["week", "month", "quarter", "year"]);
export const rangeEnum = z.enum(["day", "week", "month", "quarter"]);
export const orderByEnum = z.enum(["revenue", "views", "engagement"]);
export const taskStatusEnum = z.enum([
  "todo",
  "in_progress",
  "blocked",
  "done",
  "archived",
]);
export const contentStatusEnum = z.enum([
  "idea",
  "roteiro",
  "gravacao",
  "edicao",
  "pronto",
  "agendado",
  "publicado",
  "arquivado",
]);
export const actionEnum = z.enum(["created", "updated", "deleted"]);

// Query parameter schemas
export const organizationIdQuerySchema = z.object({
  organizationId: z.string().uuid("ID da organização inválido"),
});

export const revenueByPlatformQuerySchema = organizationIdQuerySchema.extend({
  period: periodEnum.default("month"),
});

export const contentPerformanceQuerySchema = organizationIdQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: orderByEnum.default("revenue"),
  page: z.coerce.number().int().min(1).default(1),
  platform: platformEnum.optional(),
  status: contentStatusEnum.optional(),
});

export const upcomingContentQuerySchema = organizationIdQuerySchema.extend({
  days: z.coerce.number().int().min(1).max(365).default(30),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  platform: platformEnum.optional(),
});

export const pendingTasksQuerySchema = organizationIdQuerySchema.extend({
  status: z.string().default("todo,in_progress,blocked"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  priority: z.coerce.number().int().min(0).max(5).optional(),
});

export const recentActivityQuerySchema = organizationIdQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  action: z.string().optional(),
  targetType: z.string().optional(),
});

export const revenueTrendQuerySchema = organizationIdQuerySchema.extend({
  range: rangeEnum.default("month"),
  period: z.coerce.number().int().min(1).max(12).default(6),
});

// Response schemas
export const dashboardStatsSchema = z.object({
  totalRevenue: z.number(),
  monthlyRevenue: z.number(),
  activeContent: z.number(),
  pendingTasks: z.number(),
  teamMembers: z.number(),
  upcomingPublications: z.number(),
  revenueGrowth: z.number(),
  taskCompletion: z.number(),
});

export const revenueByPlatformSchema = z.array(
  z.object({
    platform: platformEnum,
    amount: z.number(),
    percentage: z.number(),
    growth: z.number(),
  }),
);

export const contentPerformanceSchema = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    platform: platformEnum,
    revenue: z.number(),
    views: z.number(),
    engagement: z.number(),
    status: contentStatusEnum,
    published_at: z.string().nullable(),
  }),
);

export const upcomingContentSchema = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    platform: platformEnum,
    scheduled_at: z.string().nullable(),
    status: contentStatusEnum,
    assigned_to: z.string().nullable(),
  }),
);

export const pendingTasksSchema = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    status: taskStatusEnum,
    priority: z.number(),
    due_date: z.string().nullable(),
    assigned_to: z
      .object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
      })
      .nullable(),
    content_item: z
      .object({
        id: z.string(),
        title: z.string(),
        platform: platformEnum,
      })
      .nullable(),
  }),
);

export const recentActivitySchema = z.array(
  z.object({
    id: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable(),
    }),
    action: actionEnum,
    target_type: z.string(),
    target_id: z.string(),
    target_name: z.string(),
    timestamp: z.string(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
);

export const revenueTrendSchema = z.array(
  z.object({
    period: z.string(),
    revenue: z.number(),
    growth: z.number().nullable(),
  }),
);

export const tasksDistributionSchema = z.object({
  todo: z.number(),
  in_progress: z.number(),
  blocked: z.number(),
  done: z.number(),
  archived: z.number(),
});

export const contentByStatusSchema = z.object({
  idea: z.number(),
  roteiro: z.number(),
  gravacao: z.number(),
  edicao: z.number(),
  pronto: z.number(),
  agendado: z.number(),
  publicado: z.number(),
  arquivado: z.number(),
});

// Types
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type RevenueByPlatform = z.infer<typeof revenueByPlatformSchema>;
export type ContentPerformance = z.infer<typeof contentPerformanceSchema>;
export type UpcomingContent = z.infer<typeof upcomingContentSchema>;
export type PendingTasks = z.infer<typeof pendingTasksSchema>;
export type RecentActivity = z.infer<typeof recentActivitySchema>;
export type RevenueTrend = z.infer<typeof revenueTrendSchema>;
export type TasksDistribution = z.infer<typeof tasksDistributionSchema>;
export type ContentByStatus = z.infer<typeof contentByStatusSchema>;
