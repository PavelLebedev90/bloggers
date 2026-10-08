import { WithId } from "mongodb";
import { CommentDBModel } from "../types/comments-db.type";
import { CommentOutputModel } from "../types/comments-output.type";

export const commentToOutputMapper = (comment: WithId<CommentDBModel>): CommentOutputModel => {
  const { _id, content, userId, userLogin, createdAt } = comment;
  return {
    id: _id.toString(),
    commentatorInfo: {
      userId,
      userLogin,
    },
    content,
    createdAt,
  };
};

export const commentsToOutputMapper = (dbData: WithId<CommentDBModel>[]) => {
  return dbData.map(commentToOutputMapper);
};
