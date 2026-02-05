import type { z, ZodObject } from "zod";
import { BadRequestError } from "./errors";

/**  slugify de strings */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/** detecta erro de violação de unicidade do Postgres/Drizzle */
export function isUniqueViolation(err: any) {
  if (!err) return false;
  const code = err.code ?? err?.cause?.code ?? err?.original?.code;
  if (code === "23505") return true;
  if (err?.constraint || err?.meta?.constraint) return true;
  return false;
}

/** parseia dados com schema Zod, lançando BadRequestError em caso de falha */
export function parse<T extends ZodObject>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new BadRequestError("Dados de consulta inválidos");
  }
  return result.data;
}
