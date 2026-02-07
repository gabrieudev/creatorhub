import { db } from "@CreatorHub/db";
import {
  contentItemsInApp,
  organizationMembersInApp,
  tasksInApp,
} from "@CreatorHub/db/schema/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import type { CreateTaskInput, UpdateTaskInput } from "./task.dto";
import type { TaskStatus } from "./task.service";

type BaseTask = typeof tasksInApp.$inferSelect;

const baseTaskQuery = () => {
  return db
    .select({
      task: tasksInApp,
      assignedToUser: {
        id: organizationMembersInApp.id,
        userId: organizationMembersInApp.userId,
        organizationId: organizationMembersInApp.organizationId,
        roleId: organizationMembersInApp.roleId,
        isOwner: organizationMembersInApp.isOwner,
        joinedAt: organizationMembersInApp.joinedAt,
        preferences: organizationMembersInApp.preferences,
        flActive: organizationMembersInApp.flActive,
      },
      contentItem: {
        id: contentItemsInApp.id,
        title: contentItemsInApp.title,
        contentType: contentItemsInApp.contentType,
        platform: contentItemsInApp.platform,
        status: contentItemsInApp.status,
        scheduledAt: contentItemsInApp.scheduledAt,
        publishedAt: contentItemsInApp.publishedAt,
      },
    })
    .from(tasksInApp)
    .leftJoin(
      contentItemsInApp,
      sql`${contentItemsInApp.id}::uuid = ${tasksInApp.contentItemId}::uuid`,
    );
};

const taskWithUserQuery = () => {
  return baseTaskQuery().leftJoin(
    organizationMembersInApp,
    eq(organizationMembersInApp.id, sql`${tasksInApp.assignedTo}`),
  );
};

export const TaskRepository = {
  async create(
    organizationId: string,
    data: CreateTaskInput & { createdBy: string },
  ): Promise<BaseTask> {
    const payload = {
      organizationId,
      contentItemId: data.contentItemId ?? null,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "todo",
      priority: data.priority ?? 0,
      assignedTo: data.assignedTo ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      startedAt: null,
      completedAt: null,
      metadata: data.metadata ?? {},
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const [task] = await db.insert(tasksInApp).values(payload).returning();

    if (!task) {
      throw new Error("Falha ao criar a tarefa");
    }

    return task;
  },

  async findById(taskId: string) {
    const [task] = await taskWithUserQuery()
      .where(eq(tasksInApp.id, taskId))
      .limit(1);

    return task;
  },

  async listByOrganization(
    organizationId: string,
    filters?: {
      limit?: number;
      offset?: number;
      status?: TaskStatus;
      assignedTo?: string;
    },
  ) {
    const limit = filters?.limit ?? 50;
    const offset = filters?.offset ?? 0;

    const conditions = [eq(tasksInApp.organizationId, organizationId)];

    if (filters?.status) {
      conditions.push(eq(tasksInApp.status, filters.status));
    }

    if (filters?.assignedTo) {
      conditions.push(eq(tasksInApp.assignedTo, filters.assignedTo));
    }

    const results = await taskWithUserQuery()
      .where(and(...conditions))
      .orderBy(asc(tasksInApp.dueDate))
      .limit(limit)
      .offset(offset);

    return results.map(({ task, assignedToUser, contentItem }) => ({
      ...task,
      assignedToUser: assignedToUser || null,
      contentItem: contentItem || null,
    }));
  },

  async listByAssignedTo(
    assignedTo: string,
    pagination?: { limit?: number; offset?: number },
  ) {
    const limit = pagination?.limit ?? 50;
    const offset = pagination?.offset ?? 0;

    const results = await taskWithUserQuery()
      .where(eq(tasksInApp.assignedTo, assignedTo))
      .orderBy(asc(tasksInApp.dueDate))
      .limit(limit)
      .offset(offset);

    return results.map(({ task, assignedToUser, contentItem }) => ({
      ...task,
      assignedToUser: assignedToUser || null,
      contentItem: contentItem || null,
    }));
  },

  async listByContentItem(
    contentItemId: string,
    pagination?: { limit?: number; offset?: number },
  ) {
    const limit = pagination?.limit ?? 50;
    const offset = pagination?.offset ?? 0;

    const results = await taskWithUserQuery()
      .where(eq(tasksInApp.contentItemId, contentItemId))
      .orderBy(asc(tasksInApp.dueDate))
      .limit(limit)
      .offset(offset);

    return results.map(({ task, assignedToUser, contentItem }) => ({
      ...task,
      assignedToUser: assignedToUser || null,
      contentItem: contentItem || null,
    }));
  },

  async update(id: string, data: UpdateTaskInput): Promise<BaseTask | null> {
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    const fields = [
      "title",
      "description",
      "contentItemId",
      "status",
      "priority",
      "assignedTo",
      "dueDate",
      "startedAt",
      "completedAt",
      "metadata",
    ] as const;

    fields.forEach((field) => {
      if (data[field] !== undefined) {
        if (
          field === "dueDate" ||
          field === "startedAt" ||
          field === "completedAt"
        ) {
          updateData[field] = data[field]
            ? new Date(data[field] as string).toISOString()
            : null;
        } else {
          updateData[field] = data[field];
        }
      }
    });

    const [task] = await db
      .update(tasksInApp)
      .set(updateData)
      .where(sql`${tasksInApp.id}::uuid = ${id}::uuid`)
      .returning();

    return task ?? null;
  },

  async delete(id: string): Promise<void> {
    await db
      .delete(tasksInApp)
      .where(sql`${tasksInApp.id}::uuid = ${id}::uuid`);
  },
};
