import { CommentInputModel } from "../types/comments-input.type";
import { CommentDBModel } from "../types/comments-db.type";
import { UserOutputModel } from "../../users/types/users-output.type";

export const commentToDBMapper = (
  comment: CommentInputModel,
  user: UserOutputModel,
): Omit<CommentDBModel, "createdAt" | "postId"> => {
  return {
    content: comment.content,
    userId: user.id,
    userLogin: user.login,
  };
};
