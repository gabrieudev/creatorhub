"use client";

import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";
import { AlertCircle, Archive, CheckCircle2, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Tipos baseados no schema
const taskStatusOptions = [
  { value: "todo", label: "A Fazer", icon: AlertCircle, color: "bg-gray-400" },
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

// Schema de validação
const formSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "blocked", "done", "archived"]),
  priority: z.number().min(0).max(5).default(0),
  contentItemId: z.string().uuid().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  metadata: z
    .object({
      tags: z.array(z.string()).optional(),
      estimatedHours: z.number().min(0).optional(),
      dependencies: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

type TaskFormData = z.infer<typeof formSchema>;

type UseNewTaskModalProps = {
  organizationId?: string | null;
  setOpenNewTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetchPendingTasks: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Task[], Error>>;
  contentItems: ContentItem[];
  organizationMembers: OrganizationMember[];
  isLoadingContentItems: boolean;
  isLoadingOrganizationMembers: boolean;
};

export default function useNewTaskModal({
  organizationId,
  setOpenNewTaskModal,
  refetchPendingTasks,
  contentItems,
  organizationMembers,
  isLoadingContentItems,
  isLoadingOrganizationMembers,
}: UseNewTaskModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [contentSearchOpen, setContentSearchOpen] = useState(false);
  const [assigneeSearchOpen, setAssigneeSearchOpen] = useState(false);
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();

  function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: TaskFormData) => {
        const res = await api.post(
          `/organizations/${organizationId}/tasks`,
          data,
        );
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: 0,
      contentItemId: null,
      assignedTo: null,
      dueDate: null,
      metadata: {
        tags: [],
        estimatedHours: undefined,
        dependencies: [],
        notes: "",
      },
    },
  });

  const watchStatus = form.watch("status");
  const watchPriority = form.watch("priority");
  const watchContentId = form.watch("contentItemId");
  const watchAssignedTo = form.watch("assignedTo");

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

  const taskOnSubmit = (data: TaskFormData) => {
    createTask(data, {
      onSuccess: () => {
        form.reset();
        setTags([]);
        toast.success("Tarefa criada com sucesso!");
        refetchPendingTasks();
        setOpenNewTaskModal(false);
      },
      onError: (error) => {
        toast.error(error?.message || "Erro ao criar tarefa. Tente novamente.");
      },
    });
  };

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
    contentSearchOpen,
    setContentSearchOpen,
    assigneeSearchOpen,
    setAssigneeSearchOpen,
    activeTab,
    setActiveTab,
    form,
    watchStatus,
    watchPriority,
    watchContentId,
    watchAssignedTo,
    tags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleKeyDown,
    taskOnSubmit,
    contentItems,
    organizationMembers,
    modalVariants,
    tabContentVariants,
    selectedContentItem,
    selectedAssignee,
    taskStatusOptions,
    priorityOptions,
    isCreatingTask,
    isLoadingContentItems,
    isLoadingOrganizationMembers,
  };
}
