import { Queries } from "../../../core/types/query.type";

export enum PostSortBy {
  TITLE = "title",
  CREATED_AT = "createdAt",
  SHORT_DESCRIPTION = "shortDescription",
  BLOG_NAME = "blogName",
  CONTENT = "content",
}

export type PostQueryInputModel = Queries<PostSortBy> & {
  blogId?: string;
};
