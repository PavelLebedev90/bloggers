import { z } from "zod";
import { objectIdRegex } from "../../../../core/utils/regex/object-id.regex";

export const blogCreateScheme = z.object({
  body: z.object({
    name: z.string().trim().nonempty().max(15),
    description: z.string().trim().nonempty().max(500),
    websiteUrl: z
      .string()
      .trim()
      .nonempty()
      .max(100)
      .regex(RegExp(`^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$`)),
  }),
});

export const blogUpdateScheme = blogCreateScheme;

export const blogQueryScheme = z.object({
  query: z.object({}),
});

export const blogParamsScheme = z.object({
  params: z.object({
    id: z.string().trim().nonempty().regex(objectIdRegex),
  }),
});
