import { Response, Request } from "express";
import { postsService } from "../service/posts.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ResultSuccessStatus } from "../../../core/types/validation-error.type";

export const deletePostHandler = async (
  _req: Request,
  res: Response<unknown, { params: { id: string } }>,
) => {
  const result = await postsService.deletePost(res.locals.params.id);
  sendResult<ResultSuccessStatus.NoContent>(res, result);
};
