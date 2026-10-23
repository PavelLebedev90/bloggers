import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { CommentInputModel } from "../types/comments-input.type";
import { commentsService } from "../service/comments.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";

export const updateCommentHandler = async (
  _req: Request,
  res: Response<
    undefined | ValidationErrorMessages,
    {
      params: { commentId: string };
      body: CommentInputModel;
      user: JWTUserInfo;
    }
  >,
) => {
  const result = await commentsService.updateComment(
    res.locals.user.userId,
    res.locals.params.commentId,
    res.locals.body,
  );
  sendResult({ res, result });
};
