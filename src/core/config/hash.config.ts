import { z } from "zod";
import { pepperRegex } from "../consts/regex/regex.const";

export const hashEnv = z
  .object({
    PEPPER: z
      .string()
      .regex(pepperRegex)
      .transform((key) => Buffer.from(key, "hex")),
  })
  .parse(process.env);
