"use client";

import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenuePoint {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenuePoint[];
  timeRange: "week" | "month" | "quarter";
}

export default function RevenueChart({ data, timeRange }: RevenueChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value as number;
      return (
        <div
          className="bg-background p-3 border rounded-lg shadow-lg"
          style={{ minWidth: 120 }}
        >
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-green-600 dark:text-green-400 font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const gridColor = isDark ? "#374151" : "#E5E7EB";
  const textColor = isDark ? "#9CA3AF" : "#6B7280";

  const tickTargets: Record<string, number> = {
    day: 7,
    week: 6,
    month: 7,
    quarter: 4,
  };

  const target = tickTargets[timeRange] ?? 7;
  const pointCount = data.length || 0;

  const interval =
    pointCount <= target || pointCount === 0
      ? 0
      : Math.ceil(pointCount / target) - 1;

  const rotateAngle = pointCount > 10 ? -45 : 0;
  const textAnchor = pointCount > 10 ? "end" : "middle";
  const dx = pointCount > 10 ? -6 : 0;

  // Formata X axis labels com base no timeRange.
  function tickFormatterX(value: string) {
    if (!value) return value;

    if (timeRange === "month") {
      return value;
    }

    if (timeRange === "week") {
      if (value.startsWith("Sem") || value.includes("Sem")) return value;
      const m = value.match(/^(\d{4})-(\d{2})$/);
      if (m) return `Sem ${m[2]}/${m[1]}`;
      return value;
    }

    if (timeRange === "quarter") {
      const q1 = value.match(/^(\d{4})-Q([1-4])$/i);
      if (q1) return `Q${q1[2]}/${q1[1]}`;
      const q2 = value.match(/^(\d{4})-([1-4])$/);
      if (q2) return `Q${q2[2]}/${q2[1]}`;
      return value;
    }

    return value;
  }

  // se valores grandes, mostrar em k (ex: R$12k)
  function yTickFormatter(value: number) {
    if (Math.abs(value) >= 1_000_000) {
      return `R$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      const v = +(value / 1000).toFixed(1);

      const n = v.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      return `R$${n}k`;
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="h-75">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenueDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            tickFormatter={tickFormatterX}
            interval={interval}
            tickMargin={8}
            angle={rotateAngle}
            textAnchor={textAnchor as any}
            dx={dx}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            tickFormatter={yTickFormatter}
            domain={["dataMin", "dataMax"]}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke={isDark ? "#34D399" : "#10B981"}
            strokeWidth={3}
            fill={isDark ? "url(#colorRevenueDark)" : "url(#colorRevenue)"}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke={isDark ? "#059669" : "#059669"}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
