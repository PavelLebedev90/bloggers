import { z } from "zod";
import { objectIdRegex } from "../../../../core/utils/regex/object-id.regex";
import { SortDirection } from "../../../../core/types/query.type";
import { UserSortBy } from "../../types/users-query-input.type";
import { loginScheme } from "../../../../core/utils/schemes/login-scheme";
import { emailScheme } from "../../../../core/utils/schemes/email.scheme";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

export const userCreateScheme = z.object({
  body: z.object({
    login: loginScheme,
    password: z.string().trim().min(6).max(20),
    email: emailScheme,
  }),
});

export const userQueryScheme = z.object({
  query: z.object({
    sortBy: z.enum(UserSortBy).default(UserSortBy.CREATED_AT),
    sortDirection: z.enum(SortDirection).default(DEFAULT_SORT_DIRECTION),
    pageNumber: z.coerce.number().int().min(1).default(DEFAULT_PAGE_NUMBER),
    pageSize: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
    searchLoginTerm: z.string().trim().optional(),
    searchEmailTerm: z.string().trim().optional(),
  }),
});

export const userParamsScheme = z.object({
  params: z.object({
    id: z.string().trim().nonempty().regex(objectIdRegex),
  }),
});
