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
import { ContentPlatform, ContentStatus } from "@/shared/enums";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Facebook,
  Instagram,
  MessageSquare,
  MoreVertical,
  Music,
  Plus,
  Target,
  TrendingUp,
  Twitch,
  Users,
  Video,
  Youtube,
} from "lucide-react";
import ActivityFeed from "./components/activity-feed";
import PlatformDistribution from "./components/platform-distribution";
import RevenueChart from "./components/revenue-chart";
import StatCard from "./components/stat-card";
import useDashboard from "./use-dashboard";
import { NewContentModal } from "@/components/new-content-modal/new-content-modal";
import { NewTaskModal } from "@/components/new-task-modal/new-task-modal";

export default function DashboardPage() {
  const {
    timeRange,
    setTimeRange,
    session,
    revenueTrendMap,
    platformColors,
    statusColors,
    fadeInUp,
    staggerChildren,
    formatCurrency,
    formatPercentage,
    dashboardStats,
    revenueByPlatform,
    recentActivity,
    tasksByStatus,
    STATUS_CONFIG,
    upcomingContent,
    contentPerformance,
    openNewContentModal,
    setOpenNewContentModal,
    openNewTaskModal,
    setOpenNewTaskModal,
    organizationId,
    refetchPendingTasks,
  } = useDashboard();

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
                Olá, {session?.user?.name}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Aqui está o resumo do seu CreatorHub hoje
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Select
                value={timeRange}
                onValueChange={(value) =>
                  setTimeRange(value as "week" | "month" | "quarter")
                }
              >
                <SelectTrigger className="w-35 md:w-45">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                </SelectContent>
              </Select>

              <NewContentModal
                openContentModal={openNewContentModal}
                setOpenContentModal={setOpenNewContentModal}
              />
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
            value={formatCurrency(dashboardStats?.totalRevenue ?? 0)}
            change={formatPercentage(dashboardStats?.revenueGrowth ?? 0)}
            isPositive={true}
            icon={DollarSign}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            delay={0}
          />
          <StatCard
            title="Receita do Mês"
            value={formatCurrency(dashboardStats?.monthlyRevenue ?? 0)}
            change={formatPercentage(dashboardStats?.revenueGrowth ?? 0)}
            isPositive={true}
            icon={TrendingUp}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            delay={0.1}
          />
          <StatCard
            title="Conteúdos em Produção"
            value={dashboardStats?.activeContent.toString() ?? "0"}
            change={`${dashboardStats?.upcomingPublications ?? 0} agendados`}
            isPositive={true}
            icon={Video}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            delay={0.2}
          />
          <StatCard
            title="Tarefas Pendentes"
            value={dashboardStats?.pendingTasks.toString() ?? "0"}
            change={`${dashboardStats?.taskCompletion ?? 0}% completado`}
            isPositive={(dashboardStats?.taskCompletion ?? 0) >= 70}
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
                        Receita{" "}
                        {timeRange === "week"
                          ? "semanal"
                          : timeRange === "month"
                            ? "mensal"
                            : "trimestral"}{" "}
                        e tendências
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <RevenueChart data={revenueTrendMap} timeRange={timeRange} />
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
                              backgroundColor: `${platformColors[content.platform as ContentPlatform]}20`,
                              color:
                                platformColors[
                                  content.platform as ContentPlatform
                                ],
                            }}
                          >
                            {content.platform === ContentPlatform.YOUTUBE && (
                              <Youtube className="h-5 w-5" />
                            )}
                            {content.platform === ContentPlatform.TIKTOK && (
                              <Music className="h-5 w-5" />
                            )}
                            {content.platform === ContentPlatform.INSTAGRAM && (
                              <Instagram className="h-5 w-5" />
                            )}
                            {content.platform === ContentPlatform.TWITCH && (
                              <Twitch className="h-5 w-5" />
                            )}
                            {content.platform === ContentPlatform.FACEBOOK && (
                              <Facebook className="h-5 w-5" />
                            )}
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
                                  backgroundColor: `${statusColors[content.status as ContentStatus]}15`,
                                  borderColor:
                                    statusColors[
                                      content.status as ContentStatus
                                    ],
                                  color:
                                    statusColors[
                                      content.status as ContentStatus
                                    ],
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
                    <Button variant="ghost" className="w-full mt-4 cursor-pointer">
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
                              backgroundColor: `${platformColors[content.platform as ContentPlatform]}20`,
                            }}
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  platformColors[
                                    content.platform as ContentPlatform
                                  ],
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
                              backgroundColor: `${statusColors[content.status as ContentStatus]}15`,
                              borderColor:
                                statusColors[content.status as ContentStatus],
                              color:
                                statusColors[content.status as ContentStatus],
                            }}
                          >
                            {content.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4 cursor-pointer">
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
                  <CardDescription>
                    Distribuição em{" "}
                    {timeRange === "week"
                      ? "semana"
                      : timeRange === "month"
                        ? "mês"
                        : "trimestre"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PlatformDistribution
                    data={revenueByPlatform}
                    platformColors={platformColors}
                    timeRange={timeRange}
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
                  <NewTaskModal
                    organizationId={organizationId}
                    setOpenNewTaskModal={setOpenNewTaskModal}
                    openNewTaskModal={openNewTaskModal}
                    refetchPendingTasks={refetchPendingTasks}
                  />
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    Ver todas
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {Object.values(tasksByStatus).flat().length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nenhuma tarefa encontrada. Tente adicionar uma nova tarefa!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(tasksByStatus).map(
                    ([status, tasks], colIndex) => {
                      const config =
                        STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

                      if (!config) return null;

                      return (
                        <motion.div
                          key={status}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: colIndex * 0.1 }}
                          className="space-y-3"
                        >
                          {/* Header da coluna */}
                          <div className={`p-3 rounded-lg ${config.color}`}>
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-medium ${config.textColor}`}
                              >
                                {config.label}
                              </span>
                              <Badge
                                variant="secondary"
                                className={config.textColor}
                              >
                                {tasks.length}
                              </Badge>
                            </div>
                          </div>

                          {/* Tarefas */}
                          <div className="space-y-3">
                            {tasks.map((task, taskIndex) => (
                              <motion.div
                                key={task.id}
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
                                    {task.title}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 cursor-pointer"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </div>

                                {task.content_item && (
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {task.content_item.title}
                                  </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {task.due_date
                                        ? `Vence em ${new Date(task.due_date).toLocaleDateString("pt-BR")}`
                                        : "Sem prazo"}
                                    </span>
                                  </div>

                                  {task.assigned_to && (
                                    <div
                                      className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                                      title={task.assigned_to.name}
                                    >
                                      <Users className="h-3 w-3 text-primary" />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
