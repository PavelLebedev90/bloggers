import { Queries } from "../../../core/types/query.type";

export enum CommentSortBy {
  CONTENT = "content",
  CREATED_AT = "createdAt",
}

export type CommentQueryInputModel = Queries<CommentSortBy> & {
  postId?: string;
};
