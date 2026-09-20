import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { blogsRepository } from "../../blogs/repository/blogs.repository";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error-messages.const";
import { BlogUpdateModel } from "../types/blogs-input.type";

export const updateBlogHandler = (
  req: Request<{ id: string }, unknown, BlogUpdateModel>,
  res: Response<BlogUpdateModel | ValidationErrorMessages>,
) => {
  const isUpdated = blogsRepository.updateBlog(req.params.id, req.body);

  if (!isUpdated) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("id", "blog")],
    });
  }

  res.sendStatus(HttpStatus.NoContent);
};
