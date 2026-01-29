import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: "../../apps/server/.env",
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  schemaFilter: ["app"],
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
