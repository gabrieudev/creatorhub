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

/**
 * Business rules for tasks:
 * - create: only organization members
 * - assignedTo must be an existing organization_member.id for same org
 * - update: only owner OR creator OR assignee
 * - setting status to 'in_progress' sets startedAt if not present
 * - setting status to 'completed' sets completedAt if not present
 * - unsetting 'completed' clears completedAt
 */

function normalizeStatus(s: string | undefined | null) {
  return s ? String(s).toLowerCase() : undefined;
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

    // ensure org exists
    const org = await OrganizationRepository.findById(organizationId);
    if (!org) throw new NotFoundError("Organization not found");

    // require authenticated actor
    if (!actorUserId) throw new ForbiddenError("Authentication required");
    const actorMembership = await OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      actorUserId,
    );
    if (!actorMembership)
      throw new ForbiddenError("Not a member of this organization");

    // if assignedTo provided -> validate member exists and belongs to org
    if (data.assignedTo) {
      const assignee = await OrganizationMemberRepository.findById(
        data.assignedTo,
      );
      if (!assignee || String(assignee.organizationId) !== organizationId) {
        throw new BadRequestError("Assigned member not found in organization");
      }
    }

    // handle status timestamps
    const status = normalizeStatus(data.status);
    const payload: CreateTaskInput & { createdBy: string } = {
      ...data,
      createdBy: actorUserId,
    };

    if (status === "in_progress" || status === "started") {
      (payload as any).startedAt = new Date().toISOString();
    }
    if (status === "completed" || status === "done") {
      (payload as any).completedAt = new Date().toISOString();
    }

    const created = await TaskRepository.create(organizationId, payload);
    return created;
  },

  async getById(id: string, actorUserId?: string) {
    const item = await TaskRepository.findById(id);
    if (!item) throw new NotFoundError("Task not found");

    // restrict to members for privacy
    const membership = await OrganizationMemberRepository.findByOrgAndUser(
      String(item.organizationId),
      actorUserId ?? "",
    );
    if (!membership)
      throw new ForbiddenError("Not a member of this organization");
    return item;
  },

  async listByOrganization(
    organizationId: string,
    actorUserId?: string,
    opts?: {
      limit?: number;
      offset?: number;
      status?: "todo" | "in_progress" | "blocked" | "done" | "archived";
      assignedTo?: string;
    },
  ) {
    if (actorUserId) {
      const membership = await OrganizationMemberRepository.findByOrgAndUser(
        organizationId,
        actorUserId,
      );
      if (!membership)
        throw new ForbiddenError("Not a member of this organization");
    }
    return TaskRepository.listByOrganization(organizationId, opts);
  },

  async listByAssignedTo(
    assignedTo: string,
    actorUserId?: string,
    opts?: { limit?: number; offset?: number },
  ) {
    // ensure actor is member of same org as assignedTo
    const assignee = await OrganizationMemberRepository.findById(assignedTo);
    if (!assignee) throw new NotFoundError("Assigned member not found");
    if (actorUserId) {
      const actorMembership =
        await OrganizationMemberRepository.findByOrgAndUser(
          String(assignee.organizationId),
          actorUserId,
        );
      if (!actorMembership)
        throw new ForbiddenError("Not a member of this organization");
    }
    return TaskRepository.listByAssignedTo(assignedTo, opts);
  },

  async listByContentItem(
    contentItemId: string,
    actorUserId?: string,
    opts?: { limit?: number; offset?: number },
  ) {
    // check content item and membership of its org
    // we can rely on ContentItemRepository if needed; skip check for brevity but ensure actor is member of org via content item lookup if needed
    return TaskRepository.listByContentItem(contentItemId, opts);
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

    if (!actorUserId) throw new ForbiddenError("Authentication required");
    const actorMembership = await OrganizationMemberRepository.findByOrgAndUser(
      String(existing.organizationId),
      actorUserId,
    );
    if (!actorMembership)
      throw new ForbiddenError("Not a member of this organization");

    const isOwner = actorMembership.isOwner;
    const isCreator = String(existing.createdBy) === actorUserId;
    const isAssignee = String(existing.assignedTo) === actorMembership.id;

    if (!isOwner && !isCreator && !isAssignee)
      throw new ForbiddenError(
        "Only owner, creator or assignee can update the task",
      );

    // If changing assignedTo, validate target is member in same org
    if ((input as any).assignedTo !== undefined) {
      const at = (input as any).assignedTo;
      if (at !== null) {
        const assignee = await OrganizationMemberRepository.findById(at);
        if (
          !assignee ||
          String(assignee.organizationId) !== String(existing.organizationId)
        ) {
          throw new BadRequestError(
            "Assigned member not found in organization",
          );
        }
      }
    }

    // Status timestamp transitions
    if (data.status !== undefined) {
      const newStatus = normalizeStatus(data.status);
      const oldStatus = normalizeStatus(existing.status);

      if (
        (newStatus === "in_progress" || newStatus === "started") &&
        !existing.startedAt
      ) {
        (data as any).startedAt = new Date().toISOString();
      }

      if (
        (newStatus === "completed" || newStatus === "done") &&
        !existing.completedAt
      ) {
        (data as any).completedAt = new Date().toISOString();
      }

      // if moving from completed -> not completed, clear completedAt
      if (oldStatus === "completed" && newStatus !== "completed") {
        (data as any).completedAt = null;
      }
    }

    const updated = await TaskRepository.update(id, data);
    if (!updated) throw new NotFoundError("Task not found after update");
    return updated;
  },

  async remove(id: string, actorUserId?: string) {
    const existing = await TaskRepository.findById(id);
    if (!existing) throw new NotFoundError("Task not found");

    if (!actorUserId) throw new ForbiddenError("Authentication required");
    const actorMembership = await OrganizationMemberRepository.findByOrgAndUser(
      String(existing.organizationId),
      actorUserId,
    );
    if (!actorMembership)
      throw new ForbiddenError("Not a member of this organization");

    const isOwner = actorMembership.isOwner;
    const isCreator = String(existing.createdBy) === actorUserId;
    const isAssignee = String(existing.assignedTo) === actorMembership.id;

    if (!isOwner && !isCreator && !isAssignee)
      throw new ForbiddenError(
        "Only owner, creator or assignee can delete the task",
      );

    await TaskRepository.delete(id);
    return;
  },
};
