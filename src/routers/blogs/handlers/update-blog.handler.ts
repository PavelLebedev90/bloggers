import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { blogsRepository } from "../../blogs/repository/blogs.repository";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error-messages.const";
import { BlogInputModel } from "../types/blogs-input.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";

export const updateBlogHandler = async (
  req: Request<{ id: string }, unknown, BlogInputModel>,
  res: Response<undefined | ValidationErrorMessages>,
) => {
  const bodyBlog = blogToDBMapper(req.body);

  const isUpdated = await blogsRepository.updateBlog(req.params.id, bodyBlog);

  if (!isUpdated) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("id", "blog")],
    });
  }

  res.sendStatus(HttpStatus.NoContent);
};
