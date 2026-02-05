import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import {
  createTaskSchema,
  updateTaskSchema,
  taskResponseSchema,
} from "./task.dto";
import { TaskService } from "./task.service";

const orgIdParam = z.object({ organizationId: z.string().uuid() });
const idParam = z.object({ id: z.string().uuid() });
const assignedParam = z.object({ assignedTo: z.string().uuid() });

const allowedStatuses = [
  "todo",
  "in_progress",
  "blocked",
  "done",
  "archived",
] as const;

export default async function taskController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  fastify.get(
    "/organizations/:organizationId/tasks",
    async (request, reply) => {
      const params = orgIdParam.parse(request.params);
      const q = request.query as any;
      const limit = q?.limit ? Number(q.limit) : undefined;
      const offset = q?.offset ? Number(q.offset) : undefined;
      const statusRaw = q?.status ? String(q.status) : undefined;

      const status =
        statusRaw && (allowedStatuses as readonly string[]).includes(statusRaw)
          ? (statusRaw as (typeof allowedStatuses)[number])
          : undefined;
      const assignedTo = q?.assignedTo ? String(q.assignedTo) : undefined;

      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;
      const list = await TaskService.listByOrganization(
        params.organizationId,
        actorUserId,
        { limit, offset, status, assignedTo },
      );
      return reply.send(list.map((r) => taskResponseSchema.parse(r)));
    },
  );

  fastify.post(
    "/organizations/:organizationId/tasks",
    async (request, reply) => {
      const params = orgIdParam.parse(request.params);
      const payload = createTaskSchema.parse(request.body);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      const created = await TaskService.create(
        params.organizationId,
        payload,
        actorUserId,
      );
      return reply.code(201).send(taskResponseSchema.parse(created));
    },
  );

  fastify.get("/tasks/:id", async (request, reply) => {
    const params = idParam.parse(request.params);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;
    const item = await TaskService.getById(params.id, actorUserId);
    return reply.send(taskResponseSchema.parse(item));
  });

  fastify.patch("/tasks/:id", async (request, reply) => {
    const params = idParam.parse(request.params);
    const payload = updateTaskSchema.parse(request.body);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    const updated = await TaskService.update(params.id, payload, actorUserId);
    return reply.send(taskResponseSchema.parse(updated));
  });

  fastify.delete("/tasks/:id", async (request, reply) => {
    const params = idParam.parse(request.params);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    await TaskService.remove(params.id, actorUserId);
    return reply.code(204).send();
  });

  fastify.get("/assigned/:assignedTo/tasks", async (request, reply) => {
    const params = assignedParam.parse(request.params);
    const q = request.query as any;
    const limit = q?.limit ? Number(q.limit) : undefined;
    const offset = q?.offset ? Number(q.offset) : undefined;
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    const list = await TaskService.listByAssignedTo(
      params.assignedTo,
      actorUserId,
      { limit, offset },
    );
    return reply.send(list.map((r) => taskResponseSchema.parse(r)));
  });

  fastify.get("/content-items/:contentItemId/tasks", async (request, reply) => {
    const contentItemIdParam = z.object({ contentItemId: z.string().uuid() });
    const params = contentItemIdParam.parse(request.params);
    const q = request.query as any;
    const limit = q?.limit ? Number(q.limit) : undefined;
    const offset = q?.offset ? Number(q.offset) : undefined;
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    const list = await TaskService.listByContentItem(
      params.contentItemId,
      actorUserId,
      { limit, offset },
    );
    return reply.send(list.map((r) => taskResponseSchema.parse(r)));
  });
}
