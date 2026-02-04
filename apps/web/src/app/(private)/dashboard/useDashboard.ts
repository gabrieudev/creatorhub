"use client";

import api from "@/lib/api";
import { useSession } from "@/providers/auth-provider";
import { ContentPlatform, ContentStatus, TaskStatus } from "@/shared/enums";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export interface RevenueTrend {
  period: string;
  revenue: number;
  growth: number | null;
}

function useSelectedOrganization() {
  const [organizationId, setOrganizationId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("ch_selected_org")
      : null,
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ch_selected_org") {
        setOrganizationId(e.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return organizationId;
}

function addDays(d: Date, days: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
}
function addMonths(d: Date, months: number) {
  const c = new Date(d);
  c.setMonth(c.getMonth() + months);
  return c;
}
function periodKeyForDate(date: Date, range: string) {
  const y = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  switch (range) {
    case "day":
      return `${y}-${mm}-${dd}`;
    case "week": {
      const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
      );

      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil(
        (((d as any) - (yearStart as any)) / 86400000 + 1) / 7,
      );
      return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
    }
    case "month":
      return `${y}-${mm}`;
    case "quarter": {
      const q = Math.floor(date.getMonth() / 3) + 1;
      return `${y}-Q${q}`;
    }
    default:
      return `${y}-${mm}`;
  }
}

function normalizeBackendPeriod(period: string, range: string) {
  if (!period) return period;

  switch (range) {
    case "month": {
      const m = period.match(/(\d{4})-(\d{2})/);
      if (m) return `${m[1]}-${m[2]}`;
      return period.slice(0, 7);
    }
    case "day": {
      const d = new Date(period);
      if (!Number.isNaN(d.getTime())) {
        const y = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${y}-${mm}-${dd}`;
      }
      return period;
    }
    case "week": {
      const m = period.match(/(\d{4})-(\d{2})/);
      if (m) return `${m[1]}-${m[2]}`;
      return period;
    }
    case "quarter": {
      const mQ = period.match(/(\d{4})-?Q?([1-4])/i);
      if (mQ) return `${mQ[1]}-Q${mQ[2]}`;
      return period;
    }
    default:
      return period;
  }
}

function generatePeriodKeys(start: Date, end: Date, range: string) {
  const keys: string[] = [];
  const s = new Date(start);
  const e = new Date(end);

  if (range === "day") {
    let cur = new Date(s);
    while (cur <= e) {
      keys.push(periodKeyForDate(cur, "day"));
      cur = addDays(cur, 1);
    }
    return keys;
  }

  if (range === "week") {
    let cur = new Date(s);
    const day = cur.getDay();
    const isoMonDelta = (day === 0 ? -6 : 1) - day;
    cur = addDays(cur, isoMonDelta);
    while (cur <= e) {
      keys.push(periodKeyForDate(cur, "week"));
      cur = addDays(cur, 7);
    }
    return keys;
  }

  if (range === "month") {
    let cur = new Date(s.getFullYear(), s.getMonth(), 1);
    const endMonth = new Date(e.getFullYear(), e.getMonth(), 1);
    while (cur <= endMonth) {
      keys.push(periodKeyForDate(cur, "month"));
      cur = addMonths(cur, 1);
    }
    return keys;
  }

  if (range === "quarter") {
    let cur = new Date(s.getFullYear(), Math.floor(s.getMonth() / 3) * 3, 1);
    const endQ = new Date(e.getFullYear(), Math.floor(e.getMonth() / 3) * 3, 1);
    while (cur <= endQ) {
      keys.push(periodKeyForDate(cur, "quarter"));
      cur = addMonths(cur, 3);
    }
    return keys;
  }

  return keys;
}

const monthMap: Record<string, string> = {
  "01": "Jan",
  "02": "Fev",
  "03": "Mar",
  "04": "Abr",
  "05": "Mai",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Set",
  "10": "Out",
  "11": "Nov",
  "12": "Dez",
};

export default function useDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month",
  );
  const { session } = useSession();

  const organizationId = useSelectedOrganization();

  const periodCount = useMemo(() => {
    switch (timeRange) {
      case "week":
        return 12;
      case "month":
        return 7;
      case "quarter":
        return 4;
      default:
        return 7;
    }
  }, [timeRange]);

  const revenueTrendQuery = useQuery<RevenueTrend[]>({
    queryKey: ["revenueTrend", organizationId, timeRange, periodCount],
    enabled: !!organizationId,
    queryFn: async () => {
      const { data } = await api.get("/revenue-trend", {
        params: { organizationId, range: timeRange, period: periodCount },
      });
      return data;
    },
  });

  const revenueTrend = revenueTrendQuery.data ?? [];

  const revenueTrendMap = useMemo(() => {
    const endDate = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case "week":
        startDate.setDate(startDate.getDate() - periodCount * 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - periodCount);
        break;
      case "quarter":
        startDate.setMonth(startDate.getMonth() - periodCount * 3);
        break;
    }

    const keys = generatePeriodKeys(startDate, endDate, timeRange);

    const valueMap = new Map<string, number>();
    for (const row of revenueTrend) {
      const normalized = normalizeBackendPeriod(String(row.period), timeRange);
      valueMap.set(normalized, Number(row.revenue ?? 0));
    }

    const out = keys.map((k) => {
      const revenue = valueMap.get(k) ?? 0;

      let label = k;
      if (timeRange === "month") {
        const parts = k.split("-");
        label = monthMap[parts[1]] ?? k;
      } else if (timeRange === "week") {
        // k = YYYY-WW
        const [y, w] = k.split("-");
        label = `Sem ${w}/${y}`;
      } else if (timeRange === "quarter") {
        // k = YYYY-Qn
        const qMatch = k.match(/(\d{4})-Q([1-4])/);
        if (qMatch) label = `Q${qMatch[2]}/${qMatch[1]}`;
      }

      return { month: label, revenue };
    });

    return out;
  }, [revenueTrend, timeRange, periodCount]);

  const dashboardStats = useQuery<DashboardStats>({
    queryKey: ["dashboardStats", organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      const { data } = await api.get("/stats", { params: { organizationId } });
      return data;
    },
  }).data;

  const revenueByPlatform =
    useQuery<RevenueByPlatform[]>({
      queryKey: ["revenueByPlatform", organizationId, timeRange],
      enabled: !!organizationId,
      queryFn: async () => {
        const { data } = await api.get("/revenue-by-platform", {
          params: { organizationId, period: timeRange },
        });
        return data;
      },
    }).data || [];

  const contentPerformance =
    useQuery<ContentPerformance[]>({
      queryKey: ["contentPerformance", organizationId],
      enabled: !!organizationId,
      queryFn: async () => {
        const { data } = await api.get("/content-performance", {
          params: { organizationId, limit: 10, orderBy: "revenue", page: 1 },
        });
        return data;
      },
    }).data || [];

  const upcomingContent =
    useQuery<UpcomingContent[]>({
      queryKey: ["upcomingContent", organizationId],
      enabled: !!organizationId,
      queryFn: async () => {
        const { data } = await api.get("/upcoming-content", {
          params: { organizationId, days: 30, page: 1, limit: 10 },
        });
        return data;
      },
    }).data || [];

  const pendingTasks =
    useQuery<PendingTask[]>({
      queryKey: ["pendingTasks", organizationId],
      enabled: !!organizationId,
      queryFn: async () => {
        const { data } = await api.get("/pending-tasks", {
          params: {
            organizationId,
            status: "todo,in_progress,blocked",
            page: 1,
            limit: 10,
          },
        });
        return data;
      },
    }).data || [];

  const recentActivity =
    useQuery<RecentActivity[]>({
      queryKey: ["recentActivity", organizationId],
      enabled: !!organizationId,
      queryFn: async () => {
        const { data } = await api.get("/recent-activity", {
          params: { organizationId, limit: 10, page: 1 },
        });
        return data;
      },
    }).data || [];

  const tasksDistribution = useQuery<TasksDistribution>({
    queryKey: ["taskDistribution", organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      const { data } = await api.get("/tasks-distribution", {
        params: { organizationId },
      });
      return data;
    },
  }).data;

  const contentByStatus = useQuery<ContentByStatus>({
    queryKey: ["contentByStatus", organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      const { data } = await api.get("/content-by-status", {
        params: { organizationId },
      });
      return data;
    },
  }).data;

  const platformColors: Record<ContentPlatform, string> = {
    [ContentPlatform.YOUTUBE]: "#FF0000",
    [ContentPlatform.TIKTOK]: "#000000",
    [ContentPlatform.INSTAGRAM]: "#E4405F",
    [ContentPlatform.TWITCH]: "#9146FF",
    [ContentPlatform.FACEBOOK]: "#1877F2",
    [ContentPlatform.OTHER]: "#6B7280",
  };

  const statusColors: Record<ContentStatus, string> = {
    [ContentStatus.IDEA]: "#9CA3AF",
    [ContentStatus.SCRIPT]: "#3B82F6",
    [ContentStatus.RECORDING]: "#8B5CF6",
    [ContentStatus.EDITING]: "#F59E0B",
    [ContentStatus.READY]: "#10B981",
    [ContentStatus.SCHEDULED]: "#6366F1",
    [ContentStatus.PUBLISHED]: "#059669",
    [ContentStatus.ARCHIVED]: "#6B7280",
  };

  const taskStatusColors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: "#9CA3AF",
    [TaskStatus.IN_PROGRESS]: "#3B82F6",
    [TaskStatus.BLOCKED]: "#EF4444",
    [TaskStatus.DONE]: "#10B981",
    [TaskStatus.ARCHIVED]: "#6B7280",
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatPercentage = (value: number) =>
    `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

  const STATUS_CONFIG = {
    todo: {
      label: "Pendente",
      color: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-600 dark:text-gray-300",
    },
    in_progress: {
      label: "Em Progresso",
      color: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    blocked: {
      label: "Bloqueado",
      color: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-600 dark:text-red-400",
    },
    done: {
      label: "Concluído",
      color: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    archived: {
      label: "Arquivado",
      color: "bg-zinc-100 dark:bg-zinc-900/30",
      textColor: "text-zinc-600 dark:text-zinc-400",
    },
  } as const;

  const tasksByStatus = pendingTasks.reduce<Record<string, PendingTask[]>>(
    (acc, task) => {
      acc[task.status] ??= [];
      acc[task.status].push(task);
      return acc;
    },
    {},
  );

  return {
    revenueTrendMap,
    platformColors,
    statusColors,
    taskStatusColors,
    timeRange,
    setTimeRange,
    session,
    fadeInUp,
    staggerChildren,
    formatCurrency,
    formatPercentage,
    dashboardStats,
    revenueByPlatform,
    contentPerformance,
    upcomingContent,
    pendingTasks,
    recentActivity,
    revenueTrend,
    tasksDistribution,
    contentByStatus,
    STATUS_CONFIG,
    tasksByStatus,
  };
}
