import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogToOutputMapper } from "../mappers/blog-to-output.mapper";
import { blogsService } from "../service/blogs.service";

export const getBlogHandler = async (
  _req: Request,
  res: Response<
    BlogOutputModel,
    {
      params: { id: string };
    }
  >,
) => {
  const dbBlog = await blogsService.getBlog(res.locals.params.id);
  res.status(HttpStatus.Ok).send(blogToOutputMapper(dbBlog));
};
