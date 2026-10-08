import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { CommentOutputModel } from "../types/comments-output.type";
import { commentsQueryRepository } from "../repository/comments-query.repository";
import { commentToOutputMapper } from "../mappers/comment-to-output.mapper";

export const getCommentHandler = async (
  _req: Request,
  res: Response<
    CommentOutputModel,
    {
      params: { commentId: string };
    }
  >,
) => {
  const comment = await commentsQueryRepository.getComment(res.locals.params.commentId);
  res.status(HttpStatus.Ok).send(commentToOutputMapper(comment));
};
