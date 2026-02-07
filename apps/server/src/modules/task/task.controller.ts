import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { ZodError } from "zod";
import { BadRequestError } from "../../lib/errors";
import {
  createTaskSchema,
  updateTaskSchema,
  taskResponseSchema,
  listTasksByOrgQuerySchema,
  taskIdSchema,
  assignedToParamSchema,
  contentItemIdParamSchema,
  listTasksByAssignedQuerySchema,
  listTasksByContentQuerySchema,
} from "./task.dto";
import { TaskService } from "./task.service";

function validateRequest<T>(schema: any, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestError("Invalid data: " + error.message);
    }
    throw error;
  }
}

function getUserId(request: any): string | undefined {
  return request.session?.user?.id;
}

export default async function taskController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  // Get organization tasks with filters
  fastify.get(
    "/organizations/:organizationId/tasks",
    async (request, reply) => {
      try {
        const params = validateRequest(
          listTasksByOrgQuerySchema.pick({ organizationId: true }),
          request.params,
        ) as { organizationId: string };

        const query = validateRequest(
          listTasksByOrgQuerySchema.omit({ organizationId: true }),
          request.query,
        ) as {
          limit: number;
          offset: number;
          status?: "todo" | "in_progress" | "blocked" | "done" | "archived";
          assignedTo?: string;
        };

        const actorUserId = getUserId(request);

        const tasks = await TaskService.listByOrganization(
          params.organizationId,
          actorUserId,
          {
            limit: query.limit,
            offset: query.offset,
            status: query.status,
            assignedTo: query.assignedTo,
          },
        );

        const validatedTasks = tasks.map((task) =>
          taskResponseSchema.parse(task),
        );
        return reply.send(validatedTasks);
      } catch (error) {
        throw error;
      }
    },
  );

  // Create task
  fastify.post(
    "/organizations/:organizationId/tasks",
    async (request, reply) => {
      try {
        const params = validateRequest(
          listTasksByOrgQuerySchema.pick({ organizationId: true }),
          request.params,
        ) as { organizationId: string };

        const body = validateRequest(createTaskSchema, request.body);
        const actorUserId = getUserId(request);

        const task = await TaskService.create(
          params.organizationId,
          body,
          actorUserId,
        );

        const validatedResponse = taskResponseSchema.parse(task);
        return reply.code(201).send(validatedResponse);
      } catch (error) {
        throw error;
      }
    },
  );

  // Get task by ID
  fastify.get("/tasks/:id", async (request, reply) => {
    try {
      const params = validateRequest(taskIdSchema, request.params) as {
        id: string;
      };
      const actorUserId = getUserId(request);

      const task = await TaskService.getById(params.id, actorUserId);
      const validatedResponse = taskResponseSchema.parse(task);
      return reply.send(validatedResponse);
    } catch (error) {
      throw error;
    }
  });

  // Update task
  fastify.patch("/tasks/:id", async (request, reply) => {
    try {
      const params = validateRequest(taskIdSchema, request.params) as {
        id: string;
      };
      const body = validateRequest(updateTaskSchema, request.body);
      const actorUserId = getUserId(request);

      const task = await TaskService.update(params.id, body, actorUserId);
      const validatedResponse = taskResponseSchema.parse(task);
      return reply.send(validatedResponse);
    } catch (error) {
      throw error;
    }
  });

  // Delete task
  fastify.delete("/tasks/:id", async (request, reply) => {
    try {
      const params = validateRequest(taskIdSchema, request.params) as {
        id: string;
      };
      const actorUserId = getUserId(request);

      await TaskService.remove(params.id, actorUserId);
      return reply.code(204).send();
    } catch (error) {
      throw error;
    }
  });

  // Get tasks assigned to user
  fastify.get("/assigned/:assignedTo/tasks", async (request, reply) => {
    try {
      const params = validateRequest(assignedToParamSchema, request.params) as {
        assignedTo: string;
      };
      const query = validateRequest(
        listTasksByAssignedQuerySchema.omit({ assignedTo: true }),
        request.query,
      ) as { limit: number; offset: number };

      const actorUserId = getUserId(request);

      const tasks = await TaskService.listByAssignedTo(
        params.assignedTo,
        actorUserId,
        { limit: query.limit, offset: query.offset },
      );

      const validatedTasks = tasks.map((task) =>
        taskResponseSchema.parse(task),
      );
      return reply.send(validatedTasks);
    } catch (error) {
      throw error;
    }
  });

  // Get tasks by content item
  fastify.get("/content-items/:contentItemId/tasks", async (request, reply) => {
    try {
      const params = validateRequest(
        contentItemIdParamSchema,
        request.params,
      ) as { contentItemId: string };
      const query = validateRequest(
        listTasksByContentQuerySchema.omit({ contentItemId: true }),
        request.query,
      ) as { limit: number; offset: number };

      const tasks = await TaskService.listByContentItem(params.contentItemId, {
        limit: query.limit,
        offset: query.offset,
      });

      const validatedTasks = tasks.map((task) =>
        taskResponseSchema.parse(task),
      );
      return reply.send(validatedTasks);
    } catch (error) {
      throw error;
    }
  });
}
