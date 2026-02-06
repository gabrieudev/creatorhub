import api from "@/lib/api";
import { ContentPlatform, ContentStatus } from "@/shared/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Schema de validação
const contentFormSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo"),
  description: z.string().optional(),
  contentType: z.string().optional(),
  platform: z.enum(ContentPlatform),
  status: z.enum(ContentStatus),
  visibility: z.enum(["private", "public", "team"]),
  scheduledAt: z.date().optional(),
  publishedAt: z.date().optional(),
  estimatedDurationSeconds: z.number().min(0).optional(),
  metadata: z
    .object({
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      targetAudience: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

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

type UseNewContentModalProps = {
  openContentModal: boolean;
  setOpenContentModal: (open: boolean) => void;
  refetchContentPerformance: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ContentPerformance[], Error>>;
};

export default function useNewContentModal({
  openContentModal,
  setOpenContentModal,
  refetchContentPerformance,
}: UseNewContentModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const organizationId = useSelectedOrganization();
  const { mutate: createContentItem, isPending: isCreatingContentItem } =
    useCreateContentItem();
  const [contentModalActiveTab, setContentModalActiveTab] = useState("basic");

  const contentPlatform = [
    "youtube",
    "tiktok",
    "instagram",
    "twitch",
    "facebook",
    "other",
  ] as const;

  const contentStatus = [
    "idea",
    "roteiro",
    "gravacao",
    "edicao",
    "pronto",
    "agendado",
    "publicado",
    "arquivado",
  ] as const;

  function useCreateContentItem() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: ContentFormData) => {
        const res = await api.post(
          `/organizations/${organizationId}/content-items`,
          data,
        );
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["content-items"] });
      },
    });
  }

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: "",
      platform: ContentPlatform.YOUTUBE,
      status: ContentStatus.IDEA,
      visibility: "private",
      estimatedDurationSeconds: undefined,
      metadata: {
        tags: [],
        category: "",
        targetAudience: "",
        notes: "",
      },
    },
  });

  const watchPlatform = form.watch("platform");
  const watchStatus = form.watch("status");

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

  const contentOnSubmit = (data: ContentFormData) => {
    createContentItem(data, {
      onSuccess: () => {
        form.reset();
        setTags([]);
        toast.success("Conteúdo criado com sucesso!");
        setOpenContentModal(false);
        refetchContentPerformance();
      },
      onError: (error) => {
        toast.error(
          error?.message || "Erro ao criar conteúdo. Tente novamente.",
        );
      },
    });
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

  const visibilityOptions = [
    { value: "private", label: "Privado" },
    { value: "public", label: "Público" },
    { value: "team", label: "Time" },
  ] as const;

  return {
    form,
    watchPlatform,
    watchStatus,
    tags,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleKeyDown,
    contentOnSubmit,
    isCreatingContentItem,
    openContentModal,
    setOpenContentModal,
    modalVariants,
    tabContentVariants,
    visibilityOptions,
    contentModalActiveTab,
    setContentModalActiveTab,
    contentPlatform,
    contentStatus,
  };
}
