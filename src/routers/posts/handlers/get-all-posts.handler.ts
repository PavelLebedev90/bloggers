import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { PostOutputModelWithMeta } from "../types/posts-output.type";
import { postsToOutputMapper } from "../mappers/post-to-output.mapper";
import { PostQueryInputModel } from "../types/posts-query-input.type";
import { postsService } from "../service/posts.service";

export const getAllPostsHandler = async (
  _req: Request,
  res: Response<
    PostOutputModelWithMeta,
    {
      query: PostQueryInputModel;
    }
  >,
) => {
  const { items, totalCount } = await postsService.getAll(res.locals.query);
  res.status(HttpStatus.Ok).send({
    items: postsToOutputMapper(items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: totalCount,
    pageCount: Math.ceil(totalCount / res.locals.query.pageSize),
  });
};
