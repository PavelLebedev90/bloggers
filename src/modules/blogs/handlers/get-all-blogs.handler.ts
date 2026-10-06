import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { BlogOutputModelWithMeta } from "../types/blogs-output.type";
import { blogsToOutputMapper } from "../mappers/blog-to-output.mapper";
import { BlogQueryInputModel } from "../types/blogs-query-input.type";
import { blogsQueryRepository } from "../repository/blogs-query.repository";

export const getAllBlogsHandler = async (
  _req: Request,
  res: Response<
    BlogOutputModelWithMeta,
    {
      query: BlogQueryInputModel;
    }
  >,
) => {
  const { items, totalCount } = await blogsQueryRepository.getAll(res.locals.query);
  res.status(HttpStatus.Ok).send({
    items: blogsToOutputMapper(items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: totalCount,
    pagesCount: Math.ceil(totalCount / res.locals.query.pageSize),
  });
};
