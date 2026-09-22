import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { blogsRepository } from "../../blogs/repository/blogs.repository";
import { BlogCreateModel } from "../types/blogs-input.type";
import { BlogResponseModel } from "../types/blogs-output.type";

export const createBlogHandler = async (
  req: Request<unknown, unknown, BlogCreateModel>,
  res: Response<BlogResponseModel | ValidationErrorMessages>,
) => {
  const newBlog = await blogsRepository.createBlog(req.body);
  res.status(HttpStatus.Created).send(newBlog);
};
