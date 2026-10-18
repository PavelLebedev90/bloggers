import { base64url } from "jose";
import { z } from "zod";
import { JWTRegex } from "../consts/regex/regex.const";

const DEFAULT_ACCESS_TTL_SEC = 10; //sec
const DEFAULT_REFRESH_TTL_SEC = 20; //sec

export const jwtEnv = z
  .object({
    JWT_SECRET: z
      .string()
      .regex(JWTRegex)
      .transform((key) => base64url.decode(key)),
    ACCESS_TTL_SEC: z.number().default(DEFAULT_ACCESS_TTL_SEC),
    REFRESH_TTL_SEC: z.number().default(DEFAULT_REFRESH_TTL_SEC),
  })
  .parse(process.env);
