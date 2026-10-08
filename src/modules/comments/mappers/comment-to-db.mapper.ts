import { WithId } from "mongodb";
import { CommentInputModel } from "../types/comments-input.type";
import { UserDBModel } from "../../users/types/users-db.type";
import { CommentDBModel } from "../types/comments-db.type";

export const commentToDBMapper = (
  comment: CommentInputModel,
  user: WithId<UserDBModel>,
): Omit<CommentDBModel, "createdAt" | "postId"> => {
  return {
    content: comment.content,
    userId: user._id.toString(),
    userLogin: user.login,
  };
};
