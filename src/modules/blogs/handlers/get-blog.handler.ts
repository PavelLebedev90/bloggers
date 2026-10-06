import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogToOutputMapper } from "../mappers/blog-to-output.mapper";
import { blogsQueryRepository } from "../repository/blogs-query.repository";

export const getBlogHandler = async (
  _req: Request,
  res: Response<
    BlogOutputModel,
    {
      params: { id: string };
    }
  >,
) => {
  const dbBlog = await blogsQueryRepository.getBlog(res.locals.params.id);
  res.status(HttpStatus.Ok).send(blogToOutputMapper(dbBlog));
};
