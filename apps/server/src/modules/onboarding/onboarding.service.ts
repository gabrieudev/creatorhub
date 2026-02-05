import { isUniqueViolation, parse, slugify } from "@/lib/utils";
import { db } from "@CreatorHub/db";
import {
  organizationMembersInApp,
  organizationsInApp,
  permissionsInApp,
  rolePermissionsInApp,
  rolesInApp,
} from "@CreatorHub/db/schema/schema";
import { inArray, sql } from "drizzle-orm";
import { ConflictError, ForbiddenError } from "../../lib/errors";
import { onboardingSchema } from "./onboarding.dto";

const MAX_SLUG_ATTEMPTS = 6;

export const OnboardingService = {
  async createOrganizationForUser(
    userId: string,
    input: unknown,
    actorUserId?: string,
  ) {
    const data = parse(onboardingSchema, input);

    // se houver sessão, só permite criar org para o próprio usuário
    if (actorUserId && actorUserId !== userId) {
      throw new ForbiddenError(
        "Você não tem permissão para criar uma organização para outro usuário",
      );
    }

    const baseSlug =
      data.slug && String(data.slug).trim()
        ? slugify(String(data.slug))
        : slugify(data.name);

    return await db.transaction(async (tx) => {
      // tenta variações de slug até conseguir inserir
      for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
        const candidateSlug =
          attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;

        // verifica existência prévia
        const existing = await tx
          .select()
          .from(organizationsInApp)
          .where(
            sql`lower(${organizationsInApp.slug}) = ${candidateSlug.toLowerCase()}`,
          );

        if (existing.length > 0) {
          continue;
        }

        try {
          const [org] = await tx
            .insert(organizationsInApp)
            .values({
              name: data.name,
              slug: candidateSlug,
              timezone: data.timezone ?? "UTC",
              locale: data.locale ?? "pt_BR",
              currency: data.currency ?? "BRL",
              whiteLabel: data.whiteLabel ?? false,
              branding: data.branding ?? {},
              billingInfo: data.billingInfo ?? {},
              settings: data.settings ?? {},
            })
            .returning();

          // cria roles
          const [adminRole, managerRole, editorRole, viewerRole] = await tx
            .insert(rolesInApp)
            .values([
              {
                organizationId: String(org?.id),
                name: "Admin",
                description: "Organization administrator with full permissions",
                isBuiltin: true,
                createdAt: new Date().toISOString(),
              },
              {
                organizationId: String(org?.id),
                name: "Manager",
                description: "Organization manager with elevated permissions",
                isBuiltin: true,
                createdAt: new Date().toISOString(),
              },
              {
                organizationId: String(org?.id),
                name: "Editor",
                description: "Content editor with limited permissions",
                isBuiltin: true,
                createdAt: new Date().toISOString(),
              },
              {
                organizationId: String(org?.id),
                name: "Viewer",
                description: "Read-only access to organization resources",
                isBuiltin: true,
                createdAt: new Date().toISOString(),
              },
            ])
            .returning();

          const permissions = await tx
            .select()
            .from(permissionsInApp)
            .where(
              inArray(permissionsInApp.code, [
                "org.view",
                "org.update",
                "org.delete",
              ]),
            );

          const permissionsByCode = Object.fromEntries(
            permissions.map((p) => [p.code, p]),
          );

          const viewPermission = permissionsByCode["org.view"];
          const updatePermission = permissionsByCode["org.update"];
          const deletePermission = permissionsByCode["org.delete"];

          const [rolePermissions] = await tx
            .insert(rolePermissionsInApp)
            .values([
              {
                roleId: String(adminRole?.id),
                permissionId: String(viewPermission?.id),
              },
              {
                roleId: String(adminRole?.id),
                permissionId: String(updatePermission?.id),
              },
              {
                roleId: String(adminRole?.id),
                permissionId: String(deletePermission?.id),
              },
              {
                roleId: String(managerRole?.id),
                permissionId: String(viewPermission?.id),
              },
              {
                roleId: String(managerRole?.id),
                permissionId: String(updatePermission?.id),
              },
              {
                roleId: String(editorRole?.id),
                permissionId: String(viewPermission?.id),
              },
              {
                roleId: String(viewerRole?.id),
                permissionId: String(viewPermission?.id),
              },
            ])
            .returning();

          const [member] = await tx
            .insert(organizationMembersInApp)
            .values({
              organizationId: String(org?.id),
              userId,
              roleId: String(adminRole?.id),
              joinedAt: new Date().toISOString(),
              isOwner: true,
              preferences: {},
              flActive: true,
            })
            .returning();

          return {
            organization: org,
            member: member,
            roles: {
              adminRole,
              managerRole,
              editorRole,
              viewerRole,
            },
            rolePermissions: rolePermissions,
          };
        } catch (err: any) {
          if (isUniqueViolation(err)) {
            if (attempt + 1 >= MAX_SLUG_ATTEMPTS) {
              throw new ConflictError(
                "Não foi possível gerar um slug único para a organização",
              );
            }
            continue;
          }
          throw err;
        }
      }

      throw new ConflictError(
        "Não foi possível gerar um slug único para a organização",
      );
    });
  },
};
