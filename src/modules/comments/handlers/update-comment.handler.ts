import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { CommentInputModel } from "../types/comments-input.type";
import { commentsService } from "../service/comments.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const updateCommentHandler = async (
  req: SanitizedRequest<CommentInputModel, unknown, { commentId: string }, unknown, JWTUserInfo>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const result = await commentsService.updateComment(
    req.userSession.userId,
    req.validData.params.commentId,
    req.validData.body,
  );
  sendResult({ res, result });
};
