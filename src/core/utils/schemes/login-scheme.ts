import z from "zod";

export const loginScheme = z
  .string()
  .trim()
  .min(3)
  .max(10)
  .toLowerCase()
  .regex(RegExp(/^[a-zA-Z0-9_-]*$/));
