import { z } from "zod";
import { objectIdRegex } from "../../../../core/utils/regex/object-id.regex";

export const postCreateScheme = z.object({
  body: z.object({
    title: z.string().trim().nonempty().max(30),
    shortDescription: z.string().trim().nonempty().max(100),
    content: z.string().trim().nonempty().max(1000),
    blogId: z.string().trim().nonempty(),
  }),
});

export const postUpdateScheme = postCreateScheme;

export const postQueryScheme = z.object({
  query: z.object({}),
});

export const postParamsScheme = z.object({
  params: z.object({
    id: z.string().trim().nonempty().regex(objectIdRegex),
  }),
});
