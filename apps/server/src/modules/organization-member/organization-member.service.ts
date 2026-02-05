import { isUniqueViolation, parse } from "@/lib/utils";
import { ZodError } from "zod";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../lib/errors";
import {
  createOrganizationMemberSchema,
  updateOrganizationMemberSchema,
  type UpdateOrganizationMemberInput,
} from "./organization-member.dto";
import { OrganizationMemberRepository } from "./organization-member.repository";

export const OrganizationMemberService = {
  async create(organizationId: string, input: unknown, actorUserId?: string) {
    const data = parse(createOrganizationMemberSchema, input);

    if (actorUserId) {
      const actorMembership =
        await OrganizationMemberRepository.findByOrgAndUser(
          organizationId,
          actorUserId,
        );

      if (!actorMembership) {
        throw new ForbiddenError("Você não é membro desta organização");
      }

      const members = await OrganizationMemberRepository.listByOrganization(
        organizationId,
        { limit: 1 },
      );

      const orgHasMembers = members.length > 0;
      if (orgHasMembers) {
        if (!actorMembership || !actorMembership?.isOwner) {
          throw new ForbiddenError(
            "Somente proprietários da organização podem adicionar membros",
          );
        }
      }
    }

    try {
      if (data.isOwner) {
        const owners =
          await OrganizationMemberRepository.findOwners(organizationId);
        if (owners.length > 0) {
          throw new ConflictError("Organização já tem um proprietário");
        }
      }

      const created = await OrganizationMemberRepository.create(
        organizationId,
        data,
      );
      return created;
    } catch (err: any) {
      if (isUniqueViolation(err)) {
        throw new ConflictError("Usuário já é membro desta organização");
      }
      throw err;
    }
  },

  async getByOrgAndUser(organizationId: string, userId: string) {
    return OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      userId,
    );
  },

  async listByOrganization(
    organizationId: string,
    actorUserId?: string,
    opts?: { limit?: number; offset?: number },
  ) {
    if (actorUserId) {
      const actorMembership =
        await OrganizationMemberRepository.findByOrgAndUser(
          organizationId,
          actorUserId,
        );
      if (!actorMembership)
        throw new ForbiddenError("Você não é membro desta organização");
    }
    return OrganizationMemberRepository.listByOrganization(
      organizationId,
      opts,
    );
  },

  async updateByOrgAndUser(
    organizationId: string,
    userId: string,
    input: unknown,
    actorUserId?: string,
  ) {
    const data = parse(updateOrganizationMemberSchema, input);

    const existing = await OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      userId,
    );

    if (!existing)
      throw new NotFoundError("Membro da organização não encontrado");

    if (actorUserId) {
      const actorMembership =
        await OrganizationMemberRepository.findByOrgAndUser(
          organizationId,
          actorUserId,
        );
      if (!actorMembership || !actorMembership?.isOwner) {
        throw new ForbiddenError(
          "Somente proprietários da organização podem atualizar membros",
        );
      }
    }

    if (
      (input as any).organizationId &&
      (input as any).organizationId !== existing?.organizationId
    ) {
      throw new BadRequestError(
        "Não é possível alterar o campo imutável 'organizationId'",
      );
    }
    if ((input as any).userId && (input as any).userId !== existing?.userId) {
      throw new BadRequestError(
        "Não é possível alterar o campo imutável 'userId'",
      );
    }

    if (data.isOwner === true && !existing?.isOwner) {
      const owners = await OrganizationMemberRepository.findOwners(
        existing?.organizationId,
      );
      if (owners.length > 0) {
        throw new ConflictError("Organização já tem um proprietário");
      }
    }

    const updated = await OrganizationMemberRepository.updateByOrgAndUser(
      organizationId,
      userId,
      data,
    );
    if (!updated)
      throw new NotFoundError("Membro da organização não encontrado");
    return updated;
  },

  async removeByOrgAndUser(
    organizationId: string,
    userId: string,
    actorUserId?: string,
  ) {
    const existing = await OrganizationMemberRepository.findByOrgAndUser(
      organizationId,
      userId,
    );
    if (!existing)
      throw new NotFoundError("Membro da organização não encontrado");

    if (actorUserId) {
      const actorMembership =
        await OrganizationMemberRepository.findByOrgAndUser(
          organizationId,
          actorUserId,
        );
      if (!actorMembership || !actorMembership?.isOwner) {
        throw new ForbiddenError(
          "Somente proprietários da organização podem remover membros",
        );
      }
    }

    if (existing?.isOwner) {
      const ownerCount = await OrganizationMemberRepository.countOwners(
        existing?.organizationId,
      );
      if (ownerCount <= 1) {
        throw new ConflictError(
          "Não é possível remover o último proprietário da organização",
        );
      }
    }

    await OrganizationMemberRepository.deleteByOrgAndUser(
      organizationId,
      userId,
    );
    return;
  },
};
