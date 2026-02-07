"use client";

import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Archive, CheckCircle2, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Schema de atualização da tarefa
export const updateTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional().nullable(),
  contentItemId: z.string().uuid().optional().nullable(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional(),
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
});

type FormData = z.infer<typeof updateTaskSchema>;

interface UseEditTaskModalProps {
  task: Task;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  contentItems: ContentItem[];
  organizationMembers: OrganizationMember[];
}

export default function useEditTaskModal({
  task,
  onOpenChange,
  contentItems,
  organizationMembers,
}: UseEditTaskModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [tags, setTags] = useState<string[]>(task.metadata?.tags || []);
  const [contentSearchOpen, setContentSearchOpen] = useState(false);
  const [assigneeSearchOpen, setAssigneeSearchOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { mutate: editTask, isPending: isEditing } = useEditTask();

  const form = useForm<FormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || null,
      status: task.status,
      priority: task.priority,
      contentItemId: task.content_item?.id || null,
      assignedTo: task.assigned_to?.id || null,
      dueDate: task.due_date || null,
      metadata: task.metadata || {},
      startedAt: task.started_at || null,
      completedAt: task.completed_at || null,
    },
  });

  const watchStatus = form.watch("status");
  const watchPriority = form.watch("priority");
  const watchContentId = form.watch("contentItemId");
  const watchAssignedTo = form.watch("assignedTo");

  // Configurações de status e prioridade
  const taskStatusOptions = [
    {
      value: "todo",
      label: "A Fazer",
      icon: AlertCircle,
      color: "bg-gray-400",
    },
    {
      value: "in_progress",
      label: "Em Progresso",
      icon: PlayCircle,
      color: "bg-blue-500",
    },
    {
      value: "blocked",
      label: "Bloqueada",
      icon: AlertCircle,
      color: "bg-red-500",
    },
    {
      value: "done",
      label: "Concluída",
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      value: "archived",
      label: "Arquivada",
      icon: Archive,
      color: "bg-gray-600",
    },
  ] as const;

  const priorityOptions = [
    { value: 0, label: "Baixa", color: "bg-gray-300" },
    { value: 1, label: "Média", color: "bg-yellow-400" },
    { value: 2, label: "Alta", color: "bg-orange-500" },
    { value: 3, label: "Crítica", color: "bg-red-600" },
  ] as const;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("metadata.tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("metadata.tags", newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  function useEditTask() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: FormData) => {
        const res = await api.patch(`/tasks/${task.id}`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });
  }

  const onSubmit = async (data: FormData) => {
    editTask(data, {
      onSuccess: () => {
        toast.success("Tarefa atualizada com sucesso!");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(`Erro ao atualizar tarefa: ${error.message}`);
      },
    });
  };

  // Efeito para atualizar startedAt e completedAt baseado no status
  useEffect(() => {
    if (watchStatus === "in_progress" && !task.started_at) {
      form.setValue("startedAt", new Date().toISOString());
    } else if (watchStatus === "done" && !task.completed_at) {
      form.setValue("completedAt", new Date().toISOString());
    }
  }, [watchStatus, form, task.started_at, task.completed_at]);

  // Funções auxiliares
  const getContentItemById = (id: string) => {
    return contentItems.find((item) => item.id === id);
  };

  const getMemberById = (id: string) => {
    return organizationMembers.find((member) => member.id === id);
  };

  // Animações
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  const selectedContentItem = watchContentId
    ? getContentItemById(watchContentId)
    : null;
  const selectedAssignee = watchAssignedTo
    ? getMemberById(watchAssignedTo)
    : null;

  return {
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
  };
}
