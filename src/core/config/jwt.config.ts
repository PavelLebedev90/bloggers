import { base64url } from "jose";
import { z } from "zod";
import { JWTRegex } from "../consts/regex/regex.const";

export const jwtEnv = z
  .object({
    JWT_SECRET: z
      .string()
      .regex(JWTRegex)
      .transform((key) => base64url.decode(key)),
  })
  .parse(process.env);
