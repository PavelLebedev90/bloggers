import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { commentsService } from "../service/comments.service";

export const deleteCommentHandler = async (
  _req: Request,
  res: Response<unknown, { params: { commentId: string }; userId: string }>,
) => {
  await commentsService.deleteComment(res.locals.userId, res.locals.params.commentId);
  res.sendStatus(HttpStatus.NoContent);
};
