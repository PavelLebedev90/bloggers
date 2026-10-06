import z from "zod";

export const emailScheme = z
  .string()
  .trim()
  .max(100)
  .toLowerCase()
  .regex(RegExp(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/));
