import { Response } from "express";
import { CommentOutputModel } from "../types/comments-output.type";
import { commentsQueryRepository } from "../repository/comments-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getCommentHandler = async (
  req: SanitizedRequest<unknown, unknown, { commentId: string }>,
  res: Response<CommentOutputModel | ValidationErrorMessages>,
) => {
  const result = await commentsQueryRepository.getComment(req.validData.params.commentId);
  sendResult({ res, result });
};
