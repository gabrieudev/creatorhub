import { ZodError } from "zod";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
} from "./organization.dto";
import { OrganizationRepository } from "./organization.repository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../lib/errors";
import { isUniqueViolation, slugify } from "@/lib/utils";

const MAX_SLUG_ATTEMPTS = 5;

export const OrganizationService = {
  async create(input: unknown) {
    let data: CreateOrganizationInput;
    try {
      data = createOrganizationSchema.parse(input);
    } catch (err) {
      if (err instanceof ZodError) throw err;
      throw new BadRequestError("Invalid payload");
    }

    const baseSlug =
      data.slug && String(data.slug).trim()
        ? slugify(String(data.slug))
        : slugify(data.name);

    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
      try {
        const created = await OrganizationRepository.create({
          ...data,
          slug: candidate,
        });
        return created;
      } catch (err: any) {
        if (isUniqueViolation(err)) {
          if (attempt + 1 >= MAX_SLUG_ATTEMPTS) {
            throw new ConflictError(
              "Could not generate unique slug after multiple attempts",
              {
                baseSlug,
                attempts: MAX_SLUG_ATTEMPTS,
              },
            );
          }
          continue;
        }
        throw err;
      }
    }

    throw new ConflictError("Could not generate unique slug");
  },

  async getById(id: string) {
    return OrganizationRepository.findById(id);
  },

  async getBySlug(slug: string) {
    return OrganizationRepository.findBySlug(slug);
  },

  async list(opts?: { limit?: number; offset?: number }) {
    return OrganizationRepository.list(opts);
  },

  async update(id: string, input: unknown) {
    let data: UpdateOrganizationInput;
    try {
      data = updateOrganizationSchema.parse(input);
    } catch (err) {
      if (err instanceof ZodError) throw err;
      throw new BadRequestError("Invalid payload");
    }

    const existing = await OrganizationRepository.findById(id);
    if (!existing) throw new NotFoundError("Organization not found");

    if ((input as any)?.id && (input as any).id !== id) {
      throw new BadRequestError("Cannot change immutable field 'id'");
    }
    if (
      (input as any)?.createdAt &&
      (input as any).createdAt !== existing.createdAt
    ) {
      throw new BadRequestError("Cannot change immutable field 'createdAt'");
    }

    // Se slug não está sendo alterado, faz update simples
    if (!data.slug) {
      const updated = await OrganizationRepository.update(id, data);
      if (!updated) throw new NotFoundError("Organization not found");
      return updated;
    }

    // slug fornecido: tentar atualização com retries em unique violations
    const baseSlug = data.slug.trim()
      ? slugify(data.slug)
      : slugify(existing.name);

    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
      try {
        const updated = await OrganizationRepository.update(id, {
          ...data,
          slug: candidate,
        });
        if (!updated) throw new NotFoundError("Organization not found");
        return updated;
      } catch (err: any) {
        if (isUniqueViolation(err)) {
          if (attempt + 1 >= MAX_SLUG_ATTEMPTS) {
            throw new ConflictError(
              "Could not generate unique slug after multiple attempts",
              {
                baseSlug,
                attempts: MAX_SLUG_ATTEMPTS,
              },
            );
          }
          continue;
        }
        throw err;
      }
    }

    throw new ConflictError("Could not generate unique slug");
  },

  async remove(id: string) {
    const existing = await OrganizationRepository.findById(id);
    if (!existing) throw new NotFoundError("Organization not found");

    // TODO: checar dependências (ex.: projetos, invoices) antes de apagar

    await OrganizationRepository.delete(id);
    return;
  },
};
