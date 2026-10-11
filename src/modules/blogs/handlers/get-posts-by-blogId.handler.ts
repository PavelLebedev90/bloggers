import { Response, Request } from "express";
import { PostOutputModelWithMeta } from "../../posts/types/posts-output.type";
import { PostQueryInputModel } from "../../posts/types/posts-query-input.type";
import { postsToOutputMapper } from "../../posts/mappers/post-to-output.mapper";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { PostDBModel } from "../../posts/types/posts-db.type";
import { WithId } from "mongodb";
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
  sendResult(res, result, (data: { items: WithId<PostDBModel>[]; totalCount: number }) => ({
    items: postsToOutputMapper(data.items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: data.totalCount,
    pagesCount: Math.ceil(data.totalCount / res.locals.query.pageSize),
  }));
};
