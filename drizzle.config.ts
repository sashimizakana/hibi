import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  driver: "expo",
  out: "./db/migrations",
}) satisfies Config;
