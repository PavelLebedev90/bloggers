import { z } from "zod";
import { objectIdRegex } from "../../../../core/utils/regex/object-id.regex";
import { SortDirection } from "../../../../core/types/query.type";
import { PostSortBy } from "../../types/posts-query-input.type";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

export const postCreateScheme = z.object({
  body: z.object({
    title: z.string().trim().nonempty().max(30),
    shortDescription: z.string().trim().nonempty().max(100),
    content: z.string().trim().nonempty().max(1000),
  }),
});
export const postCreateSchemeWithBlogId = z.object({
  body: postCreateScheme.shape.body.extend({
    blogId: z.string().trim().nonempty().regex(objectIdRegex),
  }),
});

export const postUpdateScheme = postCreateSchemeWithBlogId;

export const postQueryScheme = z.object({
  query: z.object({
    sortBy: z.enum(PostSortBy).default(PostSortBy.CREATED_AT),
    sortDirection: z.enum(SortDirection).default(DEFAULT_SORT_DIRECTION),
    pageNumber: z.coerce.number().int().min(1).default(DEFAULT_PAGE_NUMBER),
    pageSize: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
  }),
});

export const postParamsScheme = z.object({
  params: z.object({
    id: z.string().trim().nonempty().regex(objectIdRegex),
  }),
});
