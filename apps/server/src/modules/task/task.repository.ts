import { db } from "@CreatorHub/db";
import { tasksInApp } from "@CreatorHub/db/schema/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import type { CreateTaskInput, UpdateTaskInput } from "./task.dto";

/** remove undefined helper */
function removeUndefined<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export const TaskRepository = {
  async create(
    organizationId: string,
    data: CreateTaskInput & { createdBy: string },
  ) {
    const payload = removeUndefined({
      organizationId,
      contentItemId: data.contentItemId ?? null,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? undefined,
      priority: data.priority ?? 0,
      assignedTo: data.assignedTo ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      startedAt: undefined,
      completedAt: undefined,
      metadata: data.metadata ?? {},
      createdBy: data.createdBy,
    });

    const [row] = await db
      .insert(tasksInApp)
      .values(payload as any)
      .returning();
    return row;
  },

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(tasksInApp)
      .where(eq(tasksInApp.id, id));
    return row ?? null;
  },

  async listByOrganization(
    organizationId: string,
    opts?: {
      limit?: number;
      offset?: number;
      status?: "todo" | "in_progress" | "blocked" | "done" | "archived";
      assignedTo?: string;
    },
  ) {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;

    const conditions: any[] = [eq(tasksInApp.organizationId, organizationId)];
    if (opts?.status) conditions.push(eq(tasksInApp.status, opts.status));
    if (opts?.assignedTo)
      conditions.push(eq(tasksInApp.assignedTo, opts.assignedTo));

    return db
      .select()
      .from(tasksInApp)
      .where(sql`${sql.join(conditions, " AND ")}`)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(tasksInApp.createdAt));
  },

  async listByAssignedTo(
    assignedTo: string,
    opts?: { limit?: number; offset?: number },
  ) {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;
    return db
      .select()
      .from(tasksInApp)
      .where(eq(tasksInApp.assignedTo, assignedTo))
      .limit(limit)
      .offset(offset)
      .orderBy(asc(tasksInApp.dueDate));
  },

  async listByContentItem(
    contentItemId: string,
    opts?: { limit?: number; offset?: number },
  ) {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;
    return db
      .select()
      .from(tasksInApp)
      .where(eq(tasksInApp.contentItemId, contentItemId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(tasksInApp.createdAt));
  },

  async update(id: string, data: UpdateTaskInput) {
    const set: Record<string, unknown> = {};
    if (data.title !== undefined) set.title = data.title;
    if (data.description !== undefined)
      set.description = data.description ?? null;
    if (data.contentItemId !== undefined)
      set.contentItemId = data.contentItemId ?? null;
    if (data.status !== undefined) set.status = data.status;
    if (data.priority !== undefined) set.priority = data.priority;
    if (data.assignedTo !== undefined) set.assignedTo = data.assignedTo ?? null;
    if (data.dueDate !== undefined)
      set.dueDate = data.dueDate ? new Date(data.dueDate as any) : null;
    if (data.startedAt !== undefined)
      set.startedAt = data.startedAt ? new Date(data.startedAt as any) : null;
    if (data.completedAt !== undefined)
      set.completedAt = data.completedAt
        ? new Date(data.completedAt as any)
        : null;
    if (data.metadata !== undefined) set.metadata = data.metadata;

    set.updatedAt = new Date();

    const [row] = await db
      .update(tasksInApp)
      .set(set)
      .where(eq(tasksInApp.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    await db.delete(tasksInApp).where(eq(tasksInApp.id, id));
  },
};
