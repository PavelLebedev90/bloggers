import { Response, Request } from "express";
import { PostOutputModelWithMeta } from "../types/posts-output.type";
import { postsToOutputMapper } from "../mappers/post-to-output.mapper";
import { PostQueryInputModel } from "../types/posts-query-input.type";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { WithId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";

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
  sendResult(res, result, (data: { items: WithId<PostDBModel>[]; totalCount: number }) => ({
    items: postsToOutputMapper(data.items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: data.totalCount,
    pagesCount: Math.ceil(data.totalCount / res.locals.query.pageSize),
  }));
};
