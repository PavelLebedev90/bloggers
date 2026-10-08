import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { CommentInputModel } from "../../comments/types/comments-input.type";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { commentToDBMapper } from "../../comments/mappers/comment-to-db.mapper";
import { CommentOutputModel } from "../../comments/types/comments-output.type";
import { commentsService } from "../../comments/service/comments.service";
import { commentsQueryRepository } from "../../comments/repository/comments-query.repository";
import { commentToOutputMapper } from "../../comments/mappers/comment-to-output.mapper";

export const createCommentByPostIdHandler = async (
  _req: Request,
  res: Response<
    CommentOutputModel | ValidationErrorMessages,
    {
      params: { postId: string };
      userId: string;
      body: CommentInputModel;
    }
  >,
) => {
  const user = await usersQueryRepository.getUser(res.locals.userId);
  const dbComment = commentToDBMapper(res.locals.body, user);
  const newCommentId = await commentsService.createComment({
    ...dbComment,
    createdAt: new Date(),
    postId: res.locals.params.postId,
  });
  const newComment = await commentsQueryRepository.getComment(newCommentId);
  res.status(HttpStatus.Created).send(commentToOutputMapper(newComment));
};
