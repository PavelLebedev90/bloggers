import { Response } from "express";
import { commentsService } from "../service/comments.service";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const deleteCommentHandler = async (
  req: SanitizedRequest<unknown, unknown, { commentId: string }, unknown, JWTUserInfo>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const result = await commentsService.deleteComment(
    req.userSession.userId,
    req.validData.params.commentId,
  );
  sendResult({ res, result });
};
