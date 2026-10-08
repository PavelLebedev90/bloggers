import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { CommentOutputModel } from "../types/comments-output.type";
import { CommentInputModel } from "../types/comments-input.type";
import { commentsService } from "../service/comments.service";

export const updateCommentHandler = async (
  _req: Request,
  res: Response<
    CommentOutputModel | ValidationErrorMessages,
    {
      params: { commentId: string };
      body: CommentInputModel;
      userId: string;
    }
  >,
) => {
  await commentsService.updateComment(
    res.locals.userId,
    res.locals.params.commentId,
    res.locals.body,
  );
  res.sendStatus(HttpStatus.NoContent);
};
