import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { BlogInputModel } from "../types/blogs-input.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogsService } from "../service/blogs.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ResultSuccessStatus } from "../../../core/types/result.type";

export const updateBlogHandler = async (
  _req: Request,
  res: Response<
    undefined | ValidationErrorMessages,
    {
      params: { id: string };
      body: BlogInputModel;
    }
  >,
) => {
  const bodyBlog = blogToDBMapper(res.locals.body);
  const result = await blogsService.updateBlog(res.locals.params.id, bodyBlog);
  sendResult<ResultSuccessStatus.NoContent>(res, result);
};
