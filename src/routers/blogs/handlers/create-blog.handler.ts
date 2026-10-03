import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { BlogInputModel } from "../types/blogs-input.type";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogToOutputMapper } from "../mappers/blog-to-output.mapper";
import { blogsService } from "../service/blogs.service";

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
  const newBlog = await blogsService.createBlog({
    ...bodyBlog,
    createdAt: new Date(),
    isMembership: false,
  });
  res.status(HttpStatus.Created).send(blogToOutputMapper(newBlog));
};
