import { z } from "zod";
import { objectIdRegex } from "../../../../core/utils/regex/object-id.regex";
import { SortDirection } from "../../../../core/types/query.type";
import { BlogSortBy } from "../../types/blogs-query-input.type";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

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
  query: z.object({
    sortBy: z.enum(BlogSortBy).default(BlogSortBy.CREATED_AT),
    sortDirection: z.enum(SortDirection).default(DEFAULT_SORT_DIRECTION),
    pageNumber: z.coerce.number().int().min(1).default(DEFAULT_PAGE_NUMBER),
    pageSize: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
    searchNameTerm: z.string().trim().optional(),
  }),
});

export const blogParamsScheme = (field: string) =>
  z.object({
    params: z.object({
      [field]: z.string().trim().nonempty().regex(objectIdRegex),
    }),
  });
