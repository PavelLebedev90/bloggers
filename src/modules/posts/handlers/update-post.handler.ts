import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../types/posts-input.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postsService } from "../service/posts.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const updatePostHandler = async (
  req: SanitizedRequest<PostInputModel, unknown, { id: string }>,
  res: Response<PostOutputModel | ValidationErrorMessages>,
) => {
  const result = await postsService.updatePost(req.validData.params.id, req.validData.body);
  sendResult({ res, result });
};
