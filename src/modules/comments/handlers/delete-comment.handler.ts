import { Response, Request } from "express";
import { commentsService } from "../service/comments.service";
import {
  ResultSuccessStatus,
  ValidationErrorMessages,
} from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const deleteCommentHandler = async (
  _req: Request,
  res: Response<
    undefined | ValidationErrorMessages,
    { params: { commentId: string }; userId: string }
  >,
) => {
  const result = await commentsService.deleteComment(
    res.locals.userId,
    res.locals.params.commentId,
  );
  sendResult<ResultSuccessStatus.NoContent>(res, result);
};
