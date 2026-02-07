"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  CalendarIcon,
  Clock,
  Edit,
  FileText,
  Flag,
  Loader2,
  Save,
  User,
} from "lucide-react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "../../lib/utils";
import { DatePicker } from "../date-picker";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Popover as CommandPopover,
  PopoverContent as CommandPopoverContent,
  PopoverTrigger as CommandPopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import useEditTaskModal from "./use-edit-task-modal";

interface EditTaskModalProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task;
  contentItems: ContentItem[];
  organizationMembers: OrganizationMember[];
  isLoadingContentItems: boolean;
  isLoadingOrganizationMembers: boolean;
}

export function EditTaskModal({
  open,
  onOpenChange,
  task,
  contentItems,
  organizationMembers,
  isLoadingContentItems,
  isLoadingOrganizationMembers,
}: EditTaskModalProps) {
  const {
    form,
    onSubmit,
    isEditing,
    activeTab,
    setActiveTab,
    tags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleKeyDown,
    taskStatusOptions,
    priorityOptions,
    contentSearchOpen,
    setContentSearchOpen,
    assigneeSearchOpen,
    setAssigneeSearchOpen,
    modalVariants,
    tabContentVariants,
    selectedContentItem,
    selectedAssignee,
  } = useEditTaskModal({
    task,
    onOpenChange,
    contentItems,
    organizationMembers,
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants as Variants}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              <div className="flex items-center gap-2">
                <Edit className="h-6 w-6" />
                Editar Tarefa
              </div>
            </DialogTitle>
            <DialogDescription>
              Atualize os detalhes da tarefa: {task.title}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-6"
              >
                <AnimatePresence mode="wait">
                  {activeTab === "details" && (
                    <motion.div
                      key="details"
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
                                placeholder="O que precisa ser feito?"
                                {...field}
                                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
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
                                placeholder="Descreva a tarefa em detalhes..."
                                className="min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                                value={field.value || ""}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="transition-all duration-300 hover:border-blue-400">
                                    <SelectValue placeholder="Selecione o status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {taskStatusOptions.map((status) => {
                                    const Icon = status.icon;
                                    return (
                                      <SelectItem
                                        key={status.value}
                                        value={status.value}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-2 h-2 rounded-full ${status.color}`}
                                          />
                                          <Icon className="w-4 h-4" />
                                          <span>{status.label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormDescription className="flex items-center gap-2 mt-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    taskStatusOptions.find(
                                      (s) => s.value === field.value,
                                    )?.color || "bg-gray-400"
                                  }`}
                                />
                                Status atual:{" "}
                                {
                                  taskStatusOptions.find(
                                    (s) => s.value === field.value,
                                  )?.label
                                }
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prioridade</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className="transition-all duration-300 hover:border-blue-400">
                                    <SelectValue placeholder="Selecione a prioridade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {priorityOptions.map((priority) => (
                                    <SelectItem
                                      key={priority.value}
                                      value={priority.value.toString()}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Flag
                                          className="w-4 h-4"
                                          style={{
                                            color:
                                              priority.value === 0
                                                ? "#9CA3AF"
                                                : priority.value === 1
                                                  ? "#FBBF24"
                                                  : priority.value === 2
                                                    ? "#FB923C"
                                                    : "#DC2626",
                                          }}
                                        />
                                        <span>{priority.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contentItemId"
                          render={({ field }) => {
                            const displayContent =
                              selectedContentItem ??
                              (task.content_item
                                ? {
                                    id: task.content_item.id,
                                    platform: task.content_item.platform,
                                    title: task.content_item.title,
                                    status: task.content_item.status,
                                  }
                                : null);

                            return (
                              <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Conteúdo Relacionado
                                </FormLabel>
                                <CommandPopover
                                  open={contentSearchOpen}
                                  onOpenChange={setContentSearchOpen}
                                >
                                  <CommandPopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between cursor-pointer",
                                          !field.value &&
                                            "text-muted-foreground",
                                        )}
                                      >
                                        {displayContent ? (
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {displayContent.platform || "N/A"}
                                            </Badge>
                                            <span className="truncate">
                                              {displayContent.title}
                                            </span>
                                          </div>
                                        ) : (
                                          "Selecione um conteúdo..."
                                        )}
                                      </Button>
                                    </FormControl>
                                  </CommandPopoverTrigger>
                                  <CommandPopoverContent className="w-100 p-0">
                                    {isLoadingContentItems ? (
                                      <div className="w-full flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span className="text-sm text-muted-foreground">
                                          Carregando...
                                        </span>
                                      </div>
                                    ) : (
                                      <Command>
                                        <CommandInput placeholder="Buscar conteúdo..." />
                                        <CommandEmpty>
                                          Nenhum conteúdo encontrado.
                                        </CommandEmpty>
                                        <CommandGroup className="max-h-50 overflow-y-auto">
                                          {contentItems.map((item) => (
                                            <CommandItem
                                              key={item.id}
                                              value={item.title}
                                              onSelect={() => {
                                                form.setValue(
                                                  "contentItemId",
                                                  item.id,
                                                );
                                                setContentSearchOpen(false);
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {item.platform || "N/A"}
                                              </Badge>
                                              <span className="truncate">
                                                {item.title}
                                              </span>
                                              <Badge
                                                variant="secondary"
                                                className="ml-auto text-xs"
                                              >
                                                {item.status}
                                              </Badge>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </Command>
                                    )}
                                  </CommandPopoverContent>
                                </CommandPopover>
                                <FormDescription>
                                  Opcional. Vincule a tarefa a um conteúdo
                                  específico.
                                </FormDescription>
                                {selectedContentItem && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1 h-6 text-xs cursor-pointer"
                                    onClick={() =>
                                      form.setValue("contentItemId", null)
                                    }
                                  >
                                    Remover vínculo
                                  </Button>
                                )}
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={form.control}
                          name="assignedTo"
                          render={({ field }) => {
                            const displayAssignee =
                              selectedAssignee ??
                              (task.assigned_to
                                ? {
                                    user: task.assigned_to,
                                    role: organizationMembers.find(
                                      (member) =>
                                        member.user.id ===
                                        task?.assigned_to?.id,
                                    )?.role,
                                  }
                                : null);

                            return (
                              <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Atribuída a
                                </FormLabel>
                                <CommandPopover
                                  open={assigneeSearchOpen}
                                  onOpenChange={setAssigneeSearchOpen}
                                >
                                  <CommandPopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between cursor-pointer",
                                          !field.value &&
                                            "text-muted-foreground",
                                        )}
                                      >
                                        {displayAssignee ? (
                                          <div className="flex items-center gap-2">
                                            {displayAssignee.user.image ? (
                                              <img
                                                src={displayAssignee.user.image}
                                                alt={displayAssignee.user.name}
                                                className="w-6 h-6 rounded-full"
                                              />
                                            ) : (
                                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600" />
                                              </div>
                                            )}
                                            <span>
                                              {displayAssignee.user.name}
                                            </span>
                                            {displayAssignee.role && (
                                              <Badge
                                                variant="outline"
                                                className="text-xs ml-auto"
                                              >
                                                {displayAssignee.role.name}
                                              </Badge>
                                            )}
                                          </div>
                                        ) : (
                                          "Selecione um membro..."
                                        )}
                                      </Button>
                                    </FormControl>
                                  </CommandPopoverTrigger>
                                  <CommandPopoverContent className="w-100 p-0">
                                    {isLoadingOrganizationMembers ? (
                                      <div className="w-full flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span className="text-sm text-muted-foreground">
                                          Carregando membros...
                                        </span>
                                      </div>
                                    ) : (
                                      <Command>
                                        <CommandInput placeholder="Buscar membro..." />
                                        <CommandEmpty>
                                          Nenhum membro encontrado.
                                        </CommandEmpty>
                                        <CommandGroup className="max-h-50 overflow-y-auto">
                                          {organizationMembers.map((member) => (
                                            <CommandItem
                                              key={member.id}
                                              value={member.user.name}
                                              onSelect={() => {
                                                form.setValue(
                                                  "assignedTo",
                                                  member.id,
                                                );
                                                setAssigneeSearchOpen(false);
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              {member.user.image ? (
                                                <img
                                                  src={member.user.image}
                                                  alt={member.user.name}
                                                  className="w-6 h-6 rounded-full"
                                                />
                                              ) : (
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                  <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                              )}
                                              <div className="flex flex-col">
                                                <span>{member.user.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {member.user.email}
                                                </span>
                                              </div>
                                              {member.role && (
                                                <Badge
                                                  variant="outline"
                                                  className="ml-auto text-xs"
                                                >
                                                  {member.role.name}
                                                </Badge>
                                              )}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </Command>
                                    )}
                                  </CommandPopoverContent>
                                </CommandPopover>
                                <FormDescription>
                                  Opcional. Atribua a tarefa a um membro da
                                  equipe.
                                </FormDescription>
                                {displayAssignee && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1 h-6 text-xs cursor-pointer"
                                    onClick={() =>
                                      form.setValue("assignedTo", null)
                                    }
                                  >
                                    Remover atribuição
                                  </Button>
                                )}
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start gap-2">
                            <FormLabel className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              Data de Vencimento
                            </FormLabel>

                            <div className="self-start">
                              <DatePicker
                                control={form.control}
                                name="dueDate"
                              />
                            </div>

                            {field.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs self-start cursor-pointer"
                                onClick={() => field.onChange(null)}
                              >
                                Remover data
                              </Button>
                            )}

                            <FormMessage />

                            <FormDescription className="text-left">
                              Opcional. Defina uma data limite para conclusão.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {activeTab === "advanced" && (
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
                            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
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
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
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
                        name="metadata.estimatedHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Horas Estimadas
                            </FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  placeholder="Ex: 2.5"
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseFloat(e.target.value)
                                        : undefined,
                                    )
                                  }
                                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                                />
                              </FormControl>
                              <span className="flex items-center text-muted-foreground">
                                horas
                              </span>
                            </div>
                            <FormDescription>
                              Estime o tempo necessário para concluir a tarefa.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Timestamps Automáticos</FormLabel>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="text-muted-foreground">
                              Iniciada em:
                            </div>
                            <div className="font-medium">
                              {task.started_at
                                ? format(new Date(task.started_at), "PPP", {
                                    locale: ptBR,
                                  })
                                : "Não iniciada"}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-muted-foreground">
                              Concluída em:
                            </div>
                            <div className="font-medium">
                              {task.completed_at
                                ? format(new Date(task.completed_at), "PPP", {
                                    locale: ptBR,
                                  })
                                : "Não concluída"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="metadata.notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notas Internas</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Notas e observações internas..."
                                className="min-h-[80px] transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                                value={field.value?.notes || ""}
                                onChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    notes: e.target.value,
                                  })
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Informações adicionais visíveis apenas para a
                              equipe.
                            </FormDescription>
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="transition-all duration-300 hover:scale-105"
                      disabled={isEditing}
                    >
                      Cancelar
                    </Button>
                    <div className="flex gap-2">
                      {activeTab === "advanced" && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setActiveTab("details")}
                          className="transition-all duration-300 hover:scale-105"
                          disabled={isEditing}
                        >
                          Voltar
                        </Button>
                      )}
                      {activeTab === "details" && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setActiveTab("advanced")}
                          className="transition-all duration-300 hover:scale-105"
                          disabled={isEditing}
                        >
                          Configurações Avançadas
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105"
                        disabled={isEditing}
                      >
                        {isEditing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
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
