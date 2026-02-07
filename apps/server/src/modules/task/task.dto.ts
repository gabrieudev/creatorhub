import { z } from "zod";

export const taskStatusEnum = z.enum([
  "todo",
  "in_progress",
  "blocked",
  "done",
  "archived",
]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  contentItemId: z
    .string()
    .uuid("Invalid content item ID")
    .optional()
    .nullable(),
  status: z.string().optional(),
  priority: z.number().int().min(0).max(5).default(0),
  assignedTo: z.string().uuid("Invalid user ID").optional().nullable(),
  dueDate: z.string().datetime("Invalid date format").optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial().extend({
  startedAt: z.string().datetime("Invalid date format").optional().nullable(),
  completedAt: z.string().datetime("Invalid date format").optional().nullable(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// Query parameter schemas
export const listTasksByOrgQuerySchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  status: taskStatusEnum.optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional(),
});

export const listTasksByAssignedQuerySchema = z.object({
  assignedTo: z.string().uuid("Invalid user ID"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const listTasksByContentQuerySchema = z.object({
  contentItemId: z.string().uuid("Invalid content item ID"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
});

export const assignedToParamSchema = z.object({
  assignedTo: z.string().uuid("Invalid user ID"),
});

export const contentItemIdParamSchema = z.object({
  contentItemId: z.string().uuid("Invalid content item ID"),
});

export const taskResponseSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  contentItemId: z.string().uuid().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdBy: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),

  // Relations
  assignedToUser: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      image: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  contentItem: z
    .object({
      id: z.string().uuid(),
      title: z.string(),
      contentType: z.string().nullable().optional(),
      platform: z.string().nullable().optional(),
      status: z.string().optional(),
      scheduledAt: z.string().nullable().optional(),
      publishedAt: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;
