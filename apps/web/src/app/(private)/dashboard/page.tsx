"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  MessageSquare,
  MoreVertical,
  Plus,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import {
  contentPerformance,
  dashboardStats,
  recentActivity,
  revenueByPlatform,
  upcomingContent,
} from "./mocks";
import { ContentPlatform, ContentStatus, TaskStatus } from "./types";
import { useSession } from "@/providers/auth-provider";

import ActivityFeed from "./components/ActivityFeed";
import PlatformDistribution from "./components/PlatformDistribution";
import RevenueChart from "./components/RevenueChart";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
  iconColor: string;
  iconBgColor: string;
  delay: number;
}

function StatCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  iconColor,
  iconBgColor,
  delay,
}: StatCardProps) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="border hover:shadow-md transition-all h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${iconBgColor} ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge
              variant="outline"
              className={`${isPositive ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}
            >
              {change}
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
          <p className="text-muted-foreground text-sm">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export const revenueTrend = [
  { month: "Jul", revenue: 12000 },
  { month: "Ago", revenue: 13500 },
  { month: "Set", revenue: 15800 },
  { month: "Out", revenue: 18200 },
  { month: "Nov", revenue: 21000 },
  { month: "Dez", revenue: 24500 },
  { month: "Jan", revenue: 28450 },
];

export const platformColors: Record<ContentPlatform, string> = {
  [ContentPlatform.YOUTUBE]: "#FF0000",
  [ContentPlatform.TIKTOK]: "#000000",
  [ContentPlatform.INSTAGRAM]: "#E4405F",
  [ContentPlatform.TWITCH]: "#9146FF",
  [ContentPlatform.FACEBOOK]: "#1877F2",
  [ContentPlatform.OTHER]: "#6B7280",
};

export const statusColors: Record<ContentStatus, string> = {
  [ContentStatus.IDEA]: "#9CA3AF",
  [ContentStatus.SCRIPT]: "#3B82F6",
  [ContentStatus.RECORDING]: "#8B5CF6",
  [ContentStatus.EDITING]: "#F59E0B",
  [ContentStatus.READY]: "#10B981",
  [ContentStatus.SCHEDULED]: "#6366F1",
  [ContentStatus.PUBLISHED]: "#059669",
  [ContentStatus.ARCHIVED]: "#6B7280",
};

export const taskStatusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "#9CA3AF",
  [TaskStatus.IN_PROGRESS]: "#3B82F6",
  [TaskStatus.BLOCKED]: "#EF4444",
  [TaskStatus.DONE]: "#10B981",
  [TaskStatus.ARCHIVED]: "#6B7280",
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const { session } = useSession();

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="max-w-7xl mx-auto"
      >
        {/* Animação de entrada */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Olá, {session?.user?.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                Aqui está o resumo do seu CreatorHub hoje
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-35 md:w-45">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Novo Conteúdo</span>
                <span className="inline sm:hidden">Novo</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Cards de Estatísticas */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            title="Receita Total"
            value={formatCurrency(dashboardStats.totalRevenue)}
            change={formatPercentage(dashboardStats.revenueGrowth)}
            isPositive={true}
            icon={DollarSign}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            delay={0}
          />
          <StatCard
            title="Receita do Mês"
            value={formatCurrency(dashboardStats.monthlyRevenue)}
            change="+15.3% vs mês anterior"
            isPositive={true}
            icon={TrendingUp}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            delay={0.1}
          />
          <StatCard
            title="Conteúdos em Produção"
            value={dashboardStats.activeContent.toString()}
            change={`${dashboardStats.upcomingPublications} agendados`}
            isPositive={true}
            icon={Video}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            delay={0.2}
          />
          <StatCard
            title="Tarefas Pendentes"
            value={dashboardStats.pendingTasks.toString()}
            change={`${dashboardStats.taskCompletion}% completado`}
            isPositive={dashboardStats.taskCompletion >= 70}
            icon={CheckCircle}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBgColor="bg-amber-100 dark:bg-amber-900/30"
            delay={0.3}
          />
        </motion.div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Coluna esquerda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de Receita */}
            <motion.div variants={fadeInUp}>
              <Card className="h-120">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Desempenho de Receita
                      </CardTitle>
                      <CardDescription>
                        Receita mensal e tendências
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedPlatform}
                        onValueChange={setSelectedPlatform}
                      >
                        <SelectTrigger className="w-60">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas plataformas</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="twitch">Twitch</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <RevenueChart data={revenueTrend} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Conteúdo em Destaque e Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance de Conteúdo */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Conteúdo em Destaque
                    </CardTitle>
                    <CardDescription>
                      Conteúdo com melhor performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contentPerformance.slice(0, 4).map((content, index) => (
                        <motion.div
                          key={content.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${platformColors[content.platform]}20`,
                              color: platformColors[content.platform],
                            }}
                          >
                            {content.platform === ContentPlatform.YOUTUBE &&
                              "▶️"}
                            {content.platform === ContentPlatform.TIKTOK &&
                              "🎵"}
                            {content.platform === ContentPlatform.INSTAGRAM &&
                              "📸"}
                            {content.platform === ContentPlatform.TWITCH &&
                              "🎮"}
                            {content.platform === ContentPlatform.FACEBOOK &&
                              "👥"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-foreground">
                              {content.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{
                                  backgroundColor: `${statusColors[content.status]}15`,
                                  borderColor: statusColors[content.status],
                                  color: statusColors[content.status],
                                }}
                              >
                                {content.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {content.views.toLocaleString()} views
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(content.revenue)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {content.engagement}% eng.
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4">
                      Ver todos os conteúdos
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Próximos Conteúdos */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Próximas Publicações
                    </CardTitle>
                    <CardDescription>
                      Conteúdo agendado e em produção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingContent.map((content, index) => (
                        <motion.div
                          key={content.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${platformColors[content.platform]}20`,
                            }}
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  platformColors[content.platform],
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-foreground">
                              {content.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  content.scheduled_at,
                                ).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              backgroundColor: `${statusColors[content.status]}15`,
                              borderColor: statusColors[content.status],
                              color: statusColors[content.status],
                            }}
                          >
                            {content.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4">
                      Ver calendário completo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="space-y-6">
            {/* Distribuição de Receita */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Receita por Plataforma
                  </CardTitle>
                  <CardDescription>Distribuição deste mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <PlatformDistribution
                    data={revenueByPlatform}
                    platformColors={platformColors}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Atividades Recentes */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ActivityFeed activities={recentActivity.slice(0, 5)} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Seção de Tarefas */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">Tarefas Pendentes</CardTitle>
                  <CardDescription>
                    Gerencie suas atividades e prazos
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    status: "Pendente",
                    tasks: 4,
                    color: "bg-gray-100 dark:bg-gray-800",
                    textColor: "text-gray-600 dark:text-gray-300",
                  },
                  {
                    status: "Em Progresso",
                    tasks: 5,
                    color: "bg-blue-100 dark:bg-blue-900/30",
                    textColor: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    status: "Revisão",
                    tasks: 3,
                    color: "bg-amber-100 dark:bg-amber-900/30",
                    textColor: "text-amber-600 dark:text-amber-400",
                  },
                ].map((column, colIndex) => (
                  <motion.div
                    key={column.status}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: colIndex * 0.1 }}
                    className="space-y-3"
                  >
                    <div className={`p-3 rounded-lg ${column.color}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${column.textColor}`}>
                          {column.status}
                        </span>
                        <Badge variant="secondary" className={column.textColor}>
                          {column.tasks}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: column.tasks }).map(
                        (_, taskIndex) => (
                          <motion.div
                            key={taskIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: colIndex * 0.1 + taskIndex * 0.05,
                            }}
                            whileHover={{ y: -2 }}
                            className="p-4 rounded-lg border hover:shadow-sm transition-all cursor-pointer bg-card"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-foreground">
                                Tarefa {colIndex + 1}.{taskIndex + 1}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Descrição da tarefa aqui...
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>Vence em 2 dias</span>
                              </div>
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-3 w-3 text-primary" />
                              </div>
                            </div>
                          </motion.div>
                        ),
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
