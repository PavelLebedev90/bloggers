import { Response, Request } from "express";
import { PostOutputModelWithMeta } from "../../posts/types/posts-output.type";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { PostQueryInputModel } from "../../posts/types/posts-query-input.type";
import { postsToOutputMapper } from "../../posts/mappers/post-to-output.mapper";
import { blogsQueryRepository } from "../repository/blogs-query.repository";

export const getPostsByBlogIdHandler = async (
  _req: Request,
  res: Response<
    PostOutputModelWithMeta,
    {
      params: { blogId: string };
      query: PostQueryInputModel;
    }
  >,
) => {
  const { items, totalCount } = await blogsQueryRepository.getAllPostsByBlogId({
    ...res.locals.query,
    blogId: res.locals.params.blogId,
  });

  res.status(HttpStatus.Ok).send({
    items: postsToOutputMapper(items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: totalCount,
    pagesCount: Math.ceil(totalCount / res.locals.query.pageSize),
  });
};
