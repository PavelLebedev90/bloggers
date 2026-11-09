import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { BlogInputModel } from "../types/blogs-input.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogsService } from "../service/blogs.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const updateBlogHandler = async (
  req: SanitizedRequest<BlogInputModel, unknown, { id: string }>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const bodyBlog = blogToDBMapper(req.validData.body);
  const result = await blogsService.updateBlog(req.validData.params.id, bodyBlog);
  sendResult({ res, result });
};
