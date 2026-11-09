import { Response } from "express";
import { PostOutputModel, PostOutputModelWithMeta } from "../types/posts-output.type";
import { PostQueryInputModel } from "../types/posts-query-input.type";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getAllPostsHandler = async (
  req: SanitizedRequest<unknown, PostQueryInputModel>,
  res: Response<PostOutputModelWithMeta>,
) => {
  const result = await postsQueryRepository.getAll(req.validData.query);
  sendResult({
    res,
    result,
    mapper: (data: { items: PostOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: req.validData.query.pageNumber,
      pageSize: req.validData.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / req.validData.query.pageSize),
    }),
  });
};
