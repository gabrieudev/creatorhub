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

  // Set startedAt when moving to active status
  if (ACTIVE_STATUSES.includes(newStatus) && !existingStartedAt) {
    timestamps.startedAt = now;
  }

  // Set completedAt when moving to completed status
  if (COMPLETED_STATUSES.includes(newStatus) && !existingCompletedAt) {
    timestamps.completedAt = now;
  }

  // Clear completedAt when moving away from completed status
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
    throw new ForbiddenError("Authentication required");
  }

  const membership = await OrganizationMemberRepository.findByOrgAndUser(
    organizationId,
    userId ?? "",
  );

  if (!membership) {
    throw new ForbiddenError("Not a member of this organization");
  }

  return membership;
}

async function validateAssignee(assignedTo: string, organizationId: string) {
  const assignee = await OrganizationMemberRepository.findById(assignedTo);

  if (!assignee || String(assignee.organizationId) !== organizationId) {
    throw new BadRequestError("Assigned member not found in organization");
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
      throw new BadRequestError("Invalid payload");
    }

    // Validate organization
    const org = await OrganizationRepository.findById(organizationId);
    if (!org) throw new NotFoundError("Organization not found");

    // Validate actor membership
    await validateOrganizationMembership(organizationId, actorUserId, true);

    // Validate assignee if provided
    if (data.assignedTo) {
      await validateAssignee(data.assignedTo, organizationId);
    }

    // Prepare payload with timestamps
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
    const task = await TaskRepository.findById(id);
    if (!task) throw new NotFoundError("Task not found");

    await validateOrganizationMembership(
      String(task.organizationId),
      actorUserId,
      true,
    );

    return task;
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
    if (!assignee) throw new NotFoundError("Assigned member not found");

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
      throw new BadRequestError("Invalid payload");
    }

    const existing = await TaskRepository.findById(id);
    if (!existing) throw new NotFoundError("Task not found");

    const actorMembership = await validateOrganizationMembership(
      String(existing.organizationId),
      actorUserId,
      true,
    );

    // Check permissions
    if (!canModifyTask(actorMembership, existing)) {
      throw new ForbiddenError(
        "Only owner, creator or assignee can update the task",
      );
    }

    // Validate new assignee if changing
    if (data.assignedTo !== undefined && data.assignedTo !== null) {
      await validateAssignee(data.assignedTo, String(existing.organizationId));
    }

    // Handle status transitions
    const newStatus = data.status ? normalizeStatus(data.status) : undefined;
    if (newStatus) {
      const currentStatus = normalizeStatus(existing.status);
      const timestamps = getStatusTimestamps(
        currentStatus,
        newStatus,
        existing.startedAt,
        existing.completedAt,
      );

      Object.assign(data, timestamps);
      data.status = newStatus;
    }

    const updated = await TaskRepository.update(id, data);
    if (!updated) throw new NotFoundError("Task not found after update");

    return updated;
  },

  async remove(id: string, actorUserId?: string) {
    const existing = await TaskRepository.findById(id);
    if (!existing) throw new NotFoundError("Task not found");

    const actorMembership = await validateOrganizationMembership(
      String(existing.organizationId),
      actorUserId,
      true,
    );

    // Check permissions
    if (!canModifyTask(actorMembership, existing)) {
      throw new ForbiddenError(
        "Only owner, creator or assignee can delete the task",
      );
    }

    await TaskRepository.delete(id);
  },
};
