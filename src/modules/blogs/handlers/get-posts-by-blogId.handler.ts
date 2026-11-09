import { Response } from "express";
import { PostOutputModel, PostOutputModelWithMeta } from "../../posts/types/posts-output.type";
import { PostQueryInputModel } from "../../posts/types/posts-query-input.type";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getPostsByBlogIdHandler = async (
  req: SanitizedRequest<unknown, PostQueryInputModel, { blogId: string }>,
  res: Response<PostOutputModelWithMeta | ValidationErrorMessages>,
) => {
  const result = await blogsQueryRepository.getAllPostsByBlogId({
    ...req.validData.query,
    blogId: req.validData.params.blogId,
  });
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
