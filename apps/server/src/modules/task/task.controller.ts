import type { FastifyPluginOptions } from "fastify";
import Fastify from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createTaskSchema,
  taskResponseSchema,
  updateTaskSchema,
} from "./task.dto";
import { TaskService, type TaskStatus } from "./task.service";

export const fastify = Fastify().withTypeProvider<ZodTypeProvider>();

const allowedStatuses = [
  "todo",
  "in_progress",
  "blocked",
  "done",
  "archived",
] as const;

// Request schemas
const organizationIdSchema = z.object({
  organizationId: z.string().uuid(),
});

const taskIdSchema = z.object({
  id: z.string().uuid(),
});

const assignedToSchema = z.object({
  assignedTo: z.string().uuid(),
});

const contentItemIdSchema = z.object({
  contentItemId: z.string().uuid(),
});

const listTasksQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(allowedStatuses).optional(),
  assignedTo: z.string().uuid().optional(),
});

export default async function taskController(_opts: FastifyPluginOptions) {
  // Get organization tasks with filters
  fastify.get(
    "/organizations/:organizationId/tasks",
    {
      schema: {
        params: organizationIdSchema,
        querystring: listTasksQuerySchema,
      },
    },
    async (request, reply) => {
      const { organizationId } = request.params as { organizationId: string };
      const query = request.query as z.infer<typeof listTasksQuerySchema>;
      const actorUserId = request.session?.user?.id as string | undefined;

      const tasks = await TaskService.listByOrganization(
        organizationId,
        actorUserId,
        {
          limit: query.limit,
          offset: query.offset,
          status: query.status as TaskStatus,
          assignedTo: query.assignedTo,
        },
      );

      return reply.send(tasks.map((task) => taskResponseSchema.parse(task)));
    },
  );

  // Create task
  fastify.post(
    "/organizations/:organizationId/tasks",
    {
      schema: {
        params: organizationIdSchema,
        body: createTaskSchema,
      },
    },
    async (request, reply) => {
      const { organizationId } = request.params as { organizationId: string };
      const actorUserId = request.session?.user?.id as string | undefined;

      const task = await TaskService.create(
        organizationId,
        request.body,
        actorUserId,
      );

      return reply.code(201).send(taskResponseSchema.parse(task));
    },
  );

  // Get task by ID
  fastify.get(
    "/tasks/:id",
    {
      schema: {
        params: taskIdSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const actorUserId = request.session?.user?.id as string | undefined;

      const task = await TaskService.getById(id, actorUserId);
      return reply.send(taskResponseSchema.parse(task));
    },
  );

  // Update task
  fastify.patch(
    "/tasks/:id",
    {
      schema: {
        params: taskIdSchema,
        body: updateTaskSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const actorUserId = request.session?.user?.id as string | undefined;

      const task = await TaskService.update(id, request.body, actorUserId);
      return reply.send(taskResponseSchema.parse(task));
    },
  );

  // Delete task
  fastify.delete(
    "/tasks/:id",
    {
      schema: {
        params: taskIdSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const actorUserId = request.session?.user?.id as string | undefined;

      await TaskService.remove(id, actorUserId);
      return reply.code(204).send();
    },
  );

  // Get tasks assigned to user
  fastify.get(
    "/assigned/:assignedTo/tasks",
    {
      schema: {
        params: assignedToSchema,
        querystring: listTasksQuerySchema.pick({ limit: true, offset: true }),
      },
    },
    async (request, reply) => {
      const { assignedTo } = request.params as { assignedTo: string };
      const { limit, offset } = request.query as z.infer<
        typeof listTasksQuerySchema
      >;
      const actorUserId = request.session?.user?.id as string | undefined;

      const tasks = await TaskService.listByAssignedTo(
        assignedTo,
        actorUserId,
        { limit, offset },
      );

      return reply.send(tasks.map((task) => taskResponseSchema.parse(task)));
    },
  );

  // Get tasks by content item
  fastify.get(
    "/content-items/:contentItemId/tasks",
    {
      schema: {
        params: contentItemIdSchema,
        querystring: listTasksQuerySchema.pick({ limit: true, offset: true }),
      },
    },
    async (request, reply) => {
      const { contentItemId } = request.params as { contentItemId: string };
      const { limit, offset } = request.query as z.infer<
        typeof listTasksQuerySchema
      >;

      const tasks = await TaskService.listByContentItem(contentItemId, {
        limit,
        offset,
      });

      return reply.send(tasks.map((task) => taskResponseSchema.parse(task)));
    },
  );
}
