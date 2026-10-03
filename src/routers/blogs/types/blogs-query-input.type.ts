import { Queries } from "../../../core/types/query.type";

export enum BlogSortBy {
  NAME = "name",
  CREATED_AT = "createdAt",
  WEBSITE_URL = "websiteUrl",
  DESCRIPTION = "description",
}

export type BlogQueryInputModel = Queries<BlogSortBy> & {
  searchNameTerm: string;
};
