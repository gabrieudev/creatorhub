import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import {
  createContentItemSchema,
  updateContentItemSchema,
  contentItemResponseSchema,
} from "./content-item.dto";
import { ContentItemService } from "./content-item.service";

const orgIdParam = z.object({ organizationId: z.string().uuid() });
const idParam = z.object({ id: z.string().uuid() });

export default async function contentItemController(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  fastify.get(
    "/organizations/:organizationId/content-items",
    async (request, reply) => {
      const params = orgIdParam.parse(request.params);
      const q = request.query as any;
      const limit = q?.limit ? Number(q.limit) : undefined;
      const offset = q?.offset ? Number(q.offset) : undefined;
      const platform = q?.platform ? String(q.platform) : undefined;
      const status = q?.status ? String(q.status) : undefined;
      const search = q?.q ? String(q.q) : undefined;

      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;
      const list = await ContentItemService.listByOrganization(
        params.organizationId,
        actorUserId,
        { limit, offset, platform, status, q: search },
      );
      return reply.send(list.map((r) => contentItemResponseSchema.parse(r)));
    },
  );

  fastify.post(
    "/organizations/:organizationId/content-items",
    async (request, reply) => {
      const params = orgIdParam.parse(request.params);
      const payload = createContentItemSchema.parse(request.body);
      const actorUserId = (request as any).session?.user?.id as
        | string
        | undefined;

      const created = await ContentItemService.create(
        params.organizationId,
        payload,
        actorUserId,
      );
      return reply.code(201).send(contentItemResponseSchema.parse(created));
    },
  );

  fastify.get("/content-items/:id", async (request, reply) => {
    const params = idParam.parse(request.params);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    const item = await ContentItemService.getById(params.id, actorUserId);
    return reply.send(contentItemResponseSchema.parse(item));
  });

  fastify.patch("/content-items/:id", async (request, reply) => {
    const params = idParam.parse(request.params);
    const payload = updateContentItemSchema.parse(request.body);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    const updated = await ContentItemService.update(
      params.id,
      payload,
      actorUserId,
    );
    return reply.send(contentItemResponseSchema.parse(updated));
  });

  fastify.delete("/content-items/:id", async (request, reply) => {
    const params = idParam.parse(request.params);
    const actorUserId = (request as any).session?.user?.id as
      | string
      | undefined;

    await ContentItemService.remove(params.id, actorUserId);
    return reply.code(204).send();
  });
}
