import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { blogsRepository } from "../../blogs/repository/blogs.repository";
import { BlogInputModel } from "../types/blogs-input.type";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogToDBMapper } from "../mappers/blog-to-db.mapper";
import { blogToOutputMapper } from "../mappers/blog-to-output.mapper";

export const createBlogHandler = async (
  req: Request<unknown, unknown, BlogInputModel>,
  res: Response<BlogOutputModel | ValidationErrorMessages>,
) => {
  const bodyBlog = blogToDBMapper(req.body);
  const newBlog = await blogsRepository.createBlog({
    ...bodyBlog,
    createdAt: new Date(),
    isMembership: false,
  });
  res.status(HttpStatus.Created).send(blogToOutputMapper(newBlog));
};
