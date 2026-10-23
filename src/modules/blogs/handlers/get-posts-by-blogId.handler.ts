import { Response, Request } from "express";
import { PostOutputModel, PostOutputModelWithMeta } from "../../posts/types/posts-output.type";
import { PostQueryInputModel } from "../../posts/types/posts-query-input.type";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";

export const getPostsByBlogIdHandler = async (
  _req: Request,
  res: Response<
    PostOutputModelWithMeta | ValidationErrorMessages,
    {
      params: { blogId: string };
      query: PostQueryInputModel;
    }
  >,
) => {
  const result = await blogsQueryRepository.getAllPostsByBlogId({
    ...res.locals.query,
    blogId: res.locals.params.blogId,
  });
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
