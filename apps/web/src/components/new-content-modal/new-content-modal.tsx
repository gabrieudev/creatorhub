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
import useNewContentModal from "./use-new-content-modal";
import type { Variants } from "framer-motion";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarIcon, Globe, Loader2, Lock, Users, Video } from "lucide-react";

type NewContentModalProps = {
  openContentModal: boolean;
  setOpenContentModal: (open: boolean) => void;
};

export function NewContentModal({
  openContentModal,
  setOpenContentModal,
}: NewContentModalProps) {
  const {
    contentModalActiveTab,
    setContentModalActiveTab,
    form,
    contentOnSubmit,
    contentPlatform,
    contentStatus,
    isCreatingContentItem,
    modalVariants,
    tabContentVariants,
    visibilityOptions,
    tags,
    tagInput,
    setTagInput,
    handleKeyDown,
    handleAddTag,
    handleRemoveTag,
  } = useNewContentModal({
    openContentModal,
    setOpenContentModal,
  });

  return (
    <Dialog open={openContentModal} onOpenChange={setOpenContentModal}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Novo Conteúdo</Button>
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
              Preencha os detalhes do novo conteúdo. Todos os campos marcados
              com * são obrigatórios.
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
                              <Badge variant="outline" className="text-xs">
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
                                    <span className="capitalize">{status}</span>
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
                                            : field.value === "agendado"
                                              ? "bg-purple-400"
                                              : field.value === "publicado"
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
                                Opcional. Se definido, o conteúdo será publicado
                                automaticamente.
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
                                    onClick={() => field.onChange(option.value)}
                                    className={cn(
                                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300 cursor-pointer",
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
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="transition-all duration-300 focus:ring-2 focus:ring-purple-500"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleAddTag}
                            className="transition-all duration-300 hover:scale-105 cursor-pointer"
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
                      <Button variant="outline" className="cursor-pointer">Cancelar</Button>
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
                          className="transition-all duration-300 hover:scale-105 cursor-pointer"
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
                          className="transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                          Próximo
                        </Button>
                      ) : null}
                      <Button
                        type="submit"
                        className="bg-linear-to-r from-red-600 to-blue-600 hover:from-blue-700 hover:to-red-700 transition-all duration-300 hover:scale-105 text-white cursor-pointer"
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
  );
}
