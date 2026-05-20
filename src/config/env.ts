import { z } from "zod";

function parseEnvBool(value: unknown): boolean {
  return value === true || value === "true";
}

const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:3000/api"),
  VITE_USE_MOCK: z.boolean().default(false),
});

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_USE_MOCK:
    parseEnvBool(import.meta.env.VITE_USE_MOCK) ||
    parseEnvBool(import.meta.env.VITE_USE_MOCK_AUTH),
});
