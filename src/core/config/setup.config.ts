import { base64url } from "jose";
import { z } from "zod";

const envSchema = z
  .object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.string().optional(),
    BASE_PATH: z.string().min(1),
    AUTH_LOGIN: z.string().min(1),
    AUTH_PASSWORD: z.string().min(1),
    MONGO_PATH: z.string().min(1).optional(),
    MONGO_PATH_PROD: z.string().min(1).optional(),
    MONGO_DB_NAME: z.string().min(1).optional(),
    MONGO_DB_NAME_PROD: z.string().min(1).optional(),
    PEPPER: z.string().regex(RegExp(/^[0-9a-fA-F]{64}$/)),
    JWT_SECRET: z.string().regex(RegExp(/^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/)),
  })
  .superRefine((env, ctx) => {
    const production = env.NODE_ENV === "production";
    const requiredKeys = production
      ? (["MONGO_PATH_PROD", "MONGO_DB_NAME_PROD"] as const)
      : (["MONGO_PATH", "MONGO_DB_NAME"] as const);
    for (const key of requiredKeys) {
      if (!env[key]) {
        ctx.addIssue({ code: "custom", path: [key], message: `Missing env variable: ${key}` });
      }
    }
  });

const env = envSchema.parse(process.env);

export const isProduction = env.NODE_ENV === "production";

export const config = {
  port: env.PORT,
  basePath: env.BASE_PATH,
  authLogin: env.AUTH_LOGIN,
  secretPepper: Buffer.from(env.PEPPER, "hex"),
  secretJWT: base64url.decode(env.JWT_SECRET),
  authPassword: env.AUTH_PASSWORD,
  mongodbUrl: isProduction ? (env.MONGO_PATH_PROD as string) : (env.MONGO_PATH as string),
  mongodbName: isProduction ? (env.MONGO_DB_NAME_PROD as string) : (env.MONGO_DB_NAME as string),
} as const;
