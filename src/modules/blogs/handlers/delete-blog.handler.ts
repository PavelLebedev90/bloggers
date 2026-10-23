import { Response, Request } from "express";
import { blogsService } from "../service/blogs.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { ResultSuccessStatus } from "../../../core/types/result.type";

export const deleteBlogHandler = async (
  _req: Request,
  res: Response<undefined | ValidationErrorMessages, { params: { id: string } }>,
) => {
  const result = await blogsService.deleteBlog(res.locals.params.id);
  sendResult({
    res,
    result,
    overwriteSuccessStatus: ResultSuccessStatus.NoContent,
  });
};
