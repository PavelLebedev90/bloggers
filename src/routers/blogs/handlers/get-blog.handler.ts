import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error-messages.const";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogsRepository } from "../repository/blogs.repository";
import { blogToOutputMapper } from "../mappers/blog-to-output.mapper";

export const getBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response<BlogOutputModel>,
) => {
  const dbBlog = await blogsRepository.getBlog(req.params.id);

  if (!dbBlog) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("id", "blog")],
    });
  }
  res.status(HttpStatus.Ok).send(blogToOutputMapper(dbBlog));
};
