import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  contentItemId: z.string().uuid().optional().nullable(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  contentItemId: z.string().uuid().optional().nullable(),
  status: z.string().optional(),
  priority: z.number().int().optional(),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional(),
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

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
  createdBy: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type TaskResponse = z.infer<typeof taskResponseSchema>;
