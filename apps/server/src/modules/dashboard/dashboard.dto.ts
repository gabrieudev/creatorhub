import { z } from "zod";

export const revenueByPlatformQuerySchema = z
  .object({
    organizationId: z.string().uuid(),
    period: z.enum(["week", "month", "quarter", "year"]).default("month"),
  })
  .strict();

export const contentPerformanceQuerySchema = z
  .object({
    organizationId: z.string().uuid(),
    limit: z.coerce.number().int().positive().default(10),
    orderBy: z.enum(["revenue", "views", "engagement"]).default("revenue"),
    page: z.coerce.number().int().positive().default(1),
    platform: z.string().optional(),
    status: z.string().optional(),
  })
  .strict();

export const upcomingContentQuerySchema = z
  .object({
    organizationId: z.string().uuid(),
    days: z.coerce.number().int().positive().default(30),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    platform: z.string().optional(),
  })
  .strict();

export const pendingTasksQuerySchema = z
  .object({
    organizationId: z.string().uuid(),
    status: z.string().default("todo,in_progress,blocked"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    priority: z.coerce.number().int().optional(),
  })
  .strict();

export const recentActivityQuerySchema = z
  .object({
    organizationId: z.string().uuid(),
    limit: z.coerce.number().int().positive().default(20),
    page: z.coerce.number().int().positive().default(1),
    action: z.string().optional(),
    targetType: z.string().optional(),
  })
  .strict();

export const revenueTrendQuerySchema = z
  .object({
    organizationId: z.string().uuid(),
    range: z.enum(["day", "week", "month", "quarter"]).default("month"),
    period: z.coerce.number().int().positive().default(6),
  })
  .strict();

// Tipos de resposta
export type DashboardStats = {
  totalRevenue: number;
  monthlyRevenue: number;
  activeContent: number;
  pendingTasks: number;
  teamMembers: number;
  upcomingPublications: number;
  revenueGrowth: number;
  taskCompletion: number;
};

export type RevenueByPlatform = Array<{
  platform:
    | "youtube"
    | "tiktok"
    | "instagram"
    | "twitch"
    | "facebook"
    | "other";
  amount: number;
  percentage: number;
  growth: number;
}>;

export type ContentPerformance = Array<{
  id: string;
  title: string;
  platform:
    | "youtube"
    | "tiktok"
    | "instagram"
    | "twitch"
    | "facebook"
    | "other";
  revenue: number;
  views: number;
  engagement: number;
  status:
    | "idea"
    | "roteiro"
    | "gravacao"
    | "edicao"
    | "pronto"
    | "agendado"
    | "publicado"
    | "arquivado";
  published_at: string | null;
}>;

export type UpcomingContent = Array<{
  id: string;
  title: string;
  platform:
    | "youtube"
    | "tiktok"
    | "instagram"
    | "twitch"
    | "facebook"
    | "other";
  scheduled_at: string | null;
  status: "agendado" | "pronto" | "edicao" | "roteiro" | "gravacao";
  assigned_to: string | null;
}>;

export type PendingTasks = Array<{
  id: string;
  title: string;
  status: "todo" | "in_progress" | "blocked" | "done" | "archived";
  priority: number;
  due_date: string | null;
  assigned_to: { id: string; name: string } | null;
  content_item: { id: string; title: string } | null;
}>;

export type RecentActivity = Array<{
  id: string;
  user: { id: string; name: string; image: string | null };
  action: "created" | "updated" | "deleted";
  target_type: string;
  target_id: string;
  target_name: string;
  timestamp: string;
  metadata: object;
}>;

export type RevenueTrend = Array<{
  period: string;
  revenue: number;
  growth: number | null;
}>;

export type TasksDistribution = {
  todo: number;
  in_progress: number;
  blocked: number;
  done: number;
  archived: number;
};

export type ContentByStatus = {
  idea: number;
  roteiro: number;
  gravacao: number;
  edicao: number;
  pronto: number;
  agendado: number;
  publicado: number;
  arquivado: number;
};
