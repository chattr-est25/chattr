import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/lib/env";

export default defineConfig({
  casing: "camelCase",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
});
