import { Response, Request } from "express";
import { CommentOutputModel } from "../types/comments-output.type";
import { commentsQueryRepository } from "../repository/comments-query.repository";
import { commentToOutputMapper } from "../mappers/comment-to-output.mapper";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";

export const getCommentHandler = async (
  _req: Request,
  res: Response<
    CommentOutputModel | ValidationErrorMessages,
    {
      params: { commentId: string };
    }
  >,
) => {
  const result = await commentsQueryRepository.getComment(res.locals.params.commentId);
  sendResult(res, result, commentToOutputMapper);
};
