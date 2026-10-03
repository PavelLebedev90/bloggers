import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { BlogInputModel } from "../types/blogs-input.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogsService } from "../service/blogs.service";

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
  await blogsService.updateBlog(res.locals.params.id, bodyBlog);
  res.sendStatus(HttpStatus.NoContent);
};
