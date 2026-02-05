import { ZodError } from "zod";
import {
  createRoleSchema,
  createRolesBatchSchema,
  updateRoleSchema,
  type CreateRoleInput,
  type UpdateRoleInput,
} from "./role.dto";
import { RoleRepository } from "./role.repository";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
  ForbiddenError,
} from "../../lib/errors";
import { OrganizationMemberRepository } from "../organization-member/organization-member.repository";
import { isUniqueViolation, parse } from "@/lib/utils";

export const RoleService = {
  async listByOrganization(
    organizationId: string,
    actorUserId?: string,
    opts?: { limit?: number; offset?: number },
  ) {
    // somente membros podem listar roles
    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        organizationId,
        actorUserId,
      );
      if (!actor) throw new ForbiddenError("Você não é membro da organização");
    }
    return RoleRepository.listByOrganization(organizationId, opts);
  },

  async create(organizationId: string, input: unknown, actorUserId?: string) {
    const data = parse(createRoleSchema, input);

    // somente owners podem criar roles (a menos que actorUserId seja omitido para o sistema)
    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        organizationId,
        actorUserId,
      );

      if (!actor || !actor.isOwner)
        throw new ForbiddenError(
          "Somente proprietários da organização podem criar roles",
        );
    }

    // verificação de unicidade
    const existing = await RoleRepository.findByOrgAndName(
      organizationId,
      data.name,
    );
    if (existing)
      throw new ConflictError("O nome da função já existe na organização");

    try {
      const created = await RoleRepository.create(organizationId, data);
      return created;
    } catch (err: any) {
      if (isUniqueViolation(err))
        throw new ConflictError("O nome da função já existe");
      throw err;
    }
  },

  async createMany(
    organizationId: string,
    input: unknown,
    actorUserId?: string,
  ) {
    let items: CreateRoleInput[];
    try {
      items = createRolesBatchSchema.parse(input);
    } catch (err) {
      if (err instanceof ZodError) throw err;
      throw new BadRequestError("Dados inválidos");
    }

    if (items.length === 0) throw new BadRequestError("Payload vazio");

    // somente owners podem criar roles
    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        organizationId,
        actorUserId,
      );
      if (!actor || !actor.isOwner)
        throw new ForbiddenError(
          "Somente proprietários da organização podem criar roles",
        );
    }

    // detectar duplicatas no payload (case-insensitive)
    const lowerMap = new Map<string, number>();
    for (const it of items) {
      const low = it.name.toLowerCase();
      if (lowerMap.has(low)) {
        throw new BadRequestError(
          `Nome de função duplicado no payload: ${it.name}`,
        );
      }
      lowerMap.set(low, 1);
    }

    // verificar existência prévia
    const existing = await RoleRepository.findByOrgAndNames(
      organizationId,
      items.map((i) => i.name),
    );
    if (existing.length > 0) {
      const names = existing.map((r: any) => r.name).join(", ");
      throw new ConflictError(`Roles já existem: ${names}`);
    }

    try {
      const created = await RoleRepository.createMany(organizationId, items);
      return created;
    } catch (err: any) {
      if (isUniqueViolation(err))
        throw new ConflictError("Conflito de nome de função");
      throw err;
    }
  },

  async getById(roleId: string) {
    const r = await RoleRepository.findById(roleId);
    if (!r) throw new NotFoundError("Função não encontrada");
    return r;
  },

  async update(roleId: string, input: unknown, actorUserId?: string) {
    const data = parse(updateRoleSchema, input);

    const existing = await RoleRepository.findById(roleId);
    if (!existing) throw new NotFoundError("Role não encontrada");

    // somente owners podem atualizar
    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        existing.organizationId,
        actorUserId,
      );
      if (!actor || !actor.isOwner)
        throw new ForbiddenError(
          "Somente proprietários da organização podem atualizar funções",
        );
    }

    // Se o nome mudou, garantir unicidade
    if (
      data.name &&
      data.name.toLowerCase() !== String(existing.name).toLowerCase()
    ) {
      const other = await RoleRepository.findByOrgAndName(
        existing.organizationId,
        data.name,
      );
      if (other) throw new ConflictError("O nome da função já existe");
    }

    // roles built-in não podem ser modificadas
    if (existing.isBuiltin && data.isBuiltin === false) {
      throw new ForbiddenError("Funções built-in não podem ser modificadas");
    }

    const updated = await RoleRepository.update(roleId, data);
    if (!updated)
      throw new NotFoundError("Função não encontrada após atualização");
    return updated;
  },

  async remove(roleId: string, actorUserId?: string) {
    const existing = await RoleRepository.findById(roleId);
    if (!existing) throw new NotFoundError("Role não encontrada");

    // somente owners podem deletar
    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        existing.organizationId,
        actorUserId,
      );
      if (!actor || !actor.isOwner)
        throw new ForbiddenError(
          "Somente proprietários da organização podem deletar funções",
        );
    }

    if (existing.isBuiltin)
      throw new ForbiddenError("Funções built-in não podem ser deletadas");

    await RoleRepository.delete(roleId);
    return;
  },
};
