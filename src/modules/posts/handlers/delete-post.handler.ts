import { Response } from "express";
import { postsService } from "../service/posts.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";

export const deletePostHandler = async (
  req: SanitizedRequest<unknown, unknown, { id: string }>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const result = await postsService.deletePost(req.validData.params.id);
  sendResult({ res, result });
};
