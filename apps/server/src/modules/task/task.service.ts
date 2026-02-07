import { ZodError } from "zod";
import {
  type CreateTaskInput,
  type UpdateTaskInput,
  createTaskSchema,
  updateTaskSchema,
} from "./task.dto";
import { TaskRepository } from "./task.repository";
import { OrganizationRepository } from "../organization/organization.repository";
import { OrganizationMemberRepository } from "../organization-member/organization-member.repository";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../lib/errors";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "done"
  | "archived";

const ACTIVE_STATUSES: TaskStatus[] = ["todo", "in_progress", "blocked"];
const COMPLETED_STATUSES: TaskStatus[] = ["done"];

function normalizeStatus(s: string | undefined | null): TaskStatus {
  if (!s) return "todo";

  const normalized = s.toLowerCase().trim();

  if (normalized === "started") return "in_progress";
  if (normalized === "completed") return "done";

  return normalized as TaskStatus;
}

function getStatusTimestamps(
  currentStatus: TaskStatus,
  newStatus: TaskStatus,
  existingStartedAt?: string | null,
  existingCompletedAt?: string | null,
) {
  const timestamps: { startedAt?: string; completedAt?: string | null } = {};
  const now = new Date().toISOString();

  // Define startedAt quando mover para status ativo
  if (ACTIVE_STATUSES.includes(newStatus) && !existingStartedAt) {
    timestamps.startedAt = now;
  }

  // Define completedAt quando mover para status concluído
  if (COMPLETED_STATUSES.includes(newStatus) && !existingCompletedAt) {
    timestamps.completedAt = now;
  }

  // Limpa timestamps se mover de status concluído para outro status
  if (
    COMPLETED_STATUSES.includes(currentStatus) &&
    !COMPLETED_STATUSES.includes(newStatus)
  ) {
    timestamps.completedAt = null;
  }

  return timestamps;
}

async function validateOrganizationMembership(
  organizationId: string,
  userId?: string,
  requireAuth: boolean = true,
) {
  if (requireAuth && !userId) {
    throw new ForbiddenError("Autenticação necessária");
  }

  const membership = await OrganizationMemberRepository.findByOrgAndUser(
    organizationId,
    userId ?? "",
  );

  if (!membership) {
    throw new ForbiddenError("Usuário não é membro desta organização");
  }

  return membership;
}

async function validateAssignee(assignedTo: string, organizationId: string) {
  const assignee = await OrganizationMemberRepository.findById(assignedTo);

  if (!assignee || String(assignee.organizationId) !== organizationId) {
    throw new BadRequestError("Membro designado não encontrado na organização");
  }
}

function canModifyTask(
  actorMembership: any,
  task: { createdBy: string | null; assignedTo?: string | null },
): boolean {
  const isOwner = actorMembership.isOwner;
  const isCreator = String(task.createdBy) === actorMembership.userId;
  const isAssignee = String(task.assignedTo) === actorMembership.id;

  return isOwner || isCreator || isAssignee;
}

export const TaskService = {
  async create(organizationId: string, input: unknown, actorUserId?: string) {
    let data: CreateTaskInput;
    try {
      data = createTaskSchema.parse(input);
    } catch (err) {
      if (err instanceof ZodError) throw err;
      throw new BadRequestError("Payload inválido");
    }

    // Valida organização
    const org = await OrganizationRepository.findById(organizationId);
    if (!org) throw new NotFoundError("Organização não encontrada");

    // Valida associação do ator
    await validateOrganizationMembership(organizationId, actorUserId, true);

    // Valida membro designado, se fornecido
    if (data.assignedTo) {
      await validateAssignee(data.assignedTo, organizationId);
    }

    // Normaliza status e define timestamps iniciais
    const status = normalizeStatus(data.status);
    const timestamps = getStatusTimestamps("todo", status);

    const payload = {
      ...data,
      status,
      createdBy: actorUserId!,
      ...timestamps,
    };

    return await TaskRepository.create(organizationId, payload);
  },

  async getById(id: string, actorUserId?: string) {
    const result = await TaskRepository.findById(id);
    if (!result) throw new NotFoundError("Tarefa não encontrada");

    await validateOrganizationMembership(
      String(result.task.organizationId),
      actorUserId,
      true,
    );

    return result.task;
  },

  async listByOrganization(
    organizationId: string,
    actorUserId?: string,
    filters?: {
      limit?: number;
      offset?: number;
      status?: TaskStatus;
      assignedTo?: string;
    },
  ) {
    await validateOrganizationMembership(
      organizationId,
      actorUserId,
      !!actorUserId,
    );

    return TaskRepository.listByOrganization(organizationId, filters);
  },

  async listByAssignedTo(
    assignedTo: string,
    actorUserId?: string,
    pagination?: { limit?: number; offset?: number },
  ) {
    const assignee = await OrganizationMemberRepository.findById(assignedTo);
    if (!assignee) throw new NotFoundError("Membro designado não encontrado");

    await validateOrganizationMembership(
      String(assignee.organizationId),
      actorUserId,
      !!actorUserId,
    );

    return TaskRepository.listByAssignedTo(assignedTo, pagination);
  },

  async listByContentItem(
    contentItemId: string,
    pagination?: { limit?: number; offset?: number },
  ) {
    return TaskRepository.listByContentItem(contentItemId, pagination);
  },

  async update(id: string, input: unknown, actorUserId?: string) {
    let data: UpdateTaskInput;
    try {
      data = updateTaskSchema.parse(input);
    } catch (err) {
      if (err instanceof ZodError) throw err;
      throw new BadRequestError("Payload inválido");
    }

    const existing = await TaskRepository.findById(id);
    if (!existing) throw new NotFoundError("Tarefa não encontrada");

    const actorMembership = await validateOrganizationMembership(
      String(existing.task.organizationId),
      actorUserId,
      true,
    );

    // Valida permissões
    if (!canModifyTask(actorMembership, existing.task)) {
      throw new ForbiddenError(
        "Somente criador ou membro da equipe podem modificar a tarefa",
      );
    }

    // Valida novo membro designado, se estiver mudando
    if (data.assignedTo !== undefined && data.assignedTo !== null) {
      await validateAssignee(
        data.assignedTo,
        String(existing.task.organizationId),
      );
    }

    // Se o status estiver mudando, normaliza e ajusta timestamps
    const newStatus = data.status ? normalizeStatus(data.status) : undefined;
    if (newStatus) {
      const currentStatus = normalizeStatus(existing.task.status);
      const timestamps = getStatusTimestamps(
        currentStatus,
        newStatus,
        existing.task.startedAt,
        existing.task.completedAt,
      );

      Object.assign(data, timestamps);
      data.status = newStatus;
    }

    const updated = await TaskRepository.update(id, data);
    if (!updated)
      throw new NotFoundError("Tarefa não encontrada após atualização");

    return updated;
  },

  async remove(id: string, actorUserId?: string) {
    const existing = await TaskRepository.findById(id);
    if (!existing) throw new NotFoundError("Tarefa não encontrada");

    const actorMembership = await validateOrganizationMembership(
      String(existing.task.organizationId),
      actorUserId,
      true,
    );

    // Valida permissões
    if (!canModifyTask(actorMembership, existing.task)) {
      throw new ForbiddenError(
        "Somente criador ou membro da equipe podem modificar a tarefa",
      );
    }

    await TaskRepository.delete(id);
  },
};
