import { z } from "zod";

const DEFAULT_SMTP_HOST = "smtp.gmail.com";
const DEFAULT_SMTP_PORT = 465;
const DEFAULT_SMTP_SECURE = "true";
const DEFAULT_SMTP_CONFIRMATION_URL = "http://localhost:3000";

export const smtpEnv = z
  .object({
    SMTP_HOST: z.string().min(1).default(DEFAULT_SMTP_HOST),
    SMTP_PORT: z.coerce.number().default(DEFAULT_SMTP_PORT),
    SMTP_SECURE: z
      .string()
      .default(DEFAULT_SMTP_SECURE)
      .transform((s) => s === "true"),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM: z.string().min(1).optional(),
    SMTP_CONFIRMATION_URL: z.url().default(DEFAULT_SMTP_CONFIRMATION_URL),
  })
  .transform((env) => ({
    ...env,
    SMTP_FROM: env.SMTP_FROM ?? env.SMTP_USER,
  }))
  .parse(process.env);
