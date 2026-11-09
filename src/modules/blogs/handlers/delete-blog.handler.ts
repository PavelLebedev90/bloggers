import { Response } from "express";
import { blogsService } from "../service/blogs.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { SanitizedRequest } from "../../../core/types/express.type";

export const deleteBlogHandler = async (
  req: SanitizedRequest<unknown, unknown, { id: string }>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const result = await blogsService.deleteBlog(req.validData.params.id);
  sendResult({
    res,
    result,
  });
};
