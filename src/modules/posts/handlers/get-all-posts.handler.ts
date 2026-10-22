import { Response, Request } from "express";
import { PostOutputModel, PostOutputModelWithMeta } from "../types/posts-output.type";
import { PostQueryInputModel } from "../types/posts-query-input.type";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const getAllPostsHandler = async (
  _req: Request,
  res: Response<
    PostOutputModelWithMeta,
    {
      query: PostQueryInputModel;
    }
  >,
) => {
  const result = await postsQueryRepository.getAll(res.locals.query);
  sendResult({
    res,
    result,
    mapper: (data: { items: PostOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / res.locals.query.pageSize),
    }),
  });
};
