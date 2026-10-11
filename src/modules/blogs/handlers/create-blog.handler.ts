import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { BlogInputModel } from "../types/blogs-input.type";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogToOutputMapper } from "../mappers/blog-to-output.mapper";
import { blogsService } from "../service/blogs.service";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { HttpStatus } from "../../../core/types/http-statuses.type";

export const createBlogHandler = async (
  _req: Request,
  res: Response<
    BlogOutputModel | ValidationErrorMessages,
    {
      body: BlogInputModel;
    }
  >,
) => {
  const bodyBlog = blogToDBMapper(res.locals.body);
  const resultWithBlogId = await blogsService.createBlog({
    ...bodyBlog,
    createdAt: new Date(),
    isMembership: false,
  });
  if (isError(resultWithBlogId)) {
    return sendError({
      res,
      httpStatus: HttpStatus[resultWithBlogId.status],
      errors: resultWithBlogId.extensions,
    });
  }
  const result = await blogsQueryRepository.getBlog(resultWithBlogId.data);
  if (isError(result)) return sendResult(res, result);
  sendResult(res, { ...result, status: resultWithBlogId.status }, blogToOutputMapper);
};
