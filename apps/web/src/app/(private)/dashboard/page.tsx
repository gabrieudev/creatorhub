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
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  BarChart3,
  Calendar,
  CalendarIcon,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Globe,
  Loader2,
  Lock,
  MessageSquare,
  MoreVertical,
  Plus,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

import { DatePickerTime } from "@/components/datetime-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ContentPlatform, ContentStatus } from "@/shared/enums";
import ActivityFeed from "./components/ActivityFeed";
import PlatformDistribution from "./components/PlatformDistribution";
import RevenueChart from "./components/RevenueChart";
import StatCard from "./components/StatCard";
import useDashboard from "./useDashboard";

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
    contentPerformance,
    upcomingContent,
    recentActivity,
    tasksByStatus,
    STATUS_CONFIG,
    modalVariants,
    tabContentVariants,
    form,
    contentModalActiveTab,
    setContentModalActiveTab,
    tagInput,
    setTagInput,
    tags,
    handleAddTag,
    handleRemoveTag,
    handleKeyDown,
    contentOnSubmit,
    visibilityOptions,
    contentPlatform,
    contentStatus,
    isCreatingContentItem,
    openContentModal,
    setOpenContentModal,
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

              <Dialog
                open={openContentModal}
                onOpenChange={setOpenContentModal}
              >
                <DialogTrigger asChild>
                  <Button>Novo Conteúdo</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalVariants as Variants}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                        Criar Novo Conteúdo
                      </DialogTitle>
                      <DialogDescription>
                        Preencha os detalhes do novo conteúdo. Todos os campos
                        marcados com * são obrigatórios.
                      </DialogDescription>
                    </DialogHeader>

                    <Tabs
                      value={contentModalActiveTab}
                      onValueChange={setContentModalActiveTab}
                      className="mt-4"
                    >
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="basic">Básico</TabsTrigger>
                        <TabsTrigger value="schedule">Agendamento</TabsTrigger>
                        <TabsTrigger value="advanced">Avançado</TabsTrigger>
                      </TabsList>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(contentOnSubmit)}
                          className="space-y-6 mt-6"
                        >
                          <AnimatePresence mode="wait">
                            {contentModalActiveTab === "basic" && (
                              <motion.div
                                key="basic"
                                variants={tabContentVariants as Variants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                              >
                                <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <span>Título *</span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {field.value?.length || 0}/200
                                        </Badge>
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Digite o título do conteúdo"
                                          {...field}
                                          className="transition-all duration-300 focus:ring-2 focus:ring-red-500"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Descrição</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Descreva o conteúdo..."
                                          className="min-h-25 transition-all duration-300 focus:ring-2 focus:ring-red-500"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="platform"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Plataforma *</FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="transition-all duration-300 hover:border-red-400">
                                              <SelectValue placeholder="Selecione a plataforma" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {contentPlatform.map((platform) => (
                                              <SelectItem
                                                key={platform}
                                                value={platform}
                                                className="flex items-center gap-2"
                                              >
                                                <span className="capitalize">
                                                  {platform}
                                                </span>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="contentType"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tipo de Conteúdo</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Ex: Vídeo, Post, Live..."
                                            {...field}
                                            className="transition-all duration-300 focus:ring-2 focus:ring-red-500"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={form.control}
                                  name="status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Status *</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="transition-all duration-300 hover:border-red-400">
                                            <SelectValue placeholder="Selecione o status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {contentStatus.map((status) => (
                                            <SelectItem
                                              key={status}
                                              value={status}
                                              className="flex items-center gap-2"
                                            >
                                              <span className="capitalize">
                                                {status}
                                              </span>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormDescription className="flex items-center gap-2 mt-2">
                                        <span
                                          className={`inline-block w-3 h-3 rounded-full ${
                                            field.value === "idea"
                                              ? "bg-gray-400"
                                              : field.value === "roteiro"
                                                ? "bg-blue-400"
                                                : field.value === "gravacao"
                                                  ? "bg-yellow-400"
                                                  : field.value === "edicao"
                                                    ? "bg-orange-400"
                                                    : field.value === "pronto"
                                                      ? "bg-green-400"
                                                      : field.value ===
                                                          "agendado"
                                                        ? "bg-purple-400"
                                                        : field.value ===
                                                            "publicado"
                                                          ? "bg-emerald-400"
                                                          : "bg-red-400"
                                          }`}
                                          aria-hidden="true"
                                        />
                                        Status atual: {field.value}
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            )}

                            {contentModalActiveTab === "schedule" && (
                              <motion.div
                                key="schedule"
                                variants={tabContentVariants as Variants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                              >
                                <FormField
                                  control={form.control}
                                  name="scheduledAt"
                                  render={() => (
                                    <FormItem className="flex flex-col gap-2 md:grid md:grid-cols-[12rem_1fr] md:gap-4">
                                      {/* LABEL */}
                                      <FormLabel className="flex items-center gap-2 pb-4">
                                        <CalendarIcon className="h-4 w-4" />
                                        Data e Hora Agendada
                                      </FormLabel>

                                      {/* CAMPO + DESCRIÇÃO */}
                                      <div className="flex flex-col gap-1">
                                        <FormControl>
                                          <DatePickerTime
                                            control={form.control}
                                            dateName="scheduledAtDate"
                                            timeName="scheduledAtTime"
                                          />
                                        </FormControl>

                                        <FormDescription>
                                          Opcional. Se definido, o conteúdo será
                                          publicado automaticamente.
                                        </FormDescription>

                                        <FormMessage />
                                      </div>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="estimatedDurationSeconds"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Video className="w-4 h-4" />
                                        Duração Estimada
                                      </FormLabel>
                                      <div className="flex gap-2">
                                        <FormControl>
                                          <Input
                                            type="number"
                                            placeholder="Minutos"
                                            {...field}
                                            value={
                                              field.value
                                                ? Math.floor(field.value / 60)
                                                : ""
                                            }
                                            onChange={(e) => {
                                              const minutes =
                                                parseInt(e.target.value) || 0;
                                              field.onChange(minutes * 60);
                                            }}
                                            className="transition-all duration-300 focus:ring-2 focus:ring-red-500"
                                          />
                                        </FormControl>
                                        <span className="flex items-center text-muted-foreground">
                                          minutos
                                        </span>
                                      </div>
                                      <FormDescription>
                                        {field.value
                                          ? `Duração total: ${Math.floor(field.value / 60)}m ${field.value % 60}s`
                                          : "Deixe em branco se não souber"}
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="visibility"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Visibilidade</FormLabel>
                                      <div className="grid grid-cols-3 gap-2">
                                        {visibilityOptions.map((option) => {
                                          return (
                                            <button
                                              key={option.value}
                                              type="button"
                                              onClick={() =>
                                                field.onChange(option.value)
                                              }
                                              className={cn(
                                                "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300",
                                                field.value === option.value
                                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                                                  : "border-gray-200 hover:border-purple-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900",
                                              )}
                                            >
                                              {option.label === "Público" && (
                                                <Globe className="w-6 h-6" />
                                              )}
                                              {option.label === "Privado" && (
                                                <Users className="w-6 h-6" />
                                              )}
                                              {option.label === "Time" && (
                                                <Lock className="w-6 h-6" />
                                              )}
                                              <span className="text-sm font-medium">
                                                {option.label}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            )}

                            {contentModalActiveTab === "advanced" && (
                              <motion.div
                                key="advanced"
                                variants={tabContentVariants as Variants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                              >
                                <div className="space-y-4">
                                  <FormLabel>Tags</FormLabel>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Adicione uma tag..."
                                      value={tagInput}
                                      onChange={(e) =>
                                        setTagInput(e.target.value)
                                      }
                                      onKeyDown={handleKeyDown}
                                      className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                                    />
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      onClick={handleAddTag}
                                      className="transition-all duration-300 hover:scale-105"
                                    >
                                      Adicionar
                                    </Button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 min-h-10">
                                    {tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="gap-1 px-3 py-1 transition-all duration-300 hover:scale-105 cursor-pointer"
                                        onClick={() => handleRemoveTag(tag)}
                                      >
                                        {tag}
                                        <span className="ml-1 text-xs">×</span>
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <FormField
                                  control={form.control}
                                  name="metadata.category"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Categoria</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ex: Tutorial, Entretenimento, Educação..."
                                          {...field}
                                          className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="metadata.targetAudience"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Público Alvo</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ex: Iniciantes, Profissionais, Adolescentes..."
                                          {...field}
                                          className="transition-all duration-300 focus:ring-2 focus:ring-red-500"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="metadata.notes"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Anotações Internas</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Anotações e observações internas..."
                                          className="min-h-25 transition-all duration-300 focus:ring-2 focus:ring-red-500"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6 pt-6 border-t">
                              <DialogClose className="transition-all duration-300 hover:scale-105">
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <div className="flex gap-2">
                                {contentModalActiveTab !== "basic" && (
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                      if (contentModalActiveTab === "schedule")
                                        setContentModalActiveTab("basic");
                                      if (contentModalActiveTab === "advanced")
                                        setContentModalActiveTab("schedule");
                                    }}
                                    className="transition-all duration-300 hover:scale-105"
                                  >
                                    Voltar
                                  </Button>
                                )}
                                {contentModalActiveTab !== "advanced" ? (
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                      if (contentModalActiveTab === "basic")
                                        setContentModalActiveTab("schedule");
                                      if (contentModalActiveTab === "schedule")
                                        setContentModalActiveTab("advanced");
                                    }}
                                    className="transition-all duration-300 hover:scale-105"
                                  >
                                    Próximo
                                  </Button>
                                ) : null}
                                <Button
                                  type="submit"
                                  className="bg-linear-to-r from-red-600 to-blue-600 hover:from-blue-700 hover:to-red-700 transition-all duration-300 hover:scale-105 text-white"
                                  disabled={isCreatingContentItem}
                                >
                                  {isCreatingContentItem ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    "Criar conteúdo"
                                  )}
                                </Button>
                              </div>
                            </DialogFooter>
                          </motion.div>
                        </form>
                      </Form>
                    </Tabs>
                  </motion.div>
                </DialogContent>
              </Dialog>
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
                                    className="h-6 w-6"
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
