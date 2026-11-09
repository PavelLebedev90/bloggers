import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { BlogInputModel } from "../types/blogs-input.type";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogsService } from "../service/blogs.service";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const createBlogHandler = async (
  req: SanitizedRequest<BlogInputModel>,
  res: Response<BlogOutputModel | ValidationErrorMessages>,
) => {
  const bodyBlog = blogToDBMapper(req.validData.body);
  const resultWithBlogId = await blogsService.createBlog({
    ...bodyBlog,
    createdAt: new Date(),
    isMembership: false,
  });
  const result = await blogsQueryRepository.getBlog(resultWithBlogId.data);
  sendResult({
    res,
    result,
    overwriteSuccessStatus: resultWithBlogId.status,
  });
};
