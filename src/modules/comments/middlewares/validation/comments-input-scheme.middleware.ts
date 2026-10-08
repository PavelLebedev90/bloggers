import { z } from "zod";
import { objectIdRegex } from "../../../../core/utils/regex/object-id.regex";
import { CommentSortBy } from "../../types/comments-query-input.type";
import { SortDirection } from "../../../../core/types/query.type";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

export const commentQueryScheme = z.object({
  query: z.object({
    sortBy: z.enum(CommentSortBy).default(CommentSortBy.CREATED_AT),
    sortDirection: z.enum(SortDirection).default(DEFAULT_SORT_DIRECTION),
    pageNumber: z.coerce.number().int().min(1).default(DEFAULT_PAGE_NUMBER),
    pageSize: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
  }),
});

export const commentCreateScheme = z.object({
  body: z.object({
    content: z.string().trim().nonempty().min(20).max(300),
  }),
});

export const commentUpdateScheme = commentCreateScheme;

export const commentParamsScheme = z.object({
  params: z.object({
    commentId: z.string().trim().nonempty().regex(objectIdRegex),
  }),
});
