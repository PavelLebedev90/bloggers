import { z } from "zod";
const DEFAULT_REFRESH_NAME = "refreshToken";

export const cookieEnv = z
  .object({
    REFRESH_NAME: z.string().min(1).default(DEFAULT_REFRESH_NAME),
  })
  .parse(process.env);
