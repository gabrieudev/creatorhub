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
