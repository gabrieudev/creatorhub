import { ZodError } from "zod";
import {
  createRolePermissionSchema,
  createRolePermissionsBatchSchema,
  type CreateRolePermissionInput,
} from "./role-permission.dto";
import { RolePermissionRepository } from "./role-permission.repository";
import { RoleRepository } from "../role/role.repository";
import { OrganizationMemberRepository } from "../organization-member/organization-member.repository";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
  ForbiddenError,
} from "../../lib/errors";
import { isUniqueViolation } from "@/lib/utils";

export const RolePermissionService = {
  async listByRole(
    roleId: string,
    actorUserId?: string,
    opts?: { limit?: number; offset?: number },
  ) {
    const role = await RoleRepository.findById(roleId);
    if (!role) throw new NotFoundError("Role não encontrada");

    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        String(role.organizationId),
        actorUserId,
      );
      if (!actor)
        throw new ForbiddenError("Você não é membro desta organização");
    }

    return RolePermissionRepository.listByRole(roleId, opts);
  },

  async create(roleId: string, input: unknown, actorUserId?: string) {
    let data: CreateRolePermissionInput;
    try {
      data = createRolePermissionSchema.parse(input);
    } catch (err) {
      if (err instanceof ZodError) throw err;
      throw new BadRequestError("Dados inválidos");
    }

    // verifica se a role existe
    const role = await RoleRepository.findById(roleId);
    if (!role) throw new NotFoundError("Role não encontrada");

    // apenas owners podem adicionar permissões
    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        String(role.organizationId),
        actorUserId,
      );
      if (!actor || !actor.isOwner)
        throw new ForbiddenError(
          "Somente proprietários da organização podem modificar permissões de função",
        );
    }

    // verifica se a permissão existe
    const exists = await RolePermissionRepository.permissionExists(
      data.permissionId,
    );
    if (!exists) throw new NotFoundError("Permissão não encontrada");

    // verifica se já está presente
    const existing = await RolePermissionRepository.find(
      roleId,
      data.permissionId,
    );
    if (existing) throw new ConflictError("Permissão já atribuída à função");

    try {
      const created = await RolePermissionRepository.create(
        roleId,
        data.permissionId,
      );
      return created;
    } catch (err: any) {
      if (isUniqueViolation(err))
        throw new ConflictError("Permissão já atribuída à função");
      throw err;
    }
  },

  async createMany(roleId: string, input: unknown, actorUserId?: string) {
    let items: CreateRolePermissionInput[];
    try {
      items = createRolePermissionsBatchSchema.parse(input);
    } catch (err) {
      if (err instanceof ZodError) throw err;
      throw new BadRequestError("Dados inválidos");
    }

    if (items.length === 0) throw new BadRequestError("Payload vazio");

    // verifica se a role existe
    const role = await RoleRepository.findById(roleId);
    if (!role) throw new NotFoundError("Role não encontrada");

    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        String(role.organizationId),
        actorUserId,
      );
      if (!actor || !actor.isOwner)
        throw new ForbiddenError(
          "Somente proprietários da organização podem modificar permissões de função",
        );
    }

    const permissionIds = items.map((it) => it.permissionId);

    const seen = new Set<string>();
    for (const pid of permissionIds) {
      const low = pid;
      if (seen.has(low))
        throw new BadRequestError(`Permissão duplicada no payload: ${pid}`);
      seen.add(low);
    }

    // valida existência das permissões
    const existingPermissions =
      await RolePermissionRepository.findExistingPermissions(permissionIds);
    const existingIds = new Set(
      (existingPermissions as any[]).map((p) => String(p.id)),
    );
    const missing = permissionIds.filter((p) => !existingIds.has(p));
    if (missing.length > 0) {
      throw new NotFoundError(
        `Permissões não encontradas: ${missing.join(", ")}`,
      );
    }

    // verifica se já está presente (busca atribuições atuais para a função)
    const current = await RolePermissionRepository.listByRole(roleId, {
      limit: 1000,
      offset: 0,
    });
    const assigned = new Set(
      (current as any[]).map((r) => String(r.permissionId)),
    );
    const toCreate = permissionIds.filter((p) => !assigned.has(p));
    if (toCreate.length === 0) {
      throw new ConflictError(
        "Todas as permissões já estão atribuídas à função",
      );
    }

    try {
      const created = await RolePermissionRepository.createMany(
        roleId,
        toCreate,
      );
      return created;
    } catch (err: any) {
      if (isUniqueViolation(err))
        throw new ConflictError("Conflito ao atribuir permissões à função");
      throw err;
    }
  },

  async get(roleId: string, permissionId: string) {
    const rp = await RolePermissionRepository.find(roleId, permissionId);
    if (!rp) throw new NotFoundError("Permissão de função não encontrada");
    return rp;
  },

  async remove(roleId: string, permissionId: string, actorUserId?: string) {
    const existing = await RolePermissionRepository.find(roleId, permissionId);
    if (!existing)
      throw new NotFoundError("Permissão de função não encontrada");

    const role = await RoleRepository.findById(roleId);
    if (!role) throw new NotFoundError("Role não encontrada");

    if (actorUserId) {
      const actor = await OrganizationMemberRepository.findByOrgAndUser(
        String(role.organizationId),
        actorUserId,
      );
      if (!actor || !actor.isOwner)
        throw new ForbiddenError(
          "Somente proprietários da organização podem remover permissões de função",
        );
    }

    await RolePermissionRepository.deleteByRoleAndPermission(
      roleId,
      permissionId,
    );
    return;
  },
};
