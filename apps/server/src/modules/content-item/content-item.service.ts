import { parse } from "@/lib/utils";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import { OrganizationMemberRepository } from "../organization-member/organization-member.repository";
import { OrganizationRepository } from "../organization/organization.repository";
import {
  type CreateContentItemInput,
  createContentItemSchema,
  updateContentItemSchema,
} from "./content-item.dto";
import { ContentItemRepository } from "./content-item.repository";

export const ContentItemService = {
  async create(organizationId: string, input: unknown, actorUserId?: string) {
    const data = parse(createContentItemSchema, input);

    // verifica se a organização existe
    const org = await OrganizationRepository.findById(organizationId);
    if (!org) throw new NotFoundError("Organization not found");

    // verifica se o ator é um membro da organização
    if (!actorUserId) throw new ForbiddenError("Authentication required");
    const actorMembership = await OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      actorUserId,
    );
    if (!actorMembership)
      throw new ForbiddenError("Not a member of this organization");

    const payload: CreateContentItemInput & { createdBy: string } = {
      ...data,
      createdBy: actorUserId,
    };

    // se o status for 'published', apenas owners podem criar assim
    if (payload.status === "published") {
      if (!actorMembership.isOwner) {
        throw new ForbiddenError(
          "Only organization owners can publish content",
        );
      }
      // se publishedAt não for fornecido, define como agora
      if (!payload.publishedAt) {
        (payload as any).publishedAt = new Date().toISOString();
      }
    }

    const created = await ContentItemRepository.create(organizationId, payload);
    return created;
  },

  async getById(id: string, actorUserId?: string) {
    const item = await ContentItemRepository.findById(id);
    if (!item) throw new NotFoundError("Content item not found");

    // se a visibilidade for privada, apenas membros podem acessar
    if (item.visibility === "private") {
      if (!actorUserId) throw new ForbiddenError("Authentication required");
      const membership = await OrganizationMemberRepository.findByOrgAndUser(
        String(item.organizationId),
        actorUserId,
      );
      if (!membership)
        throw new ForbiddenError("Not a member of this organization");
    }
    return item;
  },

  async listByOrganization(
    organizationId: string,
    actorUserId?: string,
    opts?: {
      limit?: number;
      offset?: number;
      platform?: string;
      status?: string;
      q?: string;
    },
  ) {
    // se actorUserId fornecido, garante associação ao solicitar itens privados - mas a listagem retorna apenas itens e o filtro por visibilidade fica a cargo do chamador
    if (actorUserId) {
      const membership = await OrganizationMemberRepository.findByOrgAndUser(
        organizationId,
        actorUserId,
      );
      if (!membership)
        throw new ForbiddenError("Not a member of this organization");
    }
    return ContentItemRepository.listByOrganization(organizationId, opts);
  },

  async update(id: string, input: unknown, actorUserId?: string) {
    const data = parse(updateContentItemSchema, input);

    const existing = await ContentItemRepository.findById(id);
    if (!existing) throw new NotFoundError("Content item not found");

    // determina as permissões do ator: owner OU creator pode atualizar
    if (!actorUserId) throw new ForbiddenError("Authentication required");
    const actorMembership = await OrganizationMemberRepository.findByOrgAndUser(
      String(existing.organizationId),
      actorUserId,
    );
    if (!actorMembership)
      throw new ForbiddenError("Not a member of this organization");

    const isOwner = actorMembership.isOwner;
    const isCreator = String(existing.createdBy) === actorUserId;

    if (!isOwner && !isCreator)
      throw new ForbiddenError(
        "Only owner or creator may update this content item",
      );

    // se status for alterado para 'published', apenas owners podem fazer isso
    if (data.status === "published" && !isOwner) {
      throw new ForbiddenError("Only owners can publish content");
    }

    // se status for alterado para 'published' e publishedAt não estiver definido, define como agora
    if (data.status === "published" && !data.publishedAt) {
      (data as any).publishedAt = new Date().toISOString();
    }

    const updated = await ContentItemRepository.update(id, data);
    if (!updated)
      throw new NotFoundError("Content item not found after update");
    return updated;
  },

  async remove(id: string, actorUserId?: string) {
    const existing = await ContentItemRepository.findById(id);
    if (!existing) throw new NotFoundError("Content item not found");

    if (!actorUserId) throw new ForbiddenError("Authentication required");
    const actorMembership = await OrganizationMemberRepository.findByOrgAndUser(
      String(existing.organizationId),
      actorUserId,
    );
    if (!actorMembership)
      throw new ForbiddenError("Not a member of this organization");

    const isOwner = actorMembership.isOwner;
    const isCreator = String(existing.createdBy) === actorUserId;

    if (!isOwner && !isCreator)
      throw new ForbiddenError(
        "Only owner or creator may delete this content item",
      );

    await ContentItemRepository.delete(id);
    return;
  },
};
